const express = require("express");
const http = require("http");
const cors = require("cors");
const { WebSocketServer } = require("ws");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    service: "DevHuddle Kinetic Arena Backend",
    timestamp: new Date().toISOString(),
    version: "2.4.0",
  });
});

// Incident Specs Mock API Endpoint
app.get("/api/incidents/:id", (req, res) => {
  const { id } = req.params;
  res.json({
    id: id || "INC-8420",
    title: "Fix Race Condition in Checkout Hook",
    severity: "P1 CRITICAL",
    service: "Checkout Service",
    affectedUsers: 1420,
    status: "INVESTIGATING",
    expectedBehavior:
      "Mutex lock on submit button, random UUID x-idempotency-key header assertions.",
    actualBehavior:
      "Double tap triggers 2 parallel Stripe payment settlements under high network latency.",
  });
});

const server = http.createServer(app);

// WebSocket Server for Yjs & Peer Presence Tracking
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Client connected to DevHuddle Room WS stream");

  ws.send(
    JSON.stringify({
      type: "SYSTEM_EVENT",
      payload: { message: "Connected to Kinetic Arena CRDT Stream" },
    })
  );

  ws.on("message", (message) => {
    // Broadcast to all active peer clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === ws.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected from DevHuddle Room WS stream");
  });
});

server.listen(PORT, () => {
  console.log(`🚀 DevHuddle Backend running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket CRDT Stream active at ws://localhost:${PORT}`);
});
