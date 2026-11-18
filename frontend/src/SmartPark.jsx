import React, { useState, useMemo } from 'react';
import {
  Search, Settings, Plus, MapPin, Navigation, Bookmark, Share2, Phone,
  Car, Bike, Zap, ShieldCheck, QrCode, CheckCircle2, XCircle, Clock,
  AlertTriangle, Building2, Users, CreditCard, BarChart3, ChevronLeft,
  ChevronRight, ArrowUpRight, ArrowDownRight, Sparkles, SlidersHorizontal,
  LogOut, LogIn, Layers, Info, Check, Eye
} from 'lucide-react';

// --- INITIAL SEED DATA ALIGNED WITH ER SCHEMA ---
const INITIAL_CAMPUSES = [
  {
    id: 'CAMP-01',
    name: 'Main Engineering Campus',
    code: 'MEC-KOTA',
    address: 'Block A, Tech Corridor, Kota, Rajasthan 324005',
    distance: '1.2 km',
    travelTime: '8 mins',
    ratePerHr: 20,
    rating: 4.8,
    reviews: 214,
    phone: '+91 98290 11223',
    hours: 'Open 24 Hours',
    lots: ['LOT-A', 'LOT-B'],
    image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'CAMP-02',
    name: 'North Medical & Research Hub',
    code: 'NMR-02',
    address: 'Sector 4, Health Sciences Ave, Jaipur, Rajasthan 302029',
    distance: '2.8 km',
    travelTime: '14 mins',
    ratePerHr: 30,
    rating: 4.6,
    reviews: 148,
    phone: '+91 98290 44556',
    hours: 'Open • Closes 11:30 PM',
    lots: ['LOT-C'],
    image: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'CAMP-03',
    name: 'South Management & Law Block',
    code: 'SML-03',
    address: 'University Ring Road, South Gate, Kota, Rajasthan 324010',
    distance: '3.5 km',
    travelTime: '18 mins',
    ratePerHr: 15,
    rating: 4.5,
    reviews: 96,
    phone: '+91 98290 77889',
    hours: 'Open • Closes 10:00 PM',
    lots: ['LOT-D'],
    image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=900&q=80'
  }
];

const INITIAL_SLOTS = [
  // Campus 1 - Floor 1 (Zone A)
  { id: 'A1-01', campusId: 'CAMP-01', lotId: 'LOT-A', floor: '1st Floor', zone: 'A', type: '4W', status: 'occupied', vehicleNo: 'RJ-20-CA-4821' },
  { id: 'A1-02', campusId: 'CAMP-01', lotId: 'LOT-A', floor: '1st Floor', zone: 'A', type: '4W', status: 'available' },
  { id: 'A1-03', campusId: 'CAMP-01', lotId: 'LOT-A', floor: '1st Floor', zone: 'A', type: 'EV', status: 'available' },
  { id: 'A1-04', campusId: 'CAMP-01', lotId: 'LOT-A', floor: '1st Floor', zone: 'A', type: '4W', status: 'occupied', vehicleNo: 'RJ-14-DB-9012' },
  { id: 'A1-05', campusId: 'CAMP-01', lotId: 'LOT-A', floor: '1st Floor', zone: 'A', type: 'VIP', status: 'available' },
  { id: 'A1-06', campusId: 'CAMP-01', lotId: 'LOT-A', floor: '1st Floor', zone: 'A', type: '4W', status: 'reserved', vehicleNo: 'RJ-20-XY-1104' },
  // Campus 1 - Floor 1 (Zone B)
  { id: 'B1-01', campusId: 'CAMP-01', lotId: 'LOT-A', floor: '1st Floor', zone: 'B', type: '4W', status: 'available' },
  { id: 'B1-02', campusId: 'CAMP-01', lotId: 'LOT-A', floor: '1st Floor', zone: 'B', type: '4W', status: 'occupied', vehicleNo: 'DL-01-AB-3321' },
  { id: 'B1-03', campusId: 'CAMP-01', lotId: 'LOT-A', floor: '1st Floor', zone: 'B', type: '2W', status: 'available' },
  { id: 'B1-04', campusId: 'CAMP-01', lotId: 'LOT-A', floor: '1st Floor', zone: 'B', type: '4W', status: 'available' },
  { id: 'B1-05', campusId: 'CAMP-01', lotId: 'LOT-A', floor: '1st Floor', zone: 'B', type: 'EV', status: 'occupied', vehicleNo: 'RJ-20-EV-0077' },
  { id: 'B1-06', campusId: 'CAMP-01', lotId: 'LOT-A', floor: '1st Floor', zone: 'B', type: '4W', status: 'maintenance' },
  // Campus 1 - Floor 2
  { id: 'B2-53', campusId: 'CAMP-01', lotId: 'LOT-B', floor: '2nd Floor', zone: 'A', type: '4W', status: 'occupied', vehicleNo: 'RJ-20-MK-7812' },
  { id: 'B2-54', campusId: 'CAMP-01', lotId: 'LOT-B', floor: '2nd Floor', zone: 'A', type: '4W', status: 'available' },
  { id: 'B2-55', campusId: 'CAMP-01', lotId: 'LOT-B', floor: '2nd Floor', zone: 'A', type: '4W', status: 'available' },
  { id: 'B2-56', campusId: 'CAMP-01', lotId: 'LOT-B', floor: '2nd Floor', zone: 'B', type: 'EV', status: 'available' },
  { id: 'B2-57', campusId: 'CAMP-01', lotId: 'LOT-B', floor: '2nd Floor', zone: 'B', type: '4W', status: 'occupied', vehicleNo: 'RJ-01-PQ-5541' },
  { id: 'B2-58', campusId: 'CAMP-01', lotId: 'LOT-B', floor: '2nd Floor', zone: 'B', type: '4W', status: 'available' },
  // Campus 2
  { id: 'M1-01', campusId: 'CAMP-02', lotId: 'LOT-C', floor: '1st Floor', zone: 'A', type: '4W', status: 'available' },
  { id: 'M1-02', campusId: 'CAMP-02', lotId: 'LOT-C', floor: '1st Floor', zone: 'A', type: 'EV', status: 'occupied', vehicleNo: 'RJ-14-EV-9911' },
  { id: 'M1-03', campusId: 'CAMP-02', lotId: 'LOT-C', floor: '1st Floor', zone: 'B', type: '4W', status: 'available' },
  { id: 'M1-04', campusId: 'CAMP-02', lotId: 'LOT-C', floor: '1st Floor', zone: 'B', type: 'VIP', status: 'available' },
  // Campus 3
  { id: 'S1-01', campusId: 'CAMP-03', lotId: 'LOT-D', floor: '1st Floor', zone: 'A', type: '4W', status: 'available' },
  { id: 'S1-02', campusId: 'CAMP-03', lotId: 'LOT-D', floor: '1st Floor', zone: 'A', type: '2W', status: 'available' },
  { id: 'S1-03', campusId: 'CAMP-03', lotId: 'LOT-D', floor: '1st Floor', zone: 'B', type: '4W', status: 'occupied', vehicleNo: 'RJ-20-LL-1029' },
  { id: 'S1-04', campusId: 'CAMP-03', lotId: 'LOT-D', floor: '1st Floor', zone: 'B', type: '4W', status: 'available' }
];

