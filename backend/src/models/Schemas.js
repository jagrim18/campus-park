import mongoose from 'mongoose';

const { Schema } = mongoose;

// 1. CAMPUSES (Root of Campus-Level Isolation)
const CampusSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  ratePerHr: { type: Number, default: 20 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// 2. USERS
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'security', 'user'], default: 'user' },
  category: { type: String, enum: ['Student', 'Faculty', 'Visitor'], default: 'Student' },
  assignedCampusId: { type: Schema.Types.ObjectId, ref: 'Campus', default: null }
}, { timestamps: true });

// 3. VEHICLES (Owned by Users)
const VehicleSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  plateNumber: { type: String, required: true, unique: true, uppercase: true },
  model: { type: String, required: true },
  vehicleType: { type: String, enum: ['2W', '4W', 'EV'], default: '4W' }
}, { timestamps: true });

// 4. PARKING LOTS (Contained in Campuses)
const ParkingLotSchema = new Schema({
  campusId: { type: Schema.Types.ObjectId, ref: 'Campus', required: true, index: true },
  name: { type: String, required: true },
  totalFloors: { type: Number, default: 1 }
}, { timestamps: true });

// 5. PARKING SLOTS (Contained in Parking Lots)
const ParkingSlotSchema = new Schema({
  campusId: { type: Schema.Types.ObjectId, ref: 'Campus', required: true, index: true },
  lotId: { type: Schema.Types.ObjectId, ref: 'ParkingLot', required: true },
  slotCode: { type: String, required: true },
  floor: { type: String, default: '1st Floor' },
  zone: { type: String, default: 'A' },
  slotType: { type: String, enum: ['2W', '4W', 'EV', 'VIP', 'Disabled'], default: '4W' },
  status: { type: String, enum: ['available', 'reserved', 'occupied', 'maintenance'], default: 'available' },
  currentVehiclePlate: { type: String, default: null }
}, { timestamps: true });

// 6. RESERVATIONS (Converges User, Vehicle, and ParkingSlot)
const ReservationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  campusId: { type: Schema.Types.ObjectId, ref: 'Campus', required: true, index: true },
  slotId: { type: Schema.Types.ObjectId, ref: 'ParkingSlot', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { type: String, enum: ['confirmed', 'checked_in', 'completed', 'cancelled', 'expired'], default: 'confirmed' }
}, { timestamps: true });

// 7. QR PASSES (1:1 with Reservation, prevents replay attacks)
const QRPassSchema = new Schema({
  reservationId: { type: Schema.Types.ObjectId, ref: 'Reservation', required: true, unique: true },
  campusId: { type: Schema.Types.ObjectId, ref: 'Campus', required: true },
  token: { type: String, required: true, unique: true },
  isUsed: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

// 8. PARKING SESSIONS (Created when Security scans QR at Gate Entry)
const ParkingSessionSchema = new Schema({
  reservationId: { type: Schema.Types.ObjectId, ref: 'Reservation', required: true },
  campusId: { type: Schema.Types.ObjectId, ref: 'Campus', required: true, index: true },
  slotId: { type: Schema.Types.ObjectId, ref: 'ParkingSlot', required: true },
  vehiclePlate: { type: String, required: true },
  entryTime: { type: Date, default: Date.now },
  exitTime: { type: Date, default: null },
  status: { type: String, enum: ['active', 'completed'], default: 'active' }
}, { timestamps: true });

// 9. PAYMENTS (Generated from Parking Session)
const PaymentSchema = new Schema({
  sessionId: { type: Schema.Types.ObjectId, ref: 'ParkingSession', required: true },
  campusId: { type: Schema.Types.ObjectId, ref: 'Campus', required: true },
  amountINR: { type: Number, required: true },
  gatewayRef: { type: String, default: 'RAZORPAY_SIM' },
  status: { type: String, enum: ['paid', 'pending', 'refunded'], default: 'paid' }
}, { timestamps: true });

// 10. INCIDENTS & SECURITY ASSIGNMENTS
const IncidentSchema = new Schema({
  campusId: { type: Schema.Types.ObjectId, ref: 'Campus', required: true, index: true },
  reportedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  vehiclePlate: { type: String, required: true },
  incidentType: { type: String, required: true },
  notes: { type: String },
  status: { type: String, enum: ['Open', 'Resolved'], default: 'Open' }
}, { timestamps: true });

export const Campus = mongoose.model('Campus', CampusSchema);
export const User = mongoose.model('User', UserSchema);
export const Vehicle = mongoose.model('Vehicle', VehicleSchema);
export const ParkingLot = mongoose.model('ParkingLot', ParkingLotSchema);
export const ParkingSlot = mongoose.model('ParkingSlot', ParkingSlotSchema);
export const Reservation = mongoose.model('Reservation', ReservationSchema);
export const QRPass = mongoose.model('QRPass', QRPassSchema);
export const ParkingSession = mongoose.model('ParkingSession', ParkingSessionSchema);
export const Payment = mongoose.model('Payment', PaymentSchema);
export const Incident = mongoose.model('Incident', IncidentSchema);
