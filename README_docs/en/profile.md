# 👤 Profile

The player profile page after login, showing account info and skin.

## Layout

- **Desktop**: two-column grid — account info on the left, 3D skin preview on the right.
- **Mobile**: automatically collapses to a single stacked column for readability.

## Session & Security

- Auth uses HMAC-signed session cookies (`ep_session`).
- Abnormal/legacy cookies are auto-cleared for smooth old-user migration.
- Unauthenticated users are not wrongly redirected to the home page; login flow is smoother.
