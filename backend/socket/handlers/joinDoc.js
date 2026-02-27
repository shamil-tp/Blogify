const Y = require("yjs");
const { createDoc } = require("../../collaboration/yjs/createDoc");
const { joinRoom } = require("../rooms");

const joinDoc = async (io, socket, blogId) => {
  socket.join(blogId);
  joinRoom(blogId, socket);

  // Load or create Yjs document
  const ydoc = await createDoc(blogId);

  // Send current Yjs state to this socket
  const state = Y.encodeStateAsUpdate(ydoc);
  socket.emit("doc:sync", state);

  // Build users list WITH socketId
  const usersInRoom = Array.from(
    io.sockets.adapter.rooms.get(blogId) || []
  ).map((id) => {
    const s = io.sockets.sockets.get(id);
    return {
      name: s.user?.name || "Anonymous",
      email: s.user?.email || null,
      socketId: id,
    };
  });

  // Emit users to everyone in the room
  io.to(blogId).emit("doc:users", usersInRoom);
};

module.exports = { joinDoc };
