const { leaveRoom, rooms } = require("../rooms");
const { saveSnapshot, docs } = require("../../collaboration/persistence/saveSnapshot");

const disconnect = async (socket) => {
  rooms.forEach(async (socketsSet, blogId) => {
    if (socketsSet.has(socket.id)) {
      leaveRoom(blogId, socket);

      // if last user left, persist snapshot
      if (!rooms.has(blogId)) {
        const ydoc = docs.get(blogId);
        if (ydoc) {
          await saveSnapshot(blogId, ydoc);
          docs.delete(blogId);
        }
      }
    }
  });
};

module.exports = { disconnect };
