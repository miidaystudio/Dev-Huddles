import { ENV_CONFIG } from "./src/config/env.js";
import app from "./src/app.js";
import { createServer } from "http";
import { WebSocketServer } from "ws";
const server = createServer(app);

// WebSocket Server for Yjs & Peer Presence Tracking
const wss = new WebSocketServer({ server });
const PORT = ENV_CONFIG.PORT;

wss.on("connection", (ws) => {
  console.log("Client connected to DevHuddle Room WS stream");

  ws.send(
    JSON.stringify({
      type: "SYSTEM_EVENT",
      payload: { message: "Connected to Kinetic Arena CRDT Stream" },
    }),
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
