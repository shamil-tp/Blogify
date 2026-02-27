// socket/handlers/syncUpdate.js
const { applyUpdate } = require("../../collaboration/yjs/applyUpdate");
const { docs } = require("../../collaboration/yjs/createDoc");

const syncUpdate = (io, socket, blogId, update) => {
  const ydoc = docs.get(blogId);
  if (!ydoc) return;

  // Apply update to Yjs doc
  applyUpdate(ydoc, update);

  // Broadcast to everyone else
  socket.to(blogId).emit("doc:update", update);
};

module.exports = { syncUpdate };
