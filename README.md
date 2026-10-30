# Live Ops Helpdesk

A real-time collaborative helpdesk built for **RapidDispatch Freight & Logistics** (Prodesk IT, Sprint 19 - Concurrency).

When an agent clicks a support ticket, it instantly locks for every other agent. No page refresh needed.

## The Problem

Two agents open the same ticket, type different resolutions, and the last "Save" silently overwrites the first one. This is a **race condition**. It causes conflicting replies, duplicate emails, and wasted hours.

## The Solution

The Node.js server is the **single source of truth** for ticket locks. It keeps the locks in memory and uses Socket.io to push every change to all connected agents instantly.

## Live Links

- Frontend (Vercel): https://live-ops-helpdesk-frontend.vercel.app/
- Backend (Render): https://live-ops-helpdesk-4fo8.onrender.com
- GitHub: https://github.com/sakshirawat1611/live-ops-helpdesk

Note: the backend is on Render's free plan, so the first load after idle time can take about 30 seconds.

## Features

- Real-time lock and unlock across all open windows
- Ticket states: free, locked by you (✏️), locked by another agent (🔒)
- One ticket per agent: picking a new ticket releases the old one
- Only the agent who locked a ticket can unlock it
- **Ghost disconnect handler**: if an agent closes the tab or loses connection, their locks are released automatically and everyone is updated
- New agents instantly see the current locks when they open the dashboard

## Tech Stack

- Node.js, Express
- Socket.io (WebSockets, secure `wss://` in production)
- Plain HTML and JavaScript frontend
- Deployed on Render (backend) and Vercel (frontend)

## How It Works

The server keeps a `Map` of `ticketId -> socket.id` (who holds which ticket).

| Event | Direction | What happens |
|---|---|---|
| `join_dashboard` | client to server | Server replies to that agent with the current locks |
| `lock_ticket` | client to server | If free, lock it and broadcast. If taken, reject |
| `unlock_ticket` | client to server | If the sender owns it, release it and broadcast |
| `lock_state` | server to clients | Full, up-to-date lock list |
| `lock_rejected` | server to one client | The ticket was already locked |
| `disconnect` | built-in | Release every ticket held by that socket, then broadcast |

## Run Locally

Backend:

```
cd backend
npm install
npm start
```

The server runs on port 5000.

Frontend: open `frontend/index.html` in a browser. For local testing, change the two Render URLs in the file back to `http://localhost:5000`. Open it in two windows to test locking.

## Project Structure

```
live-ops-helpdesk/
  backend/
    server.js        Express + Socket.io server, lock logic
    package.json
  frontend/
    index.html       Ticket list and socket client
  Screenshots/       Dual-window test screenshots
```

## Testing the Concurrency Logic

1. Open the app in two windows side by side (Agent A and Agent B).
2. Click a ticket in Window 1. Window 2 shows 🔒 instantly.
3. Click the same ticket in Window 2. It is rejected.
4. Close Window 1's tab. Window 2 sees the ticket unlock automatically.
