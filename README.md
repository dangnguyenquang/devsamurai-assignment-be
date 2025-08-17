# Fullstack Assignment Backend

## Project Description

This is the backend API for a contact management and dashboard application, built with [NestJS](https://nestjs.com/) and using PostgreSQL as the database. The project supports user authentication (JWT), user management, contact management, dashboard statistics, and sample data seeding for development.

## Technologies Used

- **[NestJS](https://nestjs.com/):** Powerful Node.js framework for backend development.
- **[TypeScript](https://www.typescriptlang.org/):** Main programming language.
- **[Prisma ORM](https://www.prisma.io/):** ORM for querying and managing PostgreSQL databases.
- **[PostgreSQL](https://www.postgresql.org/):** Relational database management system.
- **[Passport](http://www.passportjs.org/):** User authentication (local & JWT).
- **[Docker](https://www.docker.com/):** Containerization and deployment.
- **[Jest](https://jestjs.io/):** Testing framework.
- **[Supertest](https://github.com/ladjs/supertest):** HTTP endpoint testing.
- **[class-validator, class-transformer]:** Input validation and transformation.
- **[date-fns]:** Date utilities.

## Installation Guide

### 1. System Requirements

- Node.js >= 18
- Docker & Docker Compose
- PostgreSQL (if not using Docker)

### 2. Clone the Repository

```bash
git clone <repo-url>
cd fullstack-assignment-be
```

### 3. Configure Environment Variables

Create a `.env` file based on the sample and fill in your database, JWT, and other configuration details.

```env

DATABASE_URL="postgresql://postgres:password@localhost:5432/assignment-db?schema=public"

PORT=3000

DB_HOST=db
DB_USERNAME=postgres
DB_PASSWORD=password
DB_PORT=5432
DB_DATABASE=assignment-db

PGADMIN_EMAIL=admin@admin.com
PGADMIN_PASSWORD=password
PGADMIN_HOST_PORT=5050
PGADMIN_CONTAINER_PORT=80

JWT_SECRET=401cf210d729346177f72276fe6b310d
JWT_EXPIRES_IN=7d

```

### 4. Start with Docker

```bash
docker-compose up --build
```

- The app will run at: http://localhost:3000/api/v1
- PgAdmin: http://localhost:5050

### 5. Manual Start (without Docker)

```bash
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

## Testing

### Run unit tests

```bash
npm run test
```

### Run e2e tests

```bash
npm run test:e2e
```

### Check coverage

```bash
npm run test:cov
```

## Assumptions

- Sample data will be seeded automatically on first startup (admin, sample users, contacts, visit history).
- JWT secret and environment variables must be configured correctly before running.
- The app runs on port 3000 by default.
- All API endpoints are prefixed with `/api/v1`.

## References

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Author:** Quang Dang
