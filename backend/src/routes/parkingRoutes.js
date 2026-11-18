import express from 'express';
import mongoose from 'mongoose';
import crypto from 'crypto';
import {
  Campus, ParkingSlot, Reservation, QRPass, ParkingSession, Payment, Incident
} from '../models/Schemas.js';
import { authenticate, requireRole, enforceCampusIsolation } from '../middleware/auth.js';

const router = express.Router();

// Get all active campuses
router.get('/campuses', async (_req, res) => {
  const campuses = await Campus.find({ isActive: true });
  res.json(campuses);
});

// Get real-time slots for a campus
router.get('/campuses/:campusId/slots', async (req, res) => {
  const slots = await ParkingSlot.find({ campusId: req.params.campusId });
  res.json(slots);
});

// Atomic Slot Reservation + Single-Use QR Pass Generation
router.post('/reservations', authenticate, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { vehicleId, campusId, slotId, startTime, endTime } = req.body;

    // Atomic check-and-lock prevents double booking under high concurrency
    const lockedSlot = await ParkingSlot.findOneAndUpdate(
      { _id: slotId, campusId, status: 'available' },
      { $set: { status: 'reserved' } },
      { new: true, session }
    );

    if (!lockedSlot) {
      await session.abortTransaction();
      return res.status(409).json({ error: 'Slot is no longer available' });
    }

    const [reservation] = await Reservation.create(
      [{ userId: req.user.id, vehicleId, campusId, slotId, startTime, endTime }],
      { session }
    );

    const qrToken = `SP-QR-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const [qrPass] = await QRPass.create(
      [{ reservationId: reservation._id, campusId, token: qrToken, expiresAt: endTime }],
      { session }
    );

    await session.commitTransaction();
    req.io?.to(`campus_${campusId}`).emit('slot_updated', lockedSlot);

    res.status(201).json({ reservation, qrPass });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ error: err.message });
  } finally {
    session.endSession();
  }
});

// Security Gate Entry Verification (Campus-Isolated)
router.post(
  '/security/verify-entry',
  authenticate,
  requireRole('security', 'admin'),
  enforceCampusIsolation,
  async (req, res) => {
    const { token, vehiclePlate } = req.body;
    const qrPass = await QRPass.findOne({ token, isUsed: false });

    if (!qrPass) {
      return res.status(400).json({ error: 'Invalid or already used QR Pass' });
    }

    if (req.isolatedCampusId && String(qrPass.campusId) !== String(req.isolatedCampusId)) {
      return res.status(403).json({ error: 'QR Pass belongs to a different campus' });
    }

    qrPass.isUsed = true;
    await qrPass.save();

    const reservation = await Reservation.findByIdAndUpdate(
      qrPass.reservationId,
      { status: 'checked_in' },
      { new: true }
    );

    const slot = await ParkingSlot.findByIdAndUpdate(
      reservation.slotId,
      { status: 'occupied', currentVehiclePlate: vehiclePlate },
      { new: true }
    );

    const parkingSession = await ParkingSession.create({
      reservationId: reservation._id,
      campusId: reservation.campusId,
      slotId: reservation.slotId,
      vehiclePlate
    });

    req.io?.to(`campus_${reservation.campusId}`).emit('slot_updated', slot);
    res.json({ message: 'Entry approved', parkingSession, slot });
  }
);

// Security Gate Vehicle Exit & Auto-Release Slot
router.post(
  '/security/process-exit/:sessionId',
  authenticate,
  requireRole('security', 'admin'),
  enforceCampusIsolation,
  async (req, res) => {
    const parkingSession = await ParkingSession.findById(req.params.sessionId);
    if (!parkingSession || parkingSession.status === 'completed') {
      return res.status(404).json({ error: 'Active parking session not found' });
    }

    const exitTime = new Date();
    const hours = Math.max(1, Math.ceil((exitTime - parkingSession.entryTime) / (1000 * 60 * 60)));
    const campus = await Campus.findById(parkingSession.campusId);
    const amountINR = req.body.isVisitor ? hours * (campus?.ratePerHr || 20) : 0;

    parkingSession.exitTime = exitTime;
    parkingSession.status = 'completed';
    await parkingSession.save();

    const releasedSlot = await ParkingSlot.findByIdAndUpdate(
      parkingSession.slotId,
      { status: 'available', currentVehiclePlate: null },
      { new: true }
    );

    let payment = null;
    if (amountINR > 0) {
      payment = await Payment.create({
        sessionId: parkingSession._id,
        campusId: parkingSession.campusId,
        amountINR
      });
    }

    req.io?.to(`campus_${parkingSession.campusId}`).emit('slot_updated', releasedSlot);
    res.json({ message: 'Exit completed & slot released', parkingSession, payment });
  }
);

export default router;
