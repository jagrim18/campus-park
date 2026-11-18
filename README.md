# SmartPark – Advanced Campus Parking Lot Management System

A full-stack, multi-campus parking management platform built with React (Vite + Tailwind CSS + Lucide Icons) and Node.js/Express + MongoDB/Mongoose, featuring:
- **Parkora-style Admin Dashboard**: KPI performance analytics, segmented occupancy arc gauges, live campus & slot controls, and revenue tracking in ₹.
- **ParkFast-style User Booking Portal**: Campus directory, floor/zone tabs, interactive top-down parking bay map, vehicle management, and dynamic QR Pass generation.
- **Campus-Isolated Security Gate Console**: Strict `campusId` data isolation, live QR pass validation, vehicle entry/exit lifecycle, duration & ₹ fee calculation, and incident reporting.

## Quick Start with Docker (Recommended)

```bash
docker compose up --build -d
```

- **Frontend UI:** http://localhost:5173
- **Backend API:** http://localhost:5000/api/campuses
- **MongoDB (Replica Set enabled for transactions):** mongodb://localhost:27017/smartpark

## Manual Local Setup

### 1. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 2. Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```
