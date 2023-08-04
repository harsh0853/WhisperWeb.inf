const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

const members = {};
io.on("connection", (socket) => {
  socket.on("new-user", (name) => {
    members[socket.id] = name;
    socket.broadcast.emit("New-Member", name);
  });

  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: members[socket.id],
    });
  });

  socket.on("disconnect", () => {
    const name = members[socket.id];
    socket.broadcast.emit("left", name);
    delete members[socket.id];
  });
});

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
