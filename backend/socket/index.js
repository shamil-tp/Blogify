// const { Server } = require("socket.io");
// const { verifySocketJWT } = require("./auth");
// const { joinDoc } = require("./handlers/joinDoc");
// const { syncUpdate } = require("./handlers/syncUpdate");
// const { disconnect } = require("./handlers/disconnect");

// const initSocket = (server) => {
//   const io = new Server(server, {
//     cors: {
//       origin: ["http://localhost:5173", "http://localhost:5174", process.env.FRONTEND_URL],
//       credentials: true,
//     },
//   });

//   io.use(verifySocketJWT);

//   io.on("connection", (socket) => {
//     console.log(`User connected: ${socket.user.name}`);

//     socket.on("doc:join", async (blogId) => {
//       await joinDoc(io, socket, blogId);
//     });

//     socket.on("doc:update", (data) => {
//       const { blogId, update } = data;
//       syncUpdate(io, socket, blogId, update);
//     });

//     socket.on("disconnect", async () => {
//       await disconnect(socket);
//       console.log(`User disconnected: ${socket.user.name}`);
//     });
//   });
// };

// module.exports = initSocket;
// socket/index.js
const { Server } = require("socket.io");
const authSocket = require("./auth");
const { joinDoc } = require("./handlers/joinDoc");
const { syncUpdate } = require("./handlers/syncUpdate");
const { disconnect } = require("./handlers/disconnect");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" }, // allow any frontend for testing
  });

  io.use(authSocket); // Apply auth

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id, socket.user.name);

    socket.on("doc:join", async (blogId) => joinDoc(io, socket, blogId));
    socket.on("doc:update", async (data) => syncUpdate(io, socket, data.blogId, data.update));
    socket.on("doc:awareness", ({ blogId, awareness }) => {
      socket.to(blogId).emit("doc:awareness", awareness);
    });
    socket.on("disconnect", () => disconnect(io, socket));
  });
};

module.exports = initSocket;
