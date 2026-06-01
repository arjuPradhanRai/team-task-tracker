# Team Task Tracker API

A REST API for managing tasks within a team. Users belong to an organization, have roles, and can create/manage tasks based on their permissions.

---

## Getting Started

### Quick Start (Docker)

```bash
git clone https://github.com/arjuPradhanRai/team-task-tracker.git
cd team-task-tracker/backend
docker compose up --build
```

That's it. Everything is orchestrated and running:

| Service  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:5173      |
| API      | http://localhost:3000      |
| API Docs | http://localhost:3000/docs |
| Adminer  | http://localhost:8080      |
| MySQL    | localhost:3306             |
| Redis    | localhost:6379             |

**No manual setup, no local dependencies required. Database tables are created automatically on first run.**

### Stopping Services

```bash
docker compose down
```

---

## Database Design Decision

### Why `organizationId` on `User` and `Project` instead of a join table

Each user belongs to exactly one organization and each project belongs to exactly one organization. A join table would add unnecessary complexity with no benefit since this is a 1-to-many relationship in both cases. Direct foreign keys keep queries simple and allow efficient indexed lookups.

### Indexes

The following fields are indexed for query performance:

- `Task.status` — filtered on every task list request
- `Task.assigneeId` — Redis cache is keyed per assignee; DB fallback also filters by this
- `Task.due_date` — used in the analytics endpoint to find overdue tasks
- `Task.projectId` — every task query is scoped to a project within an org
- `User.organizationId` — all user lookups are scoped to an org
- `RefreshToken.userId` — token lookup on every authenticated request

---

## Caching Strategy

Redis is used to cache task list responses per organization.

### Cache key format

```
tasks:{organizationId}:{assignee}:{status}:{priority}:{page}:{limit}
```

### TTL

Cache entries expire after **5 minutes** (300 seconds).

### Invalidation

All cache keys matching `tasks:{organizationId}:*` are deleted whenever a task is **created**, **updated**, **deleted**, or has its **status changed** within that organization. This ensures no stale data is served after any mutation while still serving cached responses for read-heavy list queries.

---

## API Endpoints

### Authentication (`/auth`)

| Method | Endpoint         | Description                 | Auth Required |
|--------|------------------|-----------------------------|---------------|
| POST   | `/auth/register` | Register a new org + user   | No            |
| POST   | `/auth/login`    | Login with email & password | No            |
| POST   | `/auth/refresh`  | Refresh access token        | No            |
| POST   | `/auth/logout`   | Logout user                 | Yes           |

### Users (`/users`)

| Method | Endpoint  | Description     | Auth Required | Role Required |
|--------|-----------|-----------------|---------------|---------------|
| POST   | `/users`  | Create new user | Yes           | ADMIN         |
| GET    | `/users`  | Get all users   | Yes           | ADMIN         |

### Projects (`/projects`)

| Method | Endpoint | Description      | Auth Required | Role Required     |
|--------|----------|------------------|---------------|-------------------|
| POST   | `/`      | Create project   | Yes           | ADMIN, MANAGER    |
| GET    | `/`      | Get all projects | Yes           | Any authenticated |

### Tasks (`/tasks`)

| Method | Endpoint      | Description        | Auth Required | Role Required          |
|--------|---------------|--------------------|---------------|------------------------|
| POST   | `/`           | Create task        | Yes           | ADMIN, MANAGER         |
| GET    | `/`           | List all tasks     | Yes           | Any authenticated      |
| GET    | `/:id`        | Get task by ID     | Yes           | Any authenticated      |
| PUT    | `/:id`        | Update task        | Yes           | ADMIN, MANAGER         |
| DELETE | `/:id`        | Delete task        | Yes           | ADMIN                  |
| PATCH  | `/:id/status` | Change task status | Yes           | ADMIN, MANAGER, MEMBER |

### Analytics (`/analytics`)

