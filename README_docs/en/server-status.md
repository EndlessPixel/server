# 📡 Server Status

Shows real-time Minecraft server status: online state, player count, version, etc.

## Features

- Real-time monitoring: periodically polls the server-status API (`/systemstatus/data`).
- Status pages: standalone `/status` and `/status/mcserverstatus` pages, easy to share or embed.
- Graceful degradation: shows a fallback state when the API is unavailable, never blocking page render.

## Integration

Status data is aggregated server-side before delivery, avoiding exposing query sources directly from the browser — both stable and privacy-preserving.
