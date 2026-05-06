# DevPulse

A cloud-native URL shortener and analytics platform built as a production-ready backend monorepo. DevPulse consists of three independent microservices — authentication, URL shortening with Redis-cached redirects, and real-time click analytics powered by Kafka event streaming. Designed from day one for Docker and Kubernetes deployment following 12-factor app principles.

---

## Architecture Overview

```
┌──────────────┐     ┌──────────────┐     ┌───────────────────┐
│ auth-service │     │ url-service  │     │ analytics-service │
│   (3001)     │◄────│   (3002)     │     │      (3003)       │
│  PostgreSQL  │     │   MongoDB    │     │    PostgreSQL     │
└──────────────┘     │   Redis      │     │    KafkaJS        │
                     │   KafkaJS    │────►│   (consumer)      │
                     └──────────────┘     └───────────────────┘
                           │                       ▲
                           │    Kafka Topic:       │
                           └──── "url-clicked" ────┘
```

| Service | Role |
|---------|------|
| **auth-service** | User registration, login, JWT token management |
| **url-service** | URL shortening, Redis-cached redirects, Kafka event publishing |
| **analytics-service** | Click event consumption from Kafka, analytics queries & dashboards |

---

## Tech Stack

| Service | Language | Database | Key Libraries |
|---------|----------|----------|---------------|
| auth-service | Node.js 20 | PostgreSQL 16 | Express, bcryptjs, jsonwebtoken, pg, express-validator |
| url-service | Node.js 20 | MongoDB 7, Redis 7 | Express, Mongoose, ioredis, nanoid, KafkaJS |
| analytics-service | Node.js 20 | PostgreSQL 16 | Express, pg, KafkaJS |

**Infrastructure**: Docker, Docker Compose, Apache Kafka (Confluent), Zookeeper

---

## Prerequisites

- **Node.js** ≥ 20.x
- **Docker** ≥ 24.x
- **Docker Compose** ≥ 2.x

---

## Run Locally

```bash
# 1. Clone the repository
git clone <repo-url> && cd devpulse

# 2. Create environment file
cp .env.example .env

# 3. Start everything with a single command
docker-compose up --build
```

All 3 services plus PostgreSQL, MongoDB, Redis, Zookeeper, and Kafka will start automatically.

### Verify services are running

```bash
curl http://localhost:3001/health   # auth-service
curl http://localhost:3002/health   # url-service
curl http://localhost:3003/health   # analytics-service
```

---

## API Reference

### Auth Service (port 3001)

| Method | Endpoint | Auth | Body | Response |
|--------|----------|------|------|----------|
| POST | `/api/auth/register` | No | `{ name, email, password }` | `{ token, user }` |
| POST | `/api/auth/login` | No | `{ email, password }` | `{ token, user }` |
| GET | `/api/auth/me` | Bearer | — | `{ user }` |
| GET | `/health` | No | — | `{ status, service }` |

### URL Service (port 3002)

| Method | Endpoint | Auth | Body | Response |
|--------|----------|------|------|----------|
| POST | `/api/urls` | Bearer | `{ originalUrl, title? }` | `{ shortCode, shortUrl, originalUrl }` |
| GET | `/api/urls` | Bearer | — | `[ ...urls ]` |
| DELETE | `/api/urls/:shortCode` | Bearer | — | `{ message: "deleted" }` |
| GET | `/r/:shortCode` | No | — | 301 redirect |
| GET | `/health` | No | — | `{ status, service }` |

### Analytics Service (port 3003)

| Method | Endpoint | Auth | Body | Response |
|--------|----------|------|------|----------|
| GET | `/api/analytics/:shortCode/summary` | Bearer | — | `{ shortCode, totalClicks, uniqueIps, firstClick, lastClick }` |
| GET | `/api/analytics/:shortCode/timeline` | Bearer | — | `[ { date, clicks } ]` |
| GET | `/api/analytics/dashboard` | Bearer | — | `{ totalUrls, totalClicks, topUrls }` |
| GET | `/health` | No | — | `{ status, service, kafkaConnected }` |

---

## Environment Variables

| Variable | Service | Description |
|----------|---------|-------------|
| `POSTGRES_USER` | Infrastructure | PostgreSQL username |
| `POSTGRES_PASSWORD` | Infrastructure | PostgreSQL password |
| `POSTGRES_DB` | Infrastructure | PostgreSQL database name |
| `AUTH_PORT` | auth-service | HTTP port (default: 3001) |
| `JWT_SECRET` | auth-service | JWT signing secret (min 32 chars) |
| `AUTH_DB_URL` | auth-service | PostgreSQL connection string |
| `URL_PORT` | url-service | HTTP port (default: 3002) |
| `MONGO_URI` | url-service | MongoDB connection string |
| `REDIS_URL` | url-service | Redis connection string |
| `AUTH_SERVICE_URL` | url-service, analytics-service | Internal URL to auth-service |
| `BASE_URL` | url-service | Public base URL for short links |
| `KAFKA_BROKER` | url-service, analytics-service | Kafka broker address |
| `ANALYTICS_PORT` | analytics-service | HTTP port (default: 3003) |
| `ANALYTICS_DB_URL` | analytics-service | PostgreSQL connection string |
| `KAFKA_BROKER_ID` | Kafka | Broker ID |
| `KAFKA_ZOOKEEPER_CONNECT` | Kafka | Zookeeper connection string |
| `KAFKA_ADVERTISED_LISTENERS` | Kafka | Kafka advertised listeners |

---

## Project Structure

```
devpulse/
├── services/
│   ├── auth-service/
│   │   ├── src/
│   │   │   ├── config/        db.js
│   │   │   ├── models/        User.js
│   │   │   ├── controllers/   authController.js
│   │   │   ├── routes/        authRoutes.js
│   │   │   ├── middleware/    authenticate.js, errorHandler.js
│   │   │   └── app.js
│   │   ├── Dockerfile
│   │   ├── .env.example
│   │   └── package.json
│   ├── url-service/
│   │   ├── src/
│   │   │   ├── config/        db.js, redis.js, kafka.js
│   │   │   ├── models/        Url.js
│   │   │   ├── controllers/   urlController.js
│   │   │   ├── routes/        urlRoutes.js
│   │   │   ├── middleware/    authenticate.js, errorHandler.js
│   │   │   └── app.js
│   │   ├── Dockerfile
│   │   ├── .env.example
│   │   └── package.json
│   └── analytics-service/
│       ├── src/
│       │   ├── config/        db.js, kafka.js
│       │   ├── models/        ClickEvent.js
│       │   ├── consumers/     clickConsumer.js
│       │   ├── controllers/   analyticsController.js
│       │   ├── routes/        analyticsRoutes.js
│       │   ├── middleware/    authenticate.js, errorHandler.js
│       │   └── app.js
│       ├── Dockerfile
│       ├── .env.example
│       └── package.json
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## License

MIT
