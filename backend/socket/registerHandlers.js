// const joinDoc = require("./handlers/joinDoc");
// const syncUpdate = require("./handlers/syncUpdate");
// const awareness = require("./handlers/awareness");
// const disconnect = require("./handlers/disconnect");

// module.exports = (io, socket) => {
//   socket.on("doc:join", (data) => joinDoc(io, socket, data));
//   socket.on("doc:update", (data) => syncUpdate(io, socket, data));
//   socket.on("doc:awareness", (data) => awareness(io, socket, data));
//   socket.on("disconnect", () => disconnect(io, socket));
// };
const joinDoc = require('./handlers/joinDoc');
const syncUpdate = require('./handlers/syncUpdate');
const disconnect = require('./handlers/disconnect');

module.exports = (io, socket) => {
  socket.on('doc:join', (data) => joinDoc(io, socket, data));
  socket.on('sync:update', (data) => syncUpdate(io, socket, data));
  socket.on('disconnect', () => disconnect(io, socket));
};
