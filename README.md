# Supermarket Checkout System

A Node.js/TypeScript application that implements a checkout system with dynamic pricing rules and special offers, backed by MongoDB. It supports:

- **Scanning items** and calculating totals  
- **Special pricing rules** (e.g., “3 for 130”)  
- **Flexible pricing configuration** stored in MongoDB  
- **Import aliases** via `@/…` (using `tsconfig-paths`)  
- **Unit testing** with Jest (including coverage reports)  
- **Containerization** via Docker and Docker Compose  

---

## Table of Contents

1. [Prerequisites](#prerequisites)  
2. [Installation](#installation)  
3. [Environment Variables](#environment-variables)  
4. [Seeding the Database](#seeding-the-database)  
5. [Running Locally](#running-locally)  
6. [Running Tests](#running-tests)  
7. [Coverage Report](#coverage-report)  
8. [Docker Setup](#docker-setup)  
   - [Building & Starting the Containers](#building--starting-the-containers)  
   - [Tearing Down the Containers](#tearing-down-the-containers)  
   - [Seeding via Docker Init Script](#seeding-via-docker-init-script)  
9. [Connecting via MongoDB Compass](#connecting-via-mongodb-compass)  
10. [Project Structure](#project-structure)  
11. [Linting & Formatting](#linting--formatting)  

---

## Prerequisites

- **Node.js** v18+  
- **npm** v8+  
- **Docker** & **Docker Compose** (for containerized setup)  
- (Optional, for local DB) **MongoDB** v6+ running locally  

---

## Installation

1. **Clone the repository**  
   ```bash
   git clone https://github.com/your-username/supermarket-checkout.git
   cd supermarket-checkout
   ```
<br>

2. **Install dependencies**
   ```bash
   npm install
   ```
<br>

3. **Build the TypeScript code (outputs compiled JS to `dist/`)**
    ```bash
    npm run build
    ```

---

## Environment Variables

Create a `.env` file in the project root:

```ini
# .env
MONGO_URI=mongodb://localhost:27017/checkoutdb
```

- `MONGO_URI`: MongoDB connection URI:
    - For local development: `mongodb://localhost:27017/checkoutdb`
    - For Docker Compose: `mongodb://mongo:27017/checkoutdb`


---

## Seeding the Database

1. **Using the standalone seed script**
    - A typeScript seed script (`/seeds/pricing.local.seed.ts`) at the project root:
        - Connects to MongoDB (using `MONGO_URI`),
        - Clears the `pricingrules` collection,
        - Inserts example rules (SKUs `A`, `B`, `C`).
    <br>
    - Run the seed script locally
        1. Ensure MongoDB is running locally.
        2. Run:
        <br>
        ```bash
        npm run seed
        ```
        3. You’ll see console messages about inserted documents.
<br>

2. **Seeding in docker mongodb container**
    - A plain JavaScript seed script (`/seeds/pricing.seed.js`) connects to `checkoutdb` using the mongo shell API.
    - If `pricingrules` is empty, it inserts your initial documents.
    - Docker runs that `.js` file automatically (via /`docker-entrypoint-initdb.d/`) when creating a new Mongo container with an empty volume.
---

## Running Locally

You can run the application in two modes:
- Compiled JS mode (production-like)
- Dev TS mode (live edits via `ts-node`)


1. **Compiled JS mode**
    1. Build the project:
    ```bash
    npm run build
    ```
    2. Start MongoDB locally.
    3. Seed the database (see above).
    4. Run the app:
    ```bash
    npm run start
    ```
    <br>
    Expected Output

    ```mathematica
    MongoDB connected
    Scanned Items: [A, B, A, A, B, B, B, C]
    Total price: $255
    ```
<br>

2. **Dev TS (ts-node) mode**
    1. Start MongoDB locally.
    2. Seed the database.
    3. Run:
    ```bash
    npm run dev
    ```

---

## Running Tests

Unit tests with Jest cover:

- `Checkout` class (totals, ignoring unknown SKUs, special pricing)

- `PricingService` (loading & retrieving rules)

<br>

To run tests:
```bash
npm run test
```

---

## Coverage Report

Jest collects coverage for all `src/**/*.ts` (excluding `*.d.ts`) with an 90% threshold.

1. Run:
    ```bash
    npm run test:coverage
    ```

2. View summary in console and HTML report in `coverage/lcov-report/index.html`.


---

## Docker Setup

A `Dockerfile` for the app and `docker-compose.yml` to run both MongoDB and Node:

**docker-compose.yml**
```yaml
services:
  mongo:
    image: mongo:6
    container_name: checkout-mongo
    restart: always
    ports:
      - '27017:27017'
    volumes:
      - mongo-data:/data/db
      - ./seeds/pricing.seed.js:/docker-entrypoint-initdb.d/seed.js:ro

  app:
    build: .
    container_name: checkout-app
    restart: "on-failure"
    depends_on:
      - mongo
    env_file:
      - .env

volumes:
  mongo-data:
```

<br>

#### Building & Starting the Containers

1. Ensure `.env` has:

    ```ini
    MONGO_URI=mongodb://mongo:27017/checkoutdb
    ```

2. Run (detached):
    ```bash
    docker compose up --build -d
    ```

3. Tail logs:
    ```bash
    docker compose logs -f app
    ```

    Expected:
    ```mathematica
    checkout-app  | MongoDB connected
    checkout-app  | Scanned Items: [A, B, A, A, B, B, B, C]
    checkout-app  | Total price: $255
    ```
<br>

#### Tearing Down the Containers

```bash
docker compose down -v
```

<br>

#### Seeding via Docker Init Script

Files in `seeds/` run on first Mongo startup. Example `seeds/pricing.seed.js`:

```js
// Switch to (or create) "checkoutdb":
db = db.getSiblingDB('checkoutdb');

// Seed if empty:
if (db.pricingrules.countDocuments({}) === 0) {
  db.pricingrules.insertMany([
    { sku: 'A', unitPrice: 50, specialPrice: { quantity: 3, totalPrice: 130 } },
    { sku: 'B', unitPrice: 30, specialPrice: { quantity: 3, totalPrice: 75 } },
    { sku: 'C', unitPrice: 20 }
  ]);
  print('Seeded pricingrules collection');
} else {
  print('pricingrules already has data; skipping seed.');
}
```

---

## Connecting via MongoDB Compass

1. Ensure Mongo is running (`docker compose up --build -d`).
2. Open Compass.
3. Connect to:
    ```bash
    mongodb://localhost:27017/checkoutdb
    ```
4. You’ll see the `checkoutdb` database and `pricingrules` collection.


---

## Project Structure

```bash
.
├── coverage/                   # Jest coverage (ignored by Git)
├── dist/                       # Compiled JS (after `npm run build`)
├── seeds/
│   └── pricing.seed.js         # Mongo init script
├── node_modules/
├── src/
│   ├── classes/
│   │   └── Checkout.ts         # Checkout logic
│   ├── connections/
│   │   └── mongo.conn.ts       # MongoDB connection helper
│   ├── models/
│   │   └── PricingRule.ts      # Mongoose schema & interface
│   ├── services/
│   │   └── pricing.service.ts   # Loads pricing rules from MongoDB
│   └── index.ts                # Application entrypoint
├── tests/
│   ├── mocks/
│   │   └── checkout.mock.ts    # Mock data for tests
│   └── scripts/
│       ├── checkout.test.ts    # Checkout class tests
│       └── service.test.ts     # Service class tests
├── .dockerignore
├── .env                        # Environment variables (ignored by Git)
├── .gitignore
├── jest.config.js              # Jest config (aliases, coverage)
├── package.json
├── run.sh                      # Script: run tests + Docker
├── seed.ts                     # Standalone seed script (TS)
├── tsconfig.json               # TypeScript config (paths, aliases)
└── docker-compose.yml
```

---

## Linting & Formatting

- ESLint:
    ```bash
    npm run lint
    ```

- ESLint (along with the fixes):
    ```bash
    npm run lint:fix
    ```

- Prettier:
    ```bash
    npm run format
    ```

---

With this setup, you can develop, test, and deploy the checkout system:

- Locally: run MongoDB, seed, and use `npm run dev` or `npm run start`.
- Docker: `docker compose up --build -d`, then `docker compose logs -f app`.