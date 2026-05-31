# Team Task Tracker API

A REST API for managing tasks within a team. Users belong to an organization, have roles, and can create/manage tasks based on their permissions.

---

## Getting Started

```bash
git clone <your-repo-url>
cd team-task-tracker/backend
docker compose up --build
```

That's it. The API is available at `http://localhost:3000` and Swagger docs at `http://localhost:3000/docs`.

No manual setup, no local dependencies required.

### Services started

| Service  | URL                        |
|----------|----------------------------|
| API      | http://localhost:3000      |
| Frontend | http://localhost:5173      |
| Adminer  | http://localhost:8080      |
| MySQL    | localhost:3306             |
| Redis    | localhost:6379             |

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
tasks:org:{organizationId}
```

Tasks list is cached per organization. When a task is created, updated, or deleted within an org, the entire cache key is invalidated.

---

## API Endpoints

### Authentication (`/auth`)

| Method | Endpoint         | Description                      | Auth Required |
|--------|------------------|----------------------------------|---------------|
| POST   | `/auth/register` | Register a new user              | No            |
| POST   | `/auth/login`    | Login with email & password      | No            |
| POST   | `/auth/refresh`  | Refresh access token             | No            |
| POST   | `/auth/logout`   | Logout user                      | Yes           |

### Users (`/users`)

| Method | Endpoint   | Description          | Auth Required | Role Required |
|--------|------------|----------------------|---------------|---------------|
| POST   | `/users`   | Create new user      | Yes           | ADMIN         |
| GET    | `/users`   | Get all users        | Yes           | ADMIN         |

### Projects (`/projects`)

| Method | Endpoint   | Description         | Auth Required | Role Required      |
|--------|------------|---------------------|---------------|--------------------|
| POST   | `/`        | Create project      | Yes           | ADMIN, MANAGER     |
| GET    | `/`        | Get all projects    | Yes           | Any authenticated  |

### Tasks (`/tasks`)

| Method | Endpoint          | Description              | Auth Required | Role Required      |
|--------|-------------------|--------------------------|---------------|--------------------|
| POST   | `/`               | Create task              | Yes           | ADMIN, MANAGER     |
| GET    | `/`               | List all tasks           | Yes           | Any authenticated  |
| GET    | `/:id`            | Get task by ID           | Yes           | Any authenticated  |
| PUT    | `/:id`            | Update task              | Yes           | ADMIN, MANAGER     |
| DELETE | `/:id`            | Delete task              | Yes           | ADMIN              |
| PATCH  | `/:id/status`     | Change task status       | Yes           | ADMIN, MANAGER, MEMBER |

---

## Authentication

The API uses **JWT (JSON Web Tokens)** for authentication.

### Token Format

```
Authorization: Bearer <access_token>
```

Include the access token in the `Authorization` header of all protected endpoints.

### Token Types

- **Access Token** — Short-lived (typically 15-60 minutes), used for API requests
- **Refresh Token** — Long-lived, used to obtain a new access token without re-logging in

---

## User Roles

The system supports three role levels:

| Role   | Permissions                                        |
|--------|---------------------------------------------------|
| ADMIN  | Create users, projects, tasks; delete anything; update all tasks |
| MANAGER| Create projects and tasks; update tasks in their org |
| MEMBER | Change task status for assigned tasks only        |

---

## Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Database
DATABASE_URL=mysql://root:password@mysql:3306/team_task_tracker

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRY=3600

# Redis
REDIS_URL=redis://redis:6379

# Node Environment
NODE_ENV=production

# Server
PORT=3000
```

---

## Development Setup (Local)

### Prerequisites

- Node.js 20+
- npm or yarn
- MySQL 8.0+
- Redis 6.0+

### Installation

```bash
cd backend
npm install
```

### Running Locally

```bash
npm run dev
```

The server starts at `http://localhost:3000`.

---

## Testing

Run the test suite:

```bash
npm test
```

Tests are written using **Jest** and **Supertest** for API integration testing.

---

## Project Structure

```
backend/
├── src/
│   ├── app.js                    # Express app setup
│   ├── swagger.js                # Swagger/OpenAPI config
│   ├── controllers/              # Route handlers
│   ├── routes/                   # API route definitions
│   ├── middleware/               # Custom middleware
│   ├── services/                 # Business logic
│   ├── repositories/             # Data access layer
│   ├── validations/              # Input schemas (Zod)
│   ├── utils/                    # Helper functions
│   │   ├── prismaClient.js       # Prisma ORM client
│   │   ├── jwt.js                # JWT token generation
│   │   ├── redis.js              # Redis client
│   │   └── statusTransition.js   # Task status validation
│   ├── cache/                    # Caching logic
│   └── tests/                    # Test files
├── prisma/
│   └── schema.prisma             # Database schema
├── Dockerfile                    # Docker image definition
├── docker-compose.yml            # Multi-container setup
├── package.json                  # Dependencies
└── .env                          # Environment variables
```

---

## Docker Deployment

### Build and Run

```bash
docker compose up --build -d
```

This starts:
- **API** on port 3000
- **MySQL** on port 3306
- **Redis** on port 6379
- **Adminer** (DB UI) on port 8080

### View Logs

```bash
docker logs backend-app
docker logs mysql
docker logs redis
```

### Stop Services

```bash
docker compose down
```

---

## Swagger Documentation

Once the API is running, visit:

```
http://localhost:3000/docs
```

All endpoints are fully documented with request/response examples and try-it-out functionality.

---

## Error Handling

The API returns standardized error responses:

```json
{
  "status": 400,
  "code": "VALIDATION_ERROR",
  "message": "Email is invalid"
}
```

Common status codes:
- `200` — Success
- `201` — Created
- `400` — Validation error
- `401` — Unauthorized (missing/invalid token)
- `403` — Forbidden (insufficient permissions)
- `404` — Not found
- `500` — Server error

---

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "Add your feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

---

## License

ISC