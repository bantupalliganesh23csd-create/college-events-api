# College Technical Events API

A Node.js, Express, and MongoDB application for managing college technical events and student registrations.

The project includes a browser dashboard at `/` and a JSON REST API under `/api`.

## Features

- Create, read, update, and delete technical events
- Create and list students
- Register students for multiple events
- Cancel registrations
- Prevent duplicate registrations
- Block registrations when event capacity is full
- View available seats
- Seed five events and sample students
- Responsive event dashboard with live MongoDB data

## Requirements

- Node.js
- MongoDB running locally or a MongoDB Atlas connection string

## Installation

```powershell
npm.cmd install
```

Create a `.env` file in the project root:

```env
MONGO_URI=mongodb://127.0.0.1:27017/college_events
PORT=5000
```

For MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

## Seed the database

```powershell
npm.cmd run seed
```

The seed script creates five technical events and three students. Rahul Kumar is registered for two events.

## Run the application

```powershell
npm.cmd start
```

Open the dashboard:

```text
http://localhost:5000
```

Development mode:

```powershell
npm.cmd run dev
```

## Deploy on Render

The repository includes `render.yaml` for a Render web service.

1. Sign in to [Render](https://render.com/).
2. Create a new Blueprint and select this GitHub repository.
3. Set the `MONGO_URI` environment variable to your MongoDB Atlas connection string.
4. Deploy the service named `college-events-api`.
5. After the first deployment, run `npm.cmd run seed` locally against the production MongoDB URI, or seed the database using a one-off Render shell command.

Render will provide the public dashboard URL after deployment. Add that URL below:

```text
Live dashboard: pending Render deployment
```

The deployed dashboard uses `/` and the REST API uses `/api/events` and `/api/students` on the same Render URL.

## REST API endpoints

### Events

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/events` | List all events |
| GET | `/api/events/:id` | Get one event |
| POST | `/api/events` | Create an event |
| PUT | `/api/events/:id` | Update an event |
| DELETE | `/api/events/:id` | Delete an event |
| GET | `/api/events/:id/seats` | Get available seats |

### Students and registrations

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/students` | Create a student |
| GET | `/api/students` | List students and registrations |
| POST | `/api/students/:studentId/register/:eventId` | Register a student |
| DELETE | `/api/students/:studentId/register/:eventId` | Cancel a registration |

## Example event request

```json
{
  "name": "Cloud Computing Seminar",
  "description": "Introduction to cloud computing",
  "date": "2026-10-25",
  "venue": "Seminar Hall B",
  "capacity": 20
}
```

Event capacity must be at least 10 students. A full event returns HTTP `409 Conflict` when another registration is attempted.

## Project structure

```text
models/        Mongoose data models
middleware/    Event validation and capacity checking
routes/        Event and student API routes
index.html     Browser dashboard
server.js      Express server
seed.js        Sample database seed script
```
