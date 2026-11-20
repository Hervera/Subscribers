# Subscribers API

A REST API for managing channel subscribers. It is built with Express 5, Mongoose and MongoDB, and written in TypeScript.

## Requirements

- Node.js 22 or later
- A MongoDB database (local or hosted, such as MongoDB Atlas)

## Getting started

```bash
npm install
cp .env.example .env    # then set DATABASE_URL
npm run dev
```

The server starts on port 3000 by default. It connects to MongoDB before it starts listening. If the connection fails, it logs the error and exits.

## Environment variables

Set these in `.env`. [.env.example](.env.example) lists them all.

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes | | MongoDB connection string. The app will not start without it. |
| `PORT` | No | `3000` | Port the server listens on. |
| `LOG_LEVEL` | No | `info` | One of `error`, `warn`, `info`, `debug`. Less severe messages are hidden (for example, `warn` hides `info` and `debug`). |
| `NODE_ENV` | No | `development` | Read in `config/env.ts`, but not used by the app yet. |

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Runs the TypeScript source directly with `tsx` and restarts on file changes. |
| `npm run build` | Compiles the app to JavaScript in `dist/` (tests are not included). |
| `npm start` | Runs the compiled app from `dist/`. Run `npm run build` first. |
| `npm run typecheck` | Type-checks the whole project, including tests, without emitting files. |
| `npm test` | Runs all tests. |
| `npm run test:unit` | Runs the unit tests only. |
| `npm run test:integration` | Runs the integration tests only. |

## API

All endpoints are under `/subscribers`, and request and response bodies are JSON. There is no authentication yet, so every endpoint is public.

| Method | Path | Body | Success | Errors |
|---|---|---|---|---|
| `GET` | `/subscribers` | | `200`, array of subscribers | |
| `GET` | `/subscribers/:id` | | `200`, the subscriber | `404` not found |
| `POST` | `/subscribers` | `name`, `subscribedToChannel` (both required) | `201`, the new subscriber | `400` invalid body |
| `PATCH` | `/subscribers/:id` | `name` and/or `subscribedToChannel` (both optional) | `200`, the updated subscriber | `400` invalid body, `404` not found |
| `DELETE` | `/subscribers/:id` | | `200`, `{ "message": "Deleted Subscriber" }` | `404` not found |

A subscriber looks like this:

```json
{
  "_id": "6b00789d7c39f472bfb4e1f8",
  "name": "Ada Lovelace",
  "subscribedToChannel": "Tech Talks",
  "subscribeDate": "2026-11-20T16:43:09.786Z",
  "__v": 0
}
```

**Validation rules**

- `name` and `subscribedToChannel` must be non-empty strings.
- Unknown fields in the body are ignored.
- `subscribeDate` is always set by the server when the subscriber is created. It cannot be set or changed through the API.
- `PATCH` only changes the fields you send. An empty body leaves the subscriber unchanged.

**Errors** always have this shape:

```json
{ "message": "name is required. subscribedToChannel is required" }
```

A validation error lists every problem in one message. Malformed JSON returns `400`. An `:id` that is not a valid MongoDB ObjectId (for example `/subscribers/abc`) currently returns `500`.

**Trying it out:** [route.rest](route.rest) has a ready-made request for each endpoint. It works with the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension for VS Code.

## Project structure

```
├── app.ts            # Builds the Express app: JSON parsing, routes, error handler
├── server.ts         # Entry point: connects to MongoDB, then starts listening
├── config/
│   ├── env.ts        # Loads .env and checks required variables
│   ├── database.ts   # MongoDB connection
│   └── logger.ts     # Console logger with levels
├── routes/           # Maps each URL and method to its middleware and controller
├── middlewares/
│   ├── validate.ts       # Checks the request body against a Joi schema
│   ├── getSubscriber.ts  # Loads the subscriber for :id, or responds 404
│   └── errorHandler.ts   # Turns errors into JSON responses
├── validators/       # Joi schemas for request bodies
├── controllers/      # Reads the request and sends the response
├── services/         # Business logic and database access
├── models/           # Mongoose model and TypeScript types
├── types/            # Type additions for Express (res.subscriber)
└── tests/            # Unit and integration tests
```

A request passes through the layers in this order:

```
route → validate (POST, PATCH) → getSubscriber (/:id routes) → controller → service → model
```

Any error thrown along the way goes to `errorHandler`. It responds `400` for Mongoose validation errors, uses the error's own `status` if it has one (as with malformed JSON), and responds `500` for everything else.

## Testing

Tests use Node's built-in test runner, with `tsx` to load TypeScript.

```
tests/
├── setup.ts        # Starts and stops an in-memory MongoDB
├── unit/           # No database: middlewares and Joi schemas, with fakes
└── integration/    # Real queries against the in-memory MongoDB
    ├── services/   # Service functions
    └── routes/     # HTTP requests to the app via Supertest
```

Integration tests import `tests/setup.ts`, which gives each test file its own throwaway in-memory MongoDB ([mongodb-memory-server](https://github.com/typegoose/mongodb-memory-server)). The database is emptied after every test. Tests never touch the database in `DATABASE_URL` and do not need a `.env` file.

The first test run downloads a MongoDB binary, so it is slower than later runs.

`npm test` does not type-check. Run `npm run typecheck` to catch type errors.
