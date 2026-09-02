# DevHuddle Kinetic Arena — Backend Service

Express.js REST API & WebSocket Signaling Server for real-time Yjs CRDT code synchronization and incident spec management.

## Setup & Running

```bash
# From backend directory
npm install
npm run dev
```

## Endpoints

- `GET /api/health` — System status and version details
- `GET /api/incidents/:id` — Incident spec metadata by ticket ID
- `WS /` — Real-time peer presence & Yjs CRDT state stream
