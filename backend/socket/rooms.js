const rooms = new Map(); // blogId -> Set of socket ids

const joinRoom = (blogId, socket) => {
  if (!rooms.has(blogId)) rooms.set(blogId, new Set());
  rooms.get(blogId).add(socket.id);
};

const leaveRoom = (blogId, socket) => {
  if (!rooms.has(blogId)) return;
  rooms.get(blogId).delete(socket.id);
  if (rooms.get(blogId).size === 0) rooms.delete(blogId);
};

module.exports = { joinRoom, leaveRoom, rooms };
