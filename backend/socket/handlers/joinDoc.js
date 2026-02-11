// socket/handlers/joinDoc.js
const Y = require("yjs");
const { createDoc } = require("../../collaboration/yjs/createDoc");

const joinDoc = async (io, socket, blogId) => {
  socket.join(blogId);

  // Load or create Yjs document
  const ydoc = await createDoc(blogId);

  // Send current state to this socket
  const state = Y.encodeStateAsUpdate(ydoc);
  socket.emit("doc:sync", state);

  // Broadcast active users in room
  const usersInRoom = Array.from(io.sockets.adapter.rooms.get(blogId) || []).map(
    (id) => io.sockets.sockets.get(id).user.name
  );
  io.to(blogId).emit("doc:users", usersInRoom);
};

module.exports = { joinDoc };
