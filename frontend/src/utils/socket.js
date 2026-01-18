import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_SOCKET_URL;

export const socket = io(`${URL}/screen`, {
  autoConnect: false,
  reconnection: true,
});

export const adminSocket = io(`${URL}/admin`, {
  autoConnect: false,
  reconnection: true,
});
