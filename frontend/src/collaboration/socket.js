import io from 'socket.io-client';

let socket = null;

// Use explicit port 5001 or environment variable
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://192.168.29.93:5005";

export const initSocket = (docId) => {
  if (socket) return socket;

  socket = io(BACKEND_URL, {
    transports: ['websocket'],
    query: { docId }
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
