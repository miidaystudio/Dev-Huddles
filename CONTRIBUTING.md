# Contributing to DevHuddle

We welcome contributions! Follow these steps to set up your local environment and submit pull requests.

---

## Local Development Setup

### 1. Fork & Branch

```bash
git clone https://github.com/<your-username>/Dev-Huddles.git
cd Dev-Huddles
git checkout -b feat/your-feature-name
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file at the root:

```bash
NEXT_PUBLIC_WS_URL=ws://localhost:1234
```

### 4. Running the Development Services

DevHuddle needs both the sync provider and client running:

**Terminal 1: WebSocket Sync Provider**

```bash
npx y-websocket
```

**Terminal 2: Frontend Client**

```bash
npm run dev
```

Test the room route at `http://localhost:3000/room/INC-8420` to verify live editor sync.

---

## Engineering Guidelines

* **Component Persistence:** Never unmount the Monaco or Sandpack instances when switching tabs. Use CSS visibility toggles (`hidden` / `block`) to preserve socket state and undo history.
* **Code Style:** Ensure clean lint passes before opening PRs:
  ```bash
  npm run lint
  ```
* **Build Verification:** Ensure zero TypeScript errors:
  ```bash
  npm run build
  ```

---

## Submitting Pull Requests

1. Commit changes using standard conventional prefixes (`feat:`, `fix:`, `perf:`, `docs:`).
2. Push your branch to GitHub.
3. Open a PR referencing any relevant issues (e.g., `Closes #2`).
