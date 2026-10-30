# Prompts.md - AI Transparency

This file documents how I used AI (Claude by Anthropic) while building the Live Ops Helpdesk.

## How I Used AI

I did not ask the AI to build the project for me. I asked it to be my **mentor**:

- Teach me the core concepts first, in short and simple language
- Guide me **one step at a time**
- I **type and run all the code myself**
- The AI **reviews** the code I paste and tells me if it is correct

## My Main Prompts

1. I pasted the full project brief and said: *"I want you to be my mentor and help me by teaching core concepts."*
2. When the first explanation was too long, I asked for it **shorter and in a casual, easy-to-follow style**.
3. I asked to **start from zero using CMD** (creating folders, `npm init`, installing packages).
4. After typing each step, I **pasted my code and asked for a review** before moving on.
5. I asked for **progress updates** to see what was done and what was left.


## Concepts the AI Taught Me

| Concept | What I learned |
|---|---|
| Race condition | Two agents change the same data at the same time, and the last save wins |
| Single source of truth | The server, not the browser, must decide who owns a ticket |
| HTTP vs WebSockets | HTTP is request/response, so the server can't speak first. WebSockets keep the line open both ways |
| Polling | Asking "anything new?" repeatedly is wasteful and slow |
| `io` vs `socket` | `io` talks to everyone, `socket` talks to one agent |
| `socket.emit` vs `io.emit` | One agent only vs broadcast to all agents |
| In-memory `Map` | Fast lookup of `ticketId -> socket.id` without a database |
| Ghost disconnect | The `disconnect` event releases locks when a tab closes or the connection drops |
| CORS and WSS | The frontend on Vercel must be allowed to connect to the backend on Render over a secure WebSocket |

## What I Wrote Myself vs What AI Did

**I did myself:**
- Typed all of `server.js` and `index.html` line by line
- Ran every CMD command (project setup, Git, GitHub repo creation)
- Tested with two windows, including closing a tab to prove the ghost disconnect
- Deployed to Render and Vercel
- Found and fixed my own issues (unsaved file, opening the wrong tab, browser zoom on the Render page)

**AI did:**
- Explained each concept before each step
- Gave small code snippets to type, with a short explanation of each line
- Reviewed the code I pasted and confirmed or corrected it
- Helped debug when the page showed no output (the file was not saved, and I was on the wrong tab)
- Suggested the "one ticket per agent" improvement, which I implemented

## Debugging Notes

- **Server printed nothing:** `server.js` was not saved, so Node ran an empty file. Fix: save with `Ctrl + S`, then run again.
- **Page showed nothing:** I was looking at the Socket.io file tab instead of my page. Fix: opened `index.html` with `start index.html`.
- **`Ctrl + R` opened a VS Code popup:** I pressed it inside VS Code. Rule: save in VS Code, refresh in Chrome.
- **Server code changes did not show:** Node does not reload on its own. Fix: stop with `Ctrl + C` and run `node server.js` again.
- **"Cannot GET /" on Render:** This is normal. The server only handles Socket.io and has no page at `/`.

## Final Note

The AI acted as a teacher and code reviewer. The design decisions, typing, testing, and deployment were done by me.
