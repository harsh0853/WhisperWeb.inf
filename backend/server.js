const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

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
//console.log(path.join(__dirname, "public", "index.html"));
// GET route to serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const port = process.env.PORT || 8000;
server.listen(port, () => {
  //console.log(`Server is running on port ${port}`);
});
