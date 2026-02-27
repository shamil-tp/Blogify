const { leaveRoom, rooms } = require("../rooms");
const { saveSnapshot } = require("../../collaboration/persistence/saveSnapshot");
const { docs } = require("../../collaboration/yjs/createDoc");

const disconnect = async (io, socket) => {
  rooms.forEach(async (socketsSet, blogId) => {
    if (socketsSet.has(socket.id)) {
      leaveRoom(blogId, socket);

      // if last user left, persist snapshot
      if (!rooms.has(blogId)) {
        const ydoc = docs.get(blogId);
        if (ydoc) {
          await saveSnapshot(blogId, ydoc);
          // Note: docs.delete(blogId) should probably happen here if we want to free memory
        }
      }
    }
  });
};

module.exports = { disconnect };
