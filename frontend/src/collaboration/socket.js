import io from 'socket.io-client';

let socket = null;

export const initSocket = (url, docId) => {
  if (socket) return socket;

  socket = io(url, { query: { docId } });

  return socket;
};

export const emitUpdate = (docId, update) => {
  socket?.emit('sync:update', {
    docId,
    update: Array.from(update),
  });
};

export const onUpdate = (docId, cb) => {
  socket?.on(`sync:update:${docId}`, ({ update, clientId }) => {
    cb(new Uint8Array(update), clientId);
  });
};