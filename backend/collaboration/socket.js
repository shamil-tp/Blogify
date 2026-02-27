import io from 'socket.io-client';

let socket = null;

export const initSocket = (url, docId) => {
  if (socket) return socket;

  socket = io(url, { query: { docId } });

  socket.on('connect', () => {
    console.log('🔗 Socket connected!', socket.id);
  });

  socket.on('connect_error', (err) => {
    console.error('❌ Socket connection error:', err);
  });

  socket.on('disconnect', (reason) => {
    console.log('⚠️ Socket disconnected:', reason);
  });

  return socket;
};