const INITIAL_RESERVATIONS = [
  {
    id: 'RES-9041',
    qrToken: 'SP-QR-9041-MEC',
    userId: 'USR-101',
    userName: 'Agrim Jain',
    userCategory: 'Student',
    campusId: 'CAMP-01',
    slotId: 'A1-06',
    vehicleNo: 'RJ-20-XY-1104',
    vehicleModel: 'Hyundai Verna SX',
    arrivalTime: 'Today, 02:00 PM',
    departureTime: 'Today, 06:00 PM',
    status: 'confirmed',
    amountPaid: 0
  }
];

const INITIAL_SESSIONS = [
  {
    id: 'SES-4401',
    reservationId: 'RES-8812',
    campusId: 'CAMP-01',
    slotId: 'A1-01',
    vehicleNo: 'RJ-20-CA-4821',
    driverName: 'Dr. Pawan Kumar',
    category: 'Faculty',
    entryTime: '09:15 AM',
    durationHrs: 4.5,
    status: 'active'
  },
  {
    id: 'SES-4402',
    reservationId: 'RES-8819',
    campusId: 'CAMP-01',
    slotId: 'B1-02',
    vehicleNo: 'DL-01-AB-3321',
    driverName: 'Kovid Sawla',
    category: 'Visitor',
    entryTime: '11:30 AM',
    durationHrs: 2.2,
    status: 'active'
  },
  {
    id: 'SES-4403',
    reservationId: 'RES-8825',
    campusId: 'CAMP-02',
    slotId: 'M1-02',
    vehicleNo: 'RJ-14-EV-9911',
    driverName: 'Divyansh Sharma',
    category: 'Student',
    entryTime: '10:05 AM',
    durationHrs: 3.7,
    status: 'active'
  }
];

const INITIAL_INCIDENTS = [
  {
    id: 'INC-301',
    campusId: 'CAMP-01',
    type: 'Wrong-Slot Parking',
    vehicleNo: 'RJ-20-ZZ-9812',
    slotId: 'A1-05 (VIP)',
    reportedAt: '12:40 PM',
    status: 'Open'
  }
];

// --- HELPER: TOP-DOWN CAR SVG FOR PARKING BAY MAP ---
const TopDownCar = ({ color = '#1E293B', highlight = false }) => (
  <svg viewBox="0 0 80 42" className="w-12 h-6 drop-shadow-sm transition-transform duration-300">
    {/* Wheels */}
    <rect x="14" y="2" width="12" height="4" rx="1.5" fill="#0F172A" />
    <rect x="52" y="2" width="12" height="4" rx="1.5" fill="#0F172A" />
    <rect x="14" y="36" width="12" height="4" rx="1.5" fill="#0F172A" />
    <rect x="52" y="36" width="12" height="4" rx="1.5" fill="#0F172A" />
    {/* Chassis */}
    <rect x="6" y="5" width="68" height="32" rx="10" fill={highlight ? '#FFFFFF' : color} stroke={highlight ? '#BFDBFE' : '#334155'} strokeWidth="1.5" />
    {/* Windshield & Rear Window */}
    <path d="M24 8 L33 9 L33 33 L24 34 Z" fill={highlight ? '#DBEAFE' : '#94A3B8'} />
    <path d="M54 9 L61 10 L61 32 L54 33 Z" fill={highlight ? '#DBEAFE' : '#94A3B8'} />
    {/* Roof */}
    <rect x="34" y="9" width="19" height="24" rx="4" fill={highlight ? '#EFF6FF' : '#E2E8F0'} />
    {/* Headlights */}
    <ellipse cx="72" cy="11" rx="2" ry="3" fill="#FEF08A" />
    <ellipse cx="72" cy="31" rx="2" ry="3" fill="#FEF08A" />
  </svg>
);

// --- HELPER: SEGMENTED TICK PROGRESS BAR (PARKORA STYLE) ---
const SegmentedTicks = ({ percentage = 65, activeColor = '#3B66F5' }) => {
  const totalTicks = 28;
  const activeCount = Math.round((percentage / 100) * totalTicks);
  return (
    <div className="flex items-center gap-[3px] w-full">
      {Array.from({ length: totalTicks }).map((_, idx) => (
        <span
          key={idx}
          className="h-3.5 w-[3px] rounded-full transition-colors duration-300"
          style={{
            backgroundColor: idx < activeCount ? activeColor : '#E5E7EB'
          }}
        />
      ))}
    </div>
  );
};

