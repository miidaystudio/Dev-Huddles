import express from "express";
import cors from "./config/cors.js";
import mainRouter from "./routes.js";

const app = express();

app.use(cors);
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

// API Route
app.use("/api", mainRouter);

export default app;
