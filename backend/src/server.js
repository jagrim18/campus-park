import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import parkingRoutes from './routes/parkingRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_ORIGIN || '*' }
});

app.use(cors());
app.use(express.json());

// Attach Socket.IO instance to requests for real-time bay updates
app.use((req, _res, next) => {
  req.io = io;
  next();
});

app.use('/api', parkingRoutes);

io.on('connection', (socket) => {
  socket.on('join_campus', (campusId) => {
    socket.join(`campus_${campusId}`);
  });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartpark';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => console.log(`SmartPark API running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });
