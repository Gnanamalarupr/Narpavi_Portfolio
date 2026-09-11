import { Server } from 'socket.io';
import { verifyToken } from '../services/auth.service.js';

let io;

export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173' }
  });
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      const user = await verifyToken(token);
      if (!user || user.role !== 'admin') return next(new Error('Admin authentication required.'));
      socket.user = user;
      next();
    } catch (error) { next(error); }
  });
  io.on('connection', (socket) => socket.join('admins'));
  return io;
};

export const emitAdminEvent = (event, data) => {
  if (io) io.to('admins').emit(event, data);
};
