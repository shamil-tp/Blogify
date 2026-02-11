const rooms = require("../rooms");

module.exports = (io, socket, { blogId, awareness }) => {
  if (!rooms[blogId]) return;

  // Broadcast awareness (cursor, selection)
  socket.to(blogId).emit("doc:awareness", {
    userId: socket.user._id,
    awareness
  });
};