export default function SmartPark() {
  // Active Role & Navigation
  const [role, setRole] = useState('admin'); // 'admin' | 'user' | 'security'
  const [adminTimeframe, setAdminTimeframe] = useState('Today');
  const [adminNav, setAdminNav] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Core Synchronized Database State
  const [campuses, setCampuses] = useState(INITIAL_CAMPUSES);
  const [slots, setSlots] = useState(INITIAL_SLOTS);
  const [reservations, setReservations] = useState(INITIAL_RESERVATIONS);
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [incidents, setIncidents] = useState(INITIAL_INCIDENTS);
  const [payments, setPayments] = useState([
    { id: 'PAY-701', sessionId: 'SES-4390', vehicleNo: 'RJ-20-AB-1122', amount: 60, method: 'UPI / Razorpay', time: '10:45 AM' },
    { id: 'PAY-702', sessionId: 'SES-4395', vehicleNo: 'RJ-14-CC-8899', amount: 90, method: 'FastTag Wallet', time: '11:20 AM' }
  ]);

  // User Portal State
  const [userStep, setUserStep] = useState('discover'); // 'discover' | 'slots' | 'pass'
  const [selectedCampusId, setSelectedCampusId] = useState('CAMP-01');
  const [selectedFloor, setSelectedFloor] = useState('1st Floor');
  const [selectedSlotId, setSelectedSlotId] = useState('A1-02');
  const [userCategory, setUserCategory] = useState('Student');
  const [userVehicles, setUserVehicles] = useState([
    { id: 'VEH-01', plate: 'RJ-20-XY-1104', model: 'Hyundai Verna SX', type: '4W' },
    { id: 'VEH-02', plate: 'RJ-20-EV-4090', model: 'Tata Nexon EV', type: 'EV' }
  ]);
  const [selectedVehiclePlate, setSelectedVehiclePlate] = useState('RJ-20-XY-1104');
  const [savedCampuses, setSavedCampuses] = useState(['CAMP-01']);
  const [toastMsg, setToastMsg] = useState(null);

  // Security Portal State (Campus Isolated)
  const [securityCampusId, setSecurityCampusId] = useState('CAMP-01');
  const [qrInput, setQrInput] = useState('SP-QR-9041-MEC');
  const [walkInPlate, setWalkInPlate] = useState('');
  const [incidentPlate, setIncidentPlate] = useState('');
  const [incidentNote, setIncidentNote] = useState('Wrong-Slot Parking');

  // Admin Modal State
  const [showAddCampusModal, setShowAddCampusModal] = useState(false);
  const [newCampusName, setNewCampusName] = useState('');
  const [newCampusAddress, setNewCampusAddress] = useState('');
  const [newCampusRate, setNewCampusRate] = useState(25);

  const notify = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // --- COMPUTED METRICS ---
  const totalSlots = slots.length;
  const occupiedCount = slots.filter((s) => s.status === 'occupied').length;
  const reservedCount = slots.filter((s) => s.status === 'reserved').length;
  const availableCount = slots.filter((s) => s.status === 'available').length;
  const occupancyRate = totalSlots ? (((occupiedCount + reservedCount) / totalSlots) * 100).toFixed(2).replace('.', ',') : '0,00';
  const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);

  const activeCampus = campuses.find((c) => c.id === selectedCampusId) || campuses[0];
  const latestReservation = reservations[0];

  // --- ACTIONS ---
  const handleBookSlot = () => {
    const targetSlot = slots.find((s) => s.id === selectedSlotId);
    if (!targetSlot || targetSlot.status !== 'available') {
      notify('Please select an available parking bay first.');
      return;
    }

    const newResId = `RES-${Math.floor(1000 + Math.random() * 9000)}`;
    const newQr = `SP-QR-${newResId.split('-')[1]}-${activeCampus.code.split('-')[0]}`;
    const fee = userCategory === 'Visitor' ? activeCampus.ratePerHr * 2 : 0;

    // 1. Atomic Slot Lock
    setSlots((prev) =>
      prev.map((s) =>
        s.id === selectedSlotId ? { ...s, status: 'reserved', vehicleNo: selectedVehiclePlate } : s
      )
    );

    // 2. Create Reservation & QR Pass
    const newReservation = {
      id: newResId,
      qrToken: newQr,
      userId: 'USR-101',
      userName: 'Agrim Jain',
      userCategory,
      campusId: activeCampus.id,
      slotId: selectedSlotId,
      vehicleNo: selectedVehiclePlate,
      vehicleModel: userVehicles.find((v) => v.plate === selectedVehiclePlate)?.model || 'Registered Vehicle',
      arrivalTime: 'Today, 03:30 PM',
      departureTime: 'Today, 06:30 PM',
      status: 'confirmed',
      amountPaid: fee
    };

    setReservations((prev) => [newReservation, ...prev]);
    if (fee > 0) {
      setPayments((prev) => [
        {
          id: `PAY-${Math.floor(100 + Math.random() * 899)}`,
          sessionId: newResId,
          vehicleNo: selectedVehiclePlate,
          amount: fee,
          method: 'Razorpay UPI',
          time: 'Just now'
        },
        ...prev
      ]);
    }
    setQrInput(newQr);
    setUserStep('pass');
    notify(`Slot ${selectedSlotId} locked! QR Pass ${newQr} generated.`);
  };

  const handleSecurityVerifyEntry = (tokenToVerify) => {
    const match = reservations.find(
      (r) =>
        r.qrToken.toLowerCase() === tokenToVerify.trim().toLowerCase() &&
        r.campusId === securityCampusId &&
        r.status === 'confirmed'
    );

    if (!match) {
      notify('Access Denied: Invalid QR token or assigned to a different campus.');
      return;
    }

    // Update reservation -> checked_in
    setReservations((prev) =>
      prev.map((r) => (r.id === match.id ? { ...r, status: 'checked_in' } : r))
    );

    // Update slot -> occupied
    setSlots((prev) =>
      prev.map((s) =>
        s.id === match.slotId ? { ...s, status: 'occupied', vehicleNo: match.vehicleNo } : s
      )
    );

    // Initialize Parking Session
    const newSession = {
      id: `SES-${Math.floor(1000 + Math.random() * 9000)}`,
      reservationId: match.id,
      campusId: match.campusId,
      slotId: match.slotId,
      vehicleNo: match.vehicleNo,
      driverName: match.userName,
      category: match.userCategory,
      entryTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      durationHrs: 1.0,
      status: 'active'
    };
    setSessions((prev) => [newSession, ...prev]);
    notify(`Gate Barrier Opened: ${match.vehicleNo} checked into ${match.slotId}.`);
  };

  const handleSecurityVehicleExit = (session) => {
    const campusObj = campuses.find((c) => c.id === session.campusId);
    const rate = campusObj ? campusObj.ratePerHr : 20;
    const calculatedCharge = session.category === 'Visitor' ? Math.ceil(session.durationHrs) * rate : 0;

    // Release Slot
    setSlots((prev) =>
      prev.map((s) => (s.id === session.slotId ? { ...s, status: 'available', vehicleNo: undefined } : s))
    );

    // Complete Session
    setSessions((prev) => prev.filter((s) => s.id !== session.id));

    // Record Payment if applicable
    if (calculatedCharge > 0) {
      setPayments((prev) => [
        {
          id: `PAY-${Math.floor(100 + Math.random() * 899)}`,
          sessionId: session.id,
          vehicleNo: session.vehicleNo,
          amount: calculatedCharge,
          method: 'Gate UPI Scan',
          time: 'Just now'
        },
        ...prev
      ]);
    }

    notify(
      `Exit Recorded for ${session.vehicleNo}. Slot ${session.slotId} released.${
        calculatedCharge > 0 ? ` Collected ₹${calculatedCharge}.` : ' Campus Permit (₹0).'
      }`
    );
  };

  const handleToggleSlotMaintenance = (slotId) => {
    setSlots((prev) =>
      prev.map((s) => {
        if (s.id !== slotId) return s;
        if (s.status === 'occupied') {
          notify('Cannot put an occupied bay into maintenance.');
          return s;
        }
        const nextStatus = s.status === 'maintenance' ? 'available' : 'maintenance';
        notify(`Slot ${slotId} marked as ${nextStatus.toUpperCase()}.`);
        return { ...s, status: nextStatus };
      })
    );
  };

  const handleAddCampus = (e) => {
    e.preventDefault();
    if (!newCampusName.trim()) return;
    const newId = `CAMP-0${campuses.length + 1}`;
    const newCampus = {
      id: newId,
      name: newCampusName,
      code: `CMP-0${campuses.length + 1}`,
      address: newCampusAddress || 'New Academic Block, Kota, Rajasthan',
      distance: '1.8 km',
      travelTime: '10 mins',
      ratePerHr: Number(newCampusRate) || 20,
      rating: 4.9,
      reviews: 12,
      phone: '+91 98290 00112',
      hours: 'Open 24 Hours',
      lots: ['LOT-NEW'],
      image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=900&q=80'
    };
    setCampuses((prev) => [...prev, newCampus]);
    setSlots((prev) => [
      ...prev,
      { id: `N${campuses.length + 1}-01`, campusId: newId, lotId: 'LOT-NEW', floor: '1st Floor', zone: 'A', type: '4W', status: 'available' },
      { id: `N${campuses.length + 1}-02`, campusId: newId, lotId: 'LOT-NEW', floor: '1st Floor', zone: 'B', type: 'EV', status: 'available' }
    ]);
    setNewCampusName('');
    setNewCampusAddress('');
    setShowAddCampusModal(false);
    notify(`${newCampus.name} added with 2 live bays.`);
  };

  const kpiMonthlyBars = [
    { month: 'Jan', val: 58 },
    { month: 'Feb', val: 28 },
    { month: 'Mar', val: 19 },
    { month: 'Apr', val: 64 },
    { month: 'May', val: 43 },
    { month: 'Jun', val: 31 },
    { month: 'Jul', val: 81 },
    { month: 'Aug', val: 92 },
    { month: 'Sep', val: 46 },
    { month: 'Oct', val: 76 },
    { month: 'Nov', val: 24 },
    { month: 'Dec', val: 41 }
  ];

  return (
    <div className="min-h-screen bg-[#F6F7F9] text-[#111827] flex flex-col">
      {/* Toast Notification Banner */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#111827] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-sm font-medium animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* TOP GLOBAL HEADER (PARKORA INSPIRED) */}
      <header className="sticky top-0 z-30 bg-[#F6F7F9]/90 backdrop-blur-md border-b border-gray-200/70 px-4 lg:px-8 py-3.5">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#111827] text-white flex items-center justify-center font-bold shadow-sm">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-[#111827]">SmartPark</span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-[#3B66F5]">
                Multi-Campus OS
              </span>
            </div>
          </div>

          {/* Global Pill Search */}
          <div className="hidden md:flex items-center bg-white border border-gray-200/80 rounded-full px-4 py-2 w-80 lg:w-96 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <Search className="w-4 h-4 text-gray-400 mr-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search campus, vehicle plate, or bay..."
              className="bg-transparent text-sm w-full focus:outline-none text-gray-700 placeholder:text-gray-400"
            />
          </div>

          {/* Role Switcher Pills */}
          <div className="flex items-center gap-2 bg-white p-1 rounded-full border border-gray-200/80 shadow-sm">
            {[
              { id: 'admin', label: 'Admin Console', icon: BarChart3 },
              { id: 'user', label: 'User App', icon: MapPin },
              { id: 'security', label: 'Gate Security', icon: ShieldCheck }
            ].map((item) => {
              const Icon = item.icon;
              const active = role === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setRole(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    active
                      ? 'bg-[#3B66F5] text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* =====================================================================
          ROLE 1: ADMIN DASHBOARD (PARKORA CLEAN MINIMALIST BENTO DESIGN)
      ===================================================================== */}
      {role === 'admin' && (
        <div className="max-w-[1440px] w-full mx-auto px-4 lg:px-8 py-6 flex gap-6 flex-1">
          {/* Left Floating Vertical Icon Rail */}
          <aside className="hidden md:flex flex-col items-center justify-between bg-white rounded-full py-4 px-2.5 border border-gray-200/70 shadow-[0_4px_20px_rgba(0,0,0,0.03)] h-[calc(100vh-110px)] sticky top-24">
            <div className="flex flex-col items-center gap-3">
              {[
                { id: 'dashboard', icon: BarChart3, tip: 'Overview' },
                { id: 'campuses', icon: MapPin, tip: 'Campuses & Lots' },
                { id: 'slots', icon: Layers, tip: 'Live Bay Grid' },
                { id: 'passes', icon: QrCode, tip: 'Reservations' },
                { id: 'payments', icon: CreditCard, tip: 'Revenue & Ledger' }
              ].map((nav) => {
                const Icon = nav.icon;
                const isActive = adminNav === nav.id;
                return (
                  <button
                    key={nav.id}
                    onClick={() => setAdminNav(nav.id)}
                    title={nav.tip}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-[#3B66F5] text-white shadow-md shadow-blue-500/25'
                        : 'text-gray-400 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => notify('System audit logs & MongoDB backup verified.')}
              title="System Settings"
              className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-800 hover:bg-gray-100"
            >
              <Settings className="w-4 h-4" />
            </button>
          </aside>

          {/* Main Parkora Bento Canvas */}
          <main className="flex-1 space-y-6">
            {/* Top Sub-bar: Timeframe Pills & + Add Location CTA */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {['Today', 'This Week', 'This Month'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setAdminTimeframe(tf)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      adminTimeframe === tf
                        ? 'bg-white text-gray-900 shadow-sm border border-gray-200/80'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowAddCampusModal(true)}
                className="flex items-center gap-2 bg-[#111827] hover:bg-gray-800 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Campus Location</span>
              </button>
            </div>

            {/* HERO BENTO ROW: 6 Metadata Cards + Sleek Vehicle Profile Visual */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
              <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {[
                  { label: 'Campus Zone', value: activeCampus.name.split(' ')[0] + ' Hub' },
                  { label: 'Active Driver', value: latestReservation?.userName || 'Agrim Jain' },
                  { label: 'Region', value: 'Kota • RJ' },
                  { label: 'Vehicle Class', value: '4W / EV Smart' },
                  { label: 'Parking Code', value: latestReservation?.slotId || 'A1-06' },
                  { label: 'Campus Code', value: activeCampus.code }
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-blue-100 transition-colors"
                  >
                    <p className="text-[11px] font-medium text-gray-400 mb-1">{item.label}</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Right Vehicle Showcase Card (Matching Reference Coupe Profile) */}
              <div className="lg:col-span-5 bg-gradient-to-br from-white via-[#F9FAFB] to-[#EEF2FF] rounded-3xl p-5 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-center justify-between z-10">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#3B66F5] bg-blue-50 px-2.5 py-1 rounded-full">
                    ANPR & QR Verified
                  </span>
                  <span className="text-xs font-mono font-semibold text-gray-500">
                    {latestReservation?.vehicleNo || 'RJ-20-XY-1104'}
                  </span>
                </div>
                <div className="my-3 flex items-center justify-center">
                  {/* Sleek Side-Profile Sedan Vector */}
                  <svg viewBox="0 0 420 130" className="w-full max-w-[330px] h-auto drop-shadow-md">
                    <defs>
                      <linearGradient id="carBody" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#E2E8F0" />
                        <stop offset="45%" stopColor="#FFFFFF" />
                        <stop offset="100%" stopColor="#CBD5E1" />
                      </linearGradient>
                    </defs>
                    {/* Ground shadow */}
                    <ellipse cx="210" cy="112" rx="185" ry="9" fill="#94A3B8" opacity="0.25" />
                    {/* Car Silhouette */}
                    <path
                      d="M35,88 Q32,70 55,64 L115,54 Q155,24 225,24 Q285,24 328,54 L382,64 Q398,70 395,88 L385,95 L42,95 Z"
                      fill="url(#carBody)"
                      stroke="#94A3B8"
                      strokeWidth="1.5"
                    />
                    {/* Cabin Windows */}
                    <path
                      d="M126,53 Q160,31 220,31 L220,53 Z"
                      fill="#1E293B"
                    />
                    <path
                      d="M228,31 Q276,31 312,53 L228,53 Z"
                      fill="#1E293B"
                    />
                    {/* Headlight & Taillight */}
                    <path d="M376,68 L393,72 L386,78 L372,74 Z" fill="#3B66F5" />
                    <path d="M38,68 L52,66 L48,75 L36,75 Z" fill="#EF4444" />
                    {/* Front & Rear Alloy Wheels */}
                    <circle cx="105" cy="94" r="22" fill="#0F172A" />
                    <circle cx="105" cy="94" r="14" fill="#E2E8F0" />
                    <circle cx="105" cy="94" r="6" fill="#334155" />
                    <circle cx="322" cy="94" r="22" fill="#0F172A" />
                    <circle cx="322" cy="94" r="14" fill="#E2E8F0" />
                    <circle cx="322" cy="94" r="6" fill="#334155" />
                  </svg>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 z-10">
                  <span>Live Telemetry: Active</span>
                  <span className="font-semibold text-gray-900">Revenue: ₹{totalRevenue.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* KPI STAT CARDS WITH SEGMENTED VERTICAL TICK BARS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Card 1 */}
              <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-500">Active Campus Users</span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    +40
                  </span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-4">450</div>
                <div className="flex items-center gap-3 text-[11px] text-gray-400">
                  <span>08:00</span>
                  <SegmentedTicks percentage={62} activeColor="#3B66F5" />
                  <span>10:00</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-500">Bookings {adminTimeframe}</span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    +{reservations.length + 24}
                  </span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-4">{319 + reservations.length}</div>
                <div className="flex items-center gap-3 text-[11px] text-gray-400">
                  <span>00:00</span>
                  <SegmentedTicks percentage={78} activeColor="#3B66F5" />
                  <span>23:59</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-500">Available Spaces</span>
                  <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                    {availableCount} free
                  </span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-4">
                  {availableCount} <span className="text-sm font-normal text-gray-400">/ {totalSlots} bays</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-gray-400">
                  <span>09:00</span>
                  <SegmentedTicks percentage={Math.round((availableCount / totalSlots) * 100)} activeColor="#3B66F5" />
                  <span>23:00</span>
                </div>
              </div>
            </div>

            {/* ANALYTICS ROW: KPI PERFORMANCE CHART + SEMI-CIRCULAR PARKING ZONE GAUGE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left 7 Cols: KPI Performance Gradient Bar Chart */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-1">KPI performance</h3>
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-3xl font-bold text-gray-900">76,18%</span>
                      <span className="text-xs font-semibold text-emerald-600">+32% vs last month</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                    2026
                  </span>
                </div>

                {/* Custom Parkora Gradient Bars with Solid Top Cap */}
                <div className="grid grid-cols-12 gap-2 sm:gap-3 items-end h-44 pt-4 border-b border-gray-100">
                  {kpiMonthlyBars.map((item) => (
                    <div key={item.month} className="flex flex-col items-center h-full justify-end group">
                      <div
                        className="w-full rounded-t-md relative transition-all duration-300 group-hover:opacity-90"
                        style={{
                          height: `${item.val}%`,
                          background: 'linear-gradient(180deg, rgba(59,102,245,0.28) 0%, rgba(59,102,245,0.03) 100%)'
                        }}
                      >
                        {/* Solid Royal Blue Top Cap */}
                        <div className="w-full h-1 bg-[#3B66F5] rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-12 gap-2 sm:gap-3 pt-2 text-center">
                  {kpiMonthlyBars.map((item) => (
                    <span key={item.month} className="text-[10px] font-medium text-gray-400">
                      {item.month}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right 5 Cols: Parking Zone Semi-Circular Arc Gauge */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-800">Parking zone</h3>
                  <span className="text-xs text-gray-400">Live Ratio</span>
                </div>

                {/* Semi-Circular Gauge SVG */}
                <div className="relative flex flex-col items-center justify-center my-2">
                  <svg viewBox="0 0 240 135" className="w-60 h-32 overflow-visible">
                    {/* Background Track */}
                    <path
                      d="M 25 120 A 95 95 0 0 1 215 120"
                      fill="none"
                      stroke="#F1F5F9"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                    {/* Segment 1: Occupied (Blue) */}
                    <path
                      d="M 25 120 A 95 95 0 0 1 95 28"
                      fill="none"
                      stroke="#3B66F5"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                    {/* Segment 2: Permits (Slate Gray) */}
                    <path
                      d="M 105 26 A 95 95 0 0 1 155 32"
                      fill="none"
                      stroke="#9CA3AF"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                    {/* Segment 3: Available / Booking (Emerald Green) */}
                    <path
                      d="M 165 37 A 95 95 0 0 1 215 120"
                      fill="none"
                      stroke="#4ADE80"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute bottom-2 text-center">
                    <div className="text-3xl font-bold text-gray-900">{occupancyRate}%</div>
                    <div className="text-[11px] text-gray-400">active utilization</div>
                  </div>
                </div>

                {/* Legend Breakdown */}
                <div className="space-y-2.5 pt-2 border-t border-gray-100 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#3B66F5]" />
                      <span className="font-medium text-gray-700">Occupied ({occupiedCount})</span>
                    </div>
                    <span className="font-semibold text-gray-900">{occupiedCount} bays</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm bg-gray-400" />
                      <span className="font-medium text-gray-700">Reserved ({reservedCount})</span>
                    </div>
                    <span className="font-semibold text-gray-900">{reservedCount} bays</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#4ADE80]" />
                      <span className="font-medium text-gray-700">Available ({availableCount})</span>
                    </div>
                    <span className="font-semibold text-gray-900">{availableCount} bays</span>
                  </div>
                </div>
              </div>
            </div>

            {/* INTERACTIVE LIVE SLOT MATRIX (CLICK ANY BAY TO TOGGLE MAINTENANCE) */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Real-Time Campus Bay Control</h3>
                  <p className="text-xs text-gray-500">
                    Click any available bay to toggle Maintenance Mode. Synchronized across User & Security portals.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Available
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Occupied
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Reserved
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-400" /> Maintenance
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {slots
                  .filter(
                    (s) =>
                      !searchQuery ||
                      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (s.vehicleNo && s.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase()))
                  )
                  .map((slot) => {
                    const styles = {
                      available: 'bg-emerald-50/70 border-emerald-200 text-emerald-900 hover:bg-emerald-100',
                      occupied: 'bg-rose-50/80 border-rose-200 text-rose-900',
                      reserved: 'bg-amber-50/80 border-amber-200 text-amber-900',
                      maintenance: 'bg-gray-100 border-gray-300 text-gray-500'
                    }[slot.status];

                    return (
                      <button
                        key={slot.id}
                        onClick={() => handleToggleSlotMaintenance(slot.id)}
                        className={`p-3 rounded-2xl border text-left transition-all ${styles}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold">{slot.id}</span>
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white/80">
                            {slot.type}
                          </span>
                        </div>
                        <div className="text-[10px] opacity-75 truncate">
                          {slot.vehicleNo || slot.status.toUpperCase()}
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          </main>
        </div>
      )}

      {/* =====================================================================
          ROLE 2: USER APP (PARKFAST + GOOGLE PLACE CARD AESTHETIC)
      ===================================================================== */}
      {role === 'user' && (
        <div className="max-w-6xl w-full mx-auto px-4 py-6 flex-1">
          {/* User Category & Vehicle Selector Strip */}
          <div className="bg-white rounded-2xl p-4 mb-6 border border-gray-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-[#3B66F5] flex items-center justify-center font-bold text-sm">
                AJ
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">Agrim Jain</div>
                <div className="text-xs text-gray-500">Select pass category & registered vehicle</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Role Category Toggle */}
              <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-semibold">
                {['Student', 'Faculty', 'Visitor'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setUserCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      userCategory === cat ? 'bg-white text-[#3B66F5] shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    {cat} {cat === 'Visitor' ? '(Paid)' : '(Free)'}
                  </button>
                ))}
              </div>

              {/* Registered Vehicle Dropdown */}
              <select
                value={selectedVehiclePlate}
                onChange={(e) => setSelectedVehiclePlate(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#3B66F5]"
              >
                {userVehicles.map((v) => (
                  <option key={v.id} value={v.plate}>
                    {v.plate} • {v.model} ({v.type})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3-COLUMN PARKFAST MOBILE-FIRST WORKFLOW CARDS ON DESKTOP */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* COLUMN 1: INTERACTIVE CAMPUS MAP & PLACE CARD (SCREEN 1 + GOOGLE PLACE CARD) */}
            <div className="lg:col-span-4 bg-white rounded-[32px] border border-gray-200/80 shadow-lg overflow-hidden">
              {/* Stylized Interactive Map Header */}
              <div className="relative h-52 bg-[#E9EEF5] overflow-hidden">
                {/* Map Grid Roads SVG */}
                <svg viewBox="0 0 400 220" className="w-full h-full object-cover">
                  <rect width="400" height="220" fill="#EDF2F7" />
                  <path d="M0,60 Q180,90 400,40" stroke="#FFFFFF" strokeWidth="14" fill="none" />
                  <path d="M110,0 L140,220" stroke="#FFFFFF" strokeWidth="12" fill="none" />
                  <path d="M260,0 L230,220" stroke="#FFFFFF" strokeWidth="16" fill="none" />
                  <path d="M0,165 L400,145" stroke="#CBD5E1" strokeWidth="6" strokeDasharray="6 6" fill="none" />
                  <circle cx="195" cy="95" r="34" fill="#3B66F5" fillOpacity="0.12" />
                </svg>

                {/* Campus Switcher Pills Overlaid on Map */}
                <div className="absolute top-3 left-3 right-3 flex gap-1.5 overflow-x-auto pb-1">
                  {campuses.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCampusId(c.id);
                        const firstAvail = slots.find((s) => s.campusId === c.id && s.status === 'available');
                        if (firstAvail) setSelectedSlotId(firstAvail.id);
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-sm transition-all ${
                        selectedCampusId === c.id
                          ? 'bg-[#3B66F5] text-white'
                          : 'bg-white/95 text-gray-700 hover:bg-white'
                      }`}
                    >
                      {c.name.split(' ')[0]}
                    </button>
                  ))}
                </div>

                {/* Floating Map Pin */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-[#3B66F5] text-white flex items-center justify-center shadow-lg ring-4 ring-white">
                    <span className="font-bold text-sm">P</span>
                  </div>
                </div>
              </div>

              {/* Campus Place Details Card (Inspired by Screenshot 2 & Screenshot 4) */}
              <div className="p-5 -mt-5 relative bg-white rounded-t-3xl">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h2 className="text-lg font-bold text-gray-900 leading-snug">{activeCampus.name}</h2>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
                    ★ {activeCampus.rating} ({activeCampus.reviews})
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-4">{activeCampus.address}</p>

                {/* Google Place-Style Pill Action Buttons */}
                <div className="grid grid-cols-4 gap-2 mb-5">
                  <button
                    onClick={() => notify(`Opening campus gate navigation to ${activeCampus.name}`)}
                    className="flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-2xl border border-gray-200 hover:bg-blue-50 hover:border-blue-200 text-xs font-medium text-gray-700 transition-colors"
                  >
                    <Navigation className="w-4 h-4 text-[#3B66F5]" />
                    <span className="text-[11px]">Directions</span>
                  </button>
                  <button
                    onClick={() => {
                      setSavedCampuses((prev) =>
                        prev.includes(activeCampus.id)
                          ? prev.filter((id) => id !== activeCampus.id)
                          : [...prev, activeCampus.id]
                      );
                      notify('Campus bookmark updated.');
                    }}
                    className="flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-2xl border border-gray-200 hover:bg-blue-50 text-xs font-medium text-gray-700 transition-colors"
                  >
                    <Bookmark
                      className={`w-4 h-4 ${
                        savedCampuses.includes(activeCampus.id) ? 'fill-[#3B66F5] text-[#3B66F5]' : 'text-gray-600'
                      }`}
                    />
                    <span className="text-[11px]">Save</span>
                  </button>
                  <button
                    onClick={() => notify('Campus location link copied to clipboard.')}
                    className="flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-2xl border border-gray-200 hover:bg-blue-50 text-xs font-medium text-gray-700 transition-colors"
                  >
                    <Share2 className="w-4 h-4 text-gray-600" />
                    <span className="text-[11px]">Share</span>
                  </button>
                  <button
                    onClick={() => notify(`Calling Gate Desk: ${activeCampus.phone}`)}
                    className="flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-2xl border border-gray-200 hover:bg-blue-50 text-xs font-medium text-gray-700 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-gray-600" />
                    <span className="text-[11px]">Call</span>
                  </button>
                </div>

                {/* 2x2 Quick Info Grid (Distance, Rate, Travel Time, Free Slots) */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-gray-50">
                    <div className="w-8 h-8 rounded-full bg-blue-100/70 text-[#3B66F5] flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900">{activeCampus.distance}</div>
                      <div className="text-[10px] text-gray-400">From your location</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-gray-50">
                    <div className="w-8 h-8 rounded-full bg-blue-100/70 text-[#3B66F5] flex items-center justify-center">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900">
                        {userCategory === 'Visitor' ? `₹${activeCampus.ratePerHr}/hr` : '₹0 (Permit)'}
                      </div>
                      <div className="text-[10px] text-gray-400">On-site parking rate</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-gray-50">
                    <div className="w-8 h-8 rounded-full bg-blue-100/70 text-[#3B66F5] flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900">{activeCampus.travelTime}</div>
                      <div className="text-[10px] text-gray-400">Driving time</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-gray-50">
                    <div className="w-8 h-8 rounded-full bg-blue-100/70 text-[#3B66F5] flex items-center justify-center">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900">
                        {slots.filter((s) => s.campusId === activeCampus.id && s.status === 'available').length} Slots
                      </div>
                      <div className="text-[10px] text-gray-400">Available now</div>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-emerald-600 font-medium mb-4">{activeCampus.hours}</div>

                <button
                  onClick={() => setUserStep('slots')}
                  className="w-full py-3.5 rounded-full bg-[#5B7CFA] hover:bg-[#3B66F5] text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all"
                >
                  Select Place & Pick Bay
                </button>
              </div>
            </div>

            {/* COLUMN 2: OVERHEAD TOP-DOWN PARKING BAY MAP (PARKFAST SCREEN 3) */}
            <div className="lg:col-span-4 bg-white rounded-[32px] border border-gray-200/80 shadow-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900">Book Parking Spot</h3>
                <span className="text-xs font-semibold text-[#3B66F5] bg-blue-50 px-2.5 py-1 rounded-full">
                  {activeCampus.code}
                </span>
              </div>

              {/* Floor Selector Tabs */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                {['1st Floor', '2nd Floor'].map((fl) => (
                  <button
                    key={fl}
                    onClick={() => setSelectedFloor(fl)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedFloor === fl
                        ? 'border-[#3B66F5] bg-blue-50/70 text-[#3B66F5]'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {fl}
                  </button>
                ))}
              </div>

              {/* Overhead Top-Down Parking Lot Layout */}
              <div className="bg-[#F8FAFC] rounded-3xl p-4 border border-gray-200/70">
                <div className="text-center mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                    ↓ Gate Entry ↓
                  </span>
                </div>

                <div className="grid grid-cols-11 gap-2 items-center">
                  {/* ZONE A (Left Column Bays) */}
                  <div className="col-span-5 space-y-2.5">
                    <div className="text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-blue-100 text-[#3B66F5] text-xs font-bold">
                        Zone A
                      </span>
                    </div>
                    {slots
                      .filter(
                        (s) =>
                          s.campusId === activeCampus.id &&
                          s.zone === 'A' &&
                          (s.floor === selectedFloor || activeCampus.id !== 'CAMP-01')
                      )
                      .map((slot) => {
                        const isSelected = selectedSlotId === slot.id;
                        const isTaken = slot.status === 'occupied' || slot.status === 'reserved';
                        const isMaint = slot.status === 'maintenance';
                        return (
                          <button
                            key={slot.id}
                            disabled={isTaken || isMaint}
                            onClick={() => setSelectedSlotId(slot.id)}
                            className={`w-full h-12 rounded-xl border-2 flex items-center justify-center transition-all relative ${
                              isSelected
                                ? 'bg-[#5B7CFA] border-[#3B66F5] text-white shadow-md scale-[1.02]'
                                : isTaken
                                ? 'bg-white border-gray-200 cursor-not-allowed'
                                : isMaint
                                ? 'bg-gray-100 border-dashed border-gray-300 text-gray-400 cursor-not-allowed'
                                : 'bg-white border-gray-200 hover:border-[#3B66F5] text-gray-700'
                            }`}
                          >
                            {isTaken ? (
                              <TopDownCar />
                            ) : isSelected ? (
                              <div className="flex items-center gap-1.5">
                                <TopDownCar highlight />
                                <span className="text-[11px] font-bold">{slot.id}</span>
                              </div>
                            ) : (
                              <span className="text-xs font-semibold">
                                {slot.id} {slot.type === 'EV' ? '⚡' : ''}
                              </span>
                            )}
                          </button>
                        );
                      })}
                  </div>

                  {/* CENTRAL DRIVING LANE */}
                  <div className="col-span-1 h-full flex flex-col items-center justify-between py-6">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3B66F5]" />
                    <div className="w-[2px] flex-1 border-l-2 border-dashed border-gray-300 my-2" />
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  </div>

                  {/* ZONE B (Right Column Bays) */}
                  <div className="col-span-5 space-y-2.5">
                    <div className="text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-blue-100 text-[#3B66F5] text-xs font-bold">
                        Zone B
                      </span>
                    </div>
                    {slots
                      .filter(
                        (s) =>
                          s.campusId === activeCampus.id &&
                          s.zone === 'B' &&
                          (s.floor === selectedFloor || activeCampus.id !== 'CAMP-01')
                      )
                      .map((slot) => {
                        const isSelected = selectedSlotId === slot.id;
                        const isTaken = slot.status === 'occupied' || slot.status === 'reserved';
                        const isMaint = slot.status === 'maintenance';
                        return (
                          <button
                            key={slot.id}
                            disabled={isTaken || isMaint}
                            onClick={() => setSelectedSlotId(slot.id)}
                            className={`w-full h-12 rounded-xl border-2 flex items-center justify-center transition-all ${
                              isSelected
                                ? 'bg-[#5B7CFA] border-[#3B66F5] text-white shadow-md scale-[1.02]'
                                : isTaken
                                ? 'bg-white border-gray-200 cursor-not-allowed'
                                : isMaint
                                ? 'bg-gray-100 border-dashed border-gray-300 text-gray-400 cursor-not-allowed'
                                : 'bg-white border-gray-200 hover:border-[#3B66F5] text-gray-700'
                            }`}
                          >
                            {isTaken ? (
                              <TopDownCar />
                            ) : isSelected ? (
                              <div className="flex items-center gap-1.5">
                                <TopDownCar highlight />
                                <span className="text-[11px] font-bold">{slot.id}</span>
                              </div>
                            ) : (
                              <span className="text-xs font-semibold">
                                {slot.id} {slot.type === 'EV' ? '⚡' : ''}
                              </span>
                            )}
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>

              {/* Date & Time Summary Strip (ParkFast Screen 2) */}
              <div className="mt-4 p-3.5 rounded-2xl bg-gray-50 flex items-center justify-between text-xs">
                <div>
                  <div className="text-gray-400 text-[10px]">Selected Bay</div>
                  <div className="font-bold text-gray-900 text-sm">{selectedSlotId}</div>
                </div>
                <div className="px-3 py-1 rounded-full bg-white border border-gray-200 font-semibold text-gray-700">
                  Today • 3 Hrs
                </div>
                <div className="text-right">
                  <div className="text-gray-400 text-[10px]">Total Payable</div>
                  <div className="font-bold text-[#3B66F5] text-sm">
                    {userCategory === 'Visitor' ? `₹${activeCampus.ratePerHr * 2}` : '₹0 (Permit)'}
                  </div>
                </div>
              </div>

              <button
                onClick={handleBookSlot}
                className="mt-4 w-full py-3.5 rounded-full bg-[#5B7CFA] hover:bg-[#3B66F5] text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all"
              >
                Book Now & Generate QR Pass
              </button>
            </div>

            {/* COLUMN 3: DIGITAL GATE QR PASS & ACTIVE RESERVATIONS */}
            <div className="lg:col-span-4 bg-white rounded-[32px] border border-gray-200/80 shadow-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900">Digital Gate QR Pass</h3>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Encrypted Single-Use
                </span>
              </div>

              {latestReservation ? (
                <div className="bg-gradient-to-b from-[#111827] to-[#1E293B] text-white rounded-3xl p-5 shadow-md">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                    <div>
                      <div className="text-[11px] text-gray-400">Reservation ID</div>
                      <div className="font-mono font-bold text-sm">{latestReservation.id}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      {latestReservation.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Stylized QR Matrix */}
                  <div className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center mb-4">
                    <QrCode className="w-32 h-32 text-[#111827]" strokeWidth={1.5} />
                    <span className="mt-2 font-mono text-xs font-bold text-gray-900 tracking-wider">
                      {latestReservation.qrToken}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-gray-400 block text-[10px]">Assigned Bay</span>
                      <span className="font-bold text-base text-emerald-400">{latestReservation.slotId}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-400 block text-[10px]">Vehicle Plate</span>
                      <span className="font-mono font-semibold">{latestReservation.vehicleNo}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">Campus</span>
                      <span className="font-medium">
                        {campuses.find((c) => c.id === latestReservation.campusId)?.name.split(' ')[0]} Campus
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-400 block text-[10px]">Pass Type</span>
                      <span className="font-medium">{latestReservation.userCategory}</span>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="mt-4 p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs text-gray-700">
                <p className="font-semibold text-[#3B66F5] mb-1">Test End-to-End Gate Flow:</p>
                <p className="text-gray-600 leading-relaxed">
                  Switch to <strong>Gate Security</strong> in the top bar—your QR token{' '}
                  <code className="font-mono bg-white px-1.5 py-0.5 rounded text-gray-900">
                    {latestReservation?.qrToken}
                  </code>{' '}
                  is pre-loaded for gate verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          ROLE 3: CAMPUS SECURITY CONSOLE (STRICT CAMPUS-LEVEL DATA ISOLATION)
      ===================================================================== */}
      {role === 'security' && (
        <div className="max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6 flex-1">
          {/* Campus Isolation Banner */}
          <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#3B66F5] text-white flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-gray-900">Gate Operations & QR Scanner</h2>
                  <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full">
                    Campus Data Isolation Active
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Guard Shift: Gate-1 North • Only showing bays, passes & vehicles inside assigned campus.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">Assigned Campus:</span>
              <select
                value={securityCampusId}
                onChange={(e) => setSecurityCampusId(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#3B66F5]"
              >
                {campuses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT 5 COLS: QR ENTRY SCANNER & MANUAL WALK-IN */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-1">QR Pass Gate Entry Validation</h3>
                <p className="text-xs text-gray-500 mb-4">
                  Scan or enter QR token to verify reservation and open boom barrier.
                </p>

                <div className="space-y-3">
                  <input
                    type="text"
                    value={qrInput}
                    onChange={(e) => setQrInput(e.target.value)}
                    placeholder="e.g., SP-QR-9041-MEC"
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 font-mono text-sm font-semibold focus:outline-none focus:border-[#3B66F5]"
                  />
                  <button
                    onClick={() => handleSecurityVerifyEntry(qrInput)}
                    className="w-full py-3 rounded-full bg-[#3B66F5] hover:bg-blue-700 text-white text-xs font-semibold shadow-sm flex items-center justify-center gap-2 transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Verify Pass & Approve Entry</span>
                  </button>
                </div>

                {/* Pending Reservations for THIS Campus Only */}
                <div className="mt-6 pt-5 border-t border-gray-100">
                  <div className="text-xs font-bold text-gray-700 mb-3">
                    Incoming Confirmed Passes ({reservations.filter((r) => r.campusId === securityCampusId && r.status === 'confirmed').length})
                  </div>
                  <div className="space-y-2.5">
                    {reservations
                      .filter((r) => r.campusId === securityCampusId && r.status === 'confirmed')
                      .map((res) => (
                        <div
                          key={res.id}
                          className="p-3 rounded-2xl bg-gray-50 border border-gray-200/70 flex items-center justify-between"
                        >
                          <div>
                            <div className="text-xs font-bold text-gray-900">
                              {res.vehicleNo} • <span className="text-[#3B66F5]">Bay {res.slotId}</span>
                            </div>
                            <div className="text-[11px] text-gray-500 font-mono">{res.qrToken}</div>
                          </div>
                          <button
                            onClick={() => handleSecurityVerifyEntry(res.qrToken)}
                            className="px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold"
                          >
                            Check In
                          </button>
                        </div>
                      ))}
                    {reservations.filter((r) => r.campusId === securityCampusId && r.status === 'confirmed').length === 0 && (
                      <p className="text-xs text-gray-400">No pending arrivals for this campus.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Incident Reporting Box */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Log Campus Security Incident</h3>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={incidentPlate}
                    onChange={(e) => setIncidentPlate(e.target.value)}
                    placeholder="Vehicle Plate (RJ-20-...)"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono"
                  />
                  <select
                    value={incidentNote}
                    onChange={(e) => setIncidentNote(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium"
                  >
                    <option>Wrong-Slot Parking</option>
                    <option>Unauthorized Entry</option>
                    <option>Overstay Violation</option>
                  </select>
                </div>
                <button
                  onClick={() => {
                    if (!incidentPlate.trim()) return;
                    setIncidents((prev) => [
                      {
                        id: `INC-${Math.floor(300 + Math.random() * 600)}`,
                        campusId: securityCampusId,
                        type: incidentNote,
                        vehicleNo: incidentPlate.toUpperCase(),
                        slotId: 'Gate Patrol',
                        reportedAt: 'Just now',
                        status: 'Open'
                      },
                      ...prev
                    ]);
                    setIncidentPlate('');
                    notify('Incident logged and synced with Admin Audit Logs.');
                  }}
                  className="w-full py-2.5 rounded-full bg-[#111827] text-white text-xs font-semibold hover:bg-gray-800"
                >
                  Submit Incident Report
                </button>
              </div>
            </div>

            {/* RIGHT 7 COLS: VEHICLES CURRENTLY INSIDE CAMPUS & EXIT CHECKOUT */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Active Parking Sessions (Vehicles Inside)</h3>
                    <p className="text-xs text-gray-500">
                      Process exit to calculate parking duration, collect visitor charges, and release slot.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-[#3B66F5] text-xs font-bold">
                    {sessions.filter((s) => s.campusId === securityCampusId).length} Inside
                  </span>
                </div>

                <div className="space-y-3">
                  {sessions
                    .filter((s) => s.campusId === securityCampusId)
                    .map((session) => (
                      <div
                        key={session.id}
                        className="p-4 rounded-2xl border border-gray-200/80 flex flex-wrap items-center justify-between gap-4 hover:border-blue-200 transition-colors"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-11 h-11 rounded-2xl bg-gray-100 flex items-center justify-center font-bold text-xs text-gray-800">
                            {session.slotId}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-sm text-gray-900">{session.vehicleNo}</span>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                {session.category}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {session.driverName} • Entered at {session.entryTime} ({session.durationHrs} hrs)
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleSecurityVehicleExit(session)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-all"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Process Exit & Release Bay</span>
                        </button>
                      </div>
                    ))}

                  {sessions.filter((s) => s.campusId === securityCampusId).length === 0 && (
                    <div className="text-center py-10 text-xs text-gray-400">
                      No active vehicles currently parked inside this campus.
                    </div>
                  )}
                </div>
              </div>

              {/* Campus Incident Feed */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Campus Incident Log</h3>
                <div className="space-y-2">
                  {incidents
                    .filter((inc) => inc.campusId === securityCampusId)
                    .map((inc) => (
                      <div key={inc.id} className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/70 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-amber-900">{inc.type}</span> —{' '}
                          <span className="font-mono font-semibold">{inc.vehicleNo}</span> ({inc.slotId})
                        </div>
                        <span className="text-amber-700 font-medium">{inc.reportedAt}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD CAMPUS MODAL (ADMIN) */}
      {showAddCampusModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddCampus}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Add New Campus Location</h3>
              <button
                type="button"
                onClick={() => setShowAddCampusModal(false)}
                className="text-gray-400 hover:text-gray-700 text-sm"
              >
                ✕
              </button>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Campus Name</label>
              <input
                type="text"
                required
                value={newCampusName}
                onChange={(e) => setNewCampusName(e.target.value)}
                placeholder="e.g., East Biotechnology Campus"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Campus Address</label>
              <input
                type="text"
                value={newCampusAddress}
                onChange={(e) => setNewCampusAddress(e.target.value)}
                placeholder="Sector 9, Knowledge Park, Kota"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Visitor Hourly Rate (₹/hr)</label>
              <input
                type="number"
                value={newCampusRate}
                onChange={(e) => setNewCampusRate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddCampusModal(false)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-[#3B66F5] text-white text-xs font-semibold hover:bg-blue-700"
              >
                Create Campus
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
