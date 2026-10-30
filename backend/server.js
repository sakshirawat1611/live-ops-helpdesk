const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

// This is our "whiteboard".
// key = ticket id, value = id of the agent (socket) who locked it
const ticketLocks = new Map();
// This runs every time a new agent connects
io.on("connection", (socket) => {
    console.log("Agent connected:", socket.id);

    // Agent opens the dashboard: send them the current locks
    socket.on("join_dashboard", () => {
    // map cant be sent directly, so turn it into a plain object
    const currentLocks = Object.fromEntries(ticketLocks);

    // socket.emit = send to THIS agent only
    socket.emit("lock_state", currentLocks);
  });

    // Agent clicks a ticket and wants to lock it
  socket.on("lock_ticket", (ticketId) => {
    // is somebody already holding this ticket?
    if (ticketLocks.has(ticketId)) {
      // yes, so reject. Only tell the agent who asked
      socket.emit("lock_rejected", ticketId);
      return;
    }

        // an agent can hold only ONE ticket: release any ticket they held before
    for (const [id, ownerId] of ticketLocks) {
      if (ownerId === socket.id) {
        ticketLocks.delete(id);
      }
    }
    
    ticketLocks.set(ticketId, socket.id);

    // io.emit = tell EVERYONE the new state
    io.emit("lock_state", Object.fromEntries(ticketLocks));
  });

    // Agent is done and wants to release the ticket
  socket.on("unlock_ticket", (ticketId) => {
    // only the agent who locked it is allowed to unlock it
    if (ticketLocks.get(ticketId) !== socket.id) {
      return;
    }

    // remove the lock from the whiteboard
    ticketLocks.delete(ticketId);

    // tell EVERYONE the ticket is free now
    io.emit("lock_state", Object.fromEntries(ticketLocks));
  });

    // Agent disappeared (closed tab, lost wifi, closed laptop)
  socket.on("disconnect", () => {
    console.log("Agent left:", socket.id);

    // look through every lock on the whiteboard
    for (const [ticketId, ownerId] of ticketLocks) {
      // if this agent was the owner, free the ticket
      if (ownerId === socket.id) {
        ticketLocks.delete(ticketId);
      }
    }

    // tell EVERYONE the new state
    io.emit("lock_state", Object.fromEntries(ticketLocks));
  });
});

// start the server on port 5000
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});