# TaskFlow

A modern full-stack task management platform built for teams that need speed, accountability, and clean developer architecture.

![Next.js](https://img.shields.io/badge/Next.js-16.2.2-000000?logo=next.js&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animations-0055FF?logo=framer&logoColor=white)

## Key Features

- Role-Based Access Control (RBAC) with `ADMIN` and `USER` roles.
- Real-time style audit visibility with a dedicated Audit Log system for task actions.
- Advanced task management with full CRUD, filtering support, and pagination.
- Theme system with Dark/Light mode and system preference sync.
- Beautiful, responsive UI enhanced with Framer Motion animations.

## Tech Stack

### Frontend

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Axios
- next-themes

### Backend

- NestJS 11
- TypeScript
- JWT Authentication + Guards
- Role-based authorization (custom decorators + guards)
- Swagger API documentation

### Database

- PostgreSQL
- Prisma ORM

## 🚀 Quick Start with Docker

### Prerequisites

- Docker & Docker Compose installed

### Steps

### 1. Clone the repository

```bash
git clone https://github.com/engrsakib/TaskFlow-Service-Layer-NestJS-Architecture-.git
cd TaskFlow-Service-Layer-NestJS-Architecture-
```

### 2. Open terminal in the root directory

Make sure your terminal is inside the project root where `docker-compose.yml` exists.

### 3. Build and run containers

```bash
docker-compose up --build
```

### Access Info

- App: `http://localhost`
- Swagger Docs: `http://localhost/api/docs`
- API Base: `http://localhost/api/v1`

### Environment Note

The required `.env` files are already configured for Docker inside `backend/` and `frontend/`.

## Test Credentials (Important)

Use these seeded accounts for testing:

### Admin

- Email: `admin@example.com`
- Password: `password123`

### User

- Email: `user@example.com`
- Password: `password123`

## API Endpoints Summary

Base path: `/api/v1`

- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current authenticated user
- `GET /tasks` - List tasks with pagination
- `POST /tasks` - Create task
- `PATCH /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task
- `GET /users` - User management endpoints (admin-protected where applicable)
- `GET /audit` - Audit logs (admin only)

## Developer Profile

Developed by Md. Nazmus Sakib

- GitHub: [engrsakib](https://github.com/engrsakib)
- LinkedIn: [Md. Nazmus Sakib](https://www.linkedin.com/in/md-nazmus-sakib/)

## License

This project is licensed under the MIT License.