| Method | Endpoint | Description                                    | Auth Required | Role Required  |
|--------|----------|------------------------------------------------|---------------|----------------|
| GET    | `/`      | Overdue tasks per user + avg completion time   | Yes           | ADMIN, MANAGER |

---

## Authentication

The API uses **JWT (JSON Web Tokens)** for authentication with access + refresh token rotation.

### Token Format

```
Authorization: Bearer <access_token>
```

### Token Types

- **Access Token** — Short-lived, used for API requests
- **Refresh Token** — Long-lived, stored in DB, rotated on every refresh to prevent reuse

---

## User Roles & Permissions

| Role    | Permissions                                                        |
|---------|--------------------------------------------------------------------|
| ADMIN   | Full access — manage users, projects, tasks within the org        |
| MANAGER | Manage projects and tasks, assign members; cannot manage users     |
| MEMBER  | View and update status only on tasks assigned to them             |

RBAC is enforced at the middleware level, not inside controller logic.

---

## Status Transitions

Task status follows enforced server-side transitions:

```
TODO → IN_PROGRESS → IN_REVIEW → DONE
              ↘           ↘
                      BLOCKED (reachable from any active state)
```

Free-form status updates are rejected. Only the assignee or a MANAGER/ADMIN can advance a task's status.

---

## Environment Variables

The following are set inside `docker-compose.yml` and require no manual configuration for Docker runs:

```env
DATABASE_URL=mysql://root:root@mysql:3306/task_tracker
REDIS_URL=redis://redis:6379
JWT_SECRET=secret123
REFRESH_SECRET=refresh123
```

For local development, create a `.env` file in `backend/` with the above values pointing to your local MySQL and Redis instances.

---

## Project Structure

```
team-task-tracker/
├── backend/
│   ├── src/
│   │   ├── app.js                 # Express app setup
│   │   ├── swagger.js             # Swagger/OpenAPI config
│   │   ├── controllers/           # Route handlers
│   │   ├── routes/                # API route definitions
│   │   ├── middleware/            # Auth, RBAC, error handling
│   │   ├── validations/           # Input schemas (Zod)
│   │   └── utils/
│   │       ├── prismaClient.js    # Prisma ORM client
│   │       ├── jwt.js             # JWT token generation
│   │       ├── redis.js           # Redis client
│   │       └── statusTransition.js# Task status validation
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   └── migrations/            # Auto-applied on docker compose up
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── package.json
└── frontend/
    ├── src/
    │   ├── pages/                 # Login, Register, Tasks, Analytics
    │   ├── components/            # Navbar, Badge
    │   └── api/axios.js           # API client with auth interceptor
    └── Dockerfile
```

---

## Error Handling

All endpoints return standardized error responses:

```json
{
  "status": 400,
  "code": "VALIDATION_ERROR",
  "message": "due_date must be a future date"
}
```

Common status codes:

| Code | Meaning                              |
|------|--------------------------------------|
| 200  | Success                              |
| 201  | Created                              |
| 400  | Validation error                     |
| 401  | Unauthorized (missing/invalid token) |
| 403  | Forbidden (insufficient permissions) |
| 404  | Not found                            |
| 500  | Server error                         |

---

## Swagger Documentation

Once the API is running, visit:

```
http://localhost:3000/docs
```

All endpoints are fully documented with request/response schemas and try-it-out functionality.

---

## What I Would Improve Given More Time

- **Rate limiting** on auth endpoints to prevent brute force attacks
- **SCAN instead of KEYS** for Redis cache invalidation — `KEYS` is O(N) and blocks Redis on large keysets
- **Invite flow** — allow ADMIN to invite users to an existing organization via email
- **WebSocket notifications** — real-time status change events pushed to the assignee
- **Integration tests** — full coverage for auth flow and status transition enforcement
- **Refresh token reuse detection** — invalidate entire token family on reuse attack
- **Pagination metadata** — return `total`, `totalPages`, `hasNext` in list responses

---

## License

ISC
