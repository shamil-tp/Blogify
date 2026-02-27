const { Server } = require("socket.io");
const authSocket = require("./auth");
const { joinDoc } = require("./handlers/joinDoc");
const { syncUpdate } = require("./handlers/syncUpdate");
const { disconnect } = require("./handlers/disconnect");

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://192.168.29.93:5173",
      ],
      credentials: true
    },
  });

  io.use(authSocket);

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id, socket.user?.name);

    // ================= DOC COLLAB =================
    socket.on("doc:join", async (blogId) => {
      await joinDoc(io, socket, blogId);
    });

    socket.on("doc:update", async (data) => {
      await syncUpdate(io, socket, data.blogId, data.update);
    });

    socket.on("doc:awareness", ({ blogId, awareness }) => {
      socket.to(blogId).emit("doc:awareness", awareness);
    });

    // ================= VIDEO CALL =================
    socket.on("call:join", (blogId) => {
      socket.join(`call-${blogId}`);
      socket.to(`call-${blogId}`).emit("call:user-joined", {
        socketId: socket.id,
      });
    });

    socket.on("call:signal", ({ to, signal }) => {
      io.to(to).emit("call:signal", {
        from: socket.id,
        signal,
      });
    });

    socket.on("call:leave", (blogId) => {
      socket.leave(`call-${blogId}`);
      socket.to(`call-${blogId}`).emit("call:user-left", socket.id);
    });


    // INVITE
    socket.on("call:invite", ({ blogId, to }) => {
      io.to(to).emit("call:incoming", {
        from: socket.id,
        blogId,
        user: socket.user,
      });
    });

    // KICK
    socket.on("doc:kick", ({ blogId, socketId }) => {
      io.to(socketId).emit("doc:kicked");
    });

    // ACCEPT
    socket.on("call:accept", ({ to, blogId }) => {
      io.to(to).emit("call:accepted", {
        from: socket.id,
        blogId,
      });
    });

    // DECLINE
    socket.on("call:decline", ({ to }) => {
      io.to(to).emit("call:declined", {
        from: socket.id,
      });
    });


    socket.on("disconnect", () => {
      disconnect(io, socket);
      console.log("Socket disconnected:", socket.id);
    });
  });
};

module.exports = initSocket;
