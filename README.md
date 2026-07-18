# StoreDB API

Backend API for a store inventory and sales-ledger system, built for CSE341.
Provides Google OAuth login, JWT-based API authorization, and CRUD endpoints
for products, ledgers, users, and returns, documented via Swagger.

**Live deployment:** <https://storedb-wyw9.onrender.com>

## Stack

- **Express 5** — HTTP server and routing
- **MongoDB** (raw driver, `db/connect.js`) — data storage
- **Passport (Google OAuth20)** + **express-session** — login
- **jsonwebtoken** — API auth via bearer tokens, minted after Google login
- **Handlebars** — login page view only
- **swagger-autogen** + **swagger-ui-express** — API docs at `/api-docs`
- **Jest** — unit and integration tests

## Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in real values:

   ```
   PORT=8080
   MONGODB_URI=...          # dev/prod database
   MONGODB_URI_TEST=...     # separate throwaway database, used when NODE_ENV=test
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   SESSION_SECRET=...
   JWT_SECRET=...
   ```

## Running

```
npm start                 # nodemon server.js — starts the API on PORT (default 8080)
npm test                  # fast unit suite (mocked DB, no network needed)
npm run test:integration  # integration suite against MONGODB_URI_TEST
npm run swagger           # regenerates swagger.json from route annotations
```

Once running, visit `/` to log in with Google, then `/auth/token` to get a
JWT for use against protected API routes (via `Authorization: Bearer <token>`
or through the "Authorize" button in `/api-docs`).

## API Documentation

Interactive Swagger UI is available at `/api-docs` once logged in through the
browser. It documents the `products`, `ledgers`, `users`, and `returns`
collections with full CRUD, including required fields and auth requirements
for each route.
