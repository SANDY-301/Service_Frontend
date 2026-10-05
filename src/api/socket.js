import { io } from 'socket.io-client';
import { UPLOAD_BASE_URL } from './apiClient';

let socket = null;

export const initSocket = () => {
  if (!socket) {
    socket = io(UPLOAD_BASE_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    socket.on('connect', () => {
      console.log('Socket Connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket Disconnected');
    });
  }
  return socket;
};

export const getSocket = () => socket || initSocket();
