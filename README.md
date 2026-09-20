# TripMatcher

TripMatcher is a full-stack web application that helps users explore travel destinations within a chosen budget. Users select a departure airport, travel month, number of nights, budget, and an optional destination category; the application returns matching destinations ordered by estimated total cost.

> **Note:** the displayed cost is an estimate based on the flight and accommodation data stored in the database. It is not a booking quote.

## Features

- Search destinations by departure airport, month, number of nights, maximum budget, and category (city, seaside, or mountain).
- Calculate an estimated total cost from an average flight price and an average nightly accommodation price.
- Browse destination cards and a detail page with an image, description, and outbound links to Skyscanner, Booking.com, and Airbnb.
- Create an account, sign in, sign out, and retain the authenticated user in a server-side session.
- Populate or update the destination dataset with a Node.js script that retrieves destination images and flight-price data.

## Architecture

```text
React + Vite frontend
        |
        | JSON over HTTP
        v
Java / Jakarta Servlet API
        |
        | JDBC / DAO
        v
MySQL database
        ^
        |
Node.js data-update script (Unsplash + Travelpayouts)
```

The React frontend calls the Java backend through JSON endpoints. The backend uses servlet controllers, a DAO layer, JDBC, and MySQL to handle authentication and destination matching. Authentication is session-based; passwords are hashed with BCrypt before storage. A separate Node.js script can populate destination details, images, and price-trend records.

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React, Vite, React Router, CSS |
| Backend | Java 25, Maven, Jakarta Servlet API 6.1, Gson |
| Data | MySQL, JDBC, DAO pattern |
| Authentication | HTTP sessions, BCrypt |
| Data update | Node.js, `mysql2`, `node-fetch`, `dotenv` |
| External services used by the update script | Unsplash API, Travelpayouts API |

## Project Structure

```text
TripMatcher/
├── frontend/       # React/Vite single-page application
├── backend/        # Java servlet application packaged as a WAR
└── bot/            # Node.js script to populate/update destination data
```

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+ (required by the Vite version used by the frontend)
- npm
- JDK 25 (the Maven project targets Java 25)
- Maven
- MySQL
- A Jakarta Servlet 6.1-compatible application server to deploy the generated WAR

### 1. Configure the backend

Create `backend/.env` for the database connection:

```dotenv
DB_HOST=localhost
DB_PORT=3306
DB_NAME=tripm
DB_USER=your_database_user
DB_PASSWORD=your_database_password
```

The backend expects a user-account table together with `destination` and `price_trends`.

> **Database setup:** create the `tripm` database and import the project's sanitized schema-and-demo-data dump before starting the application. The demo data must include records for `destination` and `price_trends`, otherwise valid searches can return no results. Database credentials and personal data must never be included in version control.

For a local MySQL installation, the import can be performed with:

```bash
mysql -u your_database_user -p -e "CREATE DATABASE IF NOT EXISTS tripm CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;"
mysql -u your_database_user -p tripm < database/tripmatcher-demo.sql
```

Build the backend WAR:

```bash
cd backend
mvn clean package
```

Deploy the resulting WAR from `backend/target/` to your servlet container. The deployed context path depends on the application-server configuration.

The CORS filter reads `FRONTEND_URL` directly from the application server environment, rather than from `backend/.env`. Set it to the address of the Vite frontend before starting the server:

```dotenv
FRONTEND_URL=http://localhost:5173
```

### 2. Configure and start the frontend

Create `frontend/.env` and point it to the deployed backend API. Replace `<context-path>` with the context path assigned by your server.

```dotenv
VITE_API_BASE_URL=http://localhost:8080/<context-path>/api
```

Then install dependencies and start the development server:

```bash
cd frontend
npm ci
npm run dev
```

`npm ci` installs the Vite version and all other frontend dependencies from `package-lock.json`; Vite does not need to be installed globally. The Vite development server is configured to run at `http://localhost:5173` by default, which must match `FRONTEND_URL` in the backend server environment.

### 3. Optional: update destination data

The script in `bot/updateDestinations.js` inserts or updates destination data, retrieves images from Unsplash, and retrieves flight prices from Travelpayouts.

Create `bot/.env` with the required values:

```dotenv
DB_HOST=localhost
DB_NAME=tripm
DB_USER=your_database_user
DB_PASS=your_database_password
UNSPLASH_KEY=your_unsplash_access_key
TRAVELPAYOUTS_TOKEN=your_travelpayouts_token
```

Then run:

```bash
cd bot
npm ci
node updateDestinations.js
```

The bot is not required for a first local run when the imported demo database already contains destination and price-trend records. The update script currently requests flight data with Rome Fiumicino (`FCO`) as its configured origin. The application can search other origins when corresponding records are present in the database.

## API Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/signup` | Register a user |
| `POST` | `/api/signin` | Start an authenticated session |
| `POST` | `/api/searchDestinations` | Find destinations that match the search criteria |
| `GET` | `/api/me` | Retrieve the current session user |
| `GET` | `/api/logout` | End the current session |

`POST /api/searchDestinations` accepts an `origin`, `month`, `nights`, `maxBudget`, and an optional `category`.

## Security Notes

- `.env` files are excluded from version control. Do not commit database passwords or third-party API keys.
- The database demo dump contains only non-personal, demonstration data; do not include real user accounts or email addresses.
- The backend hashes account passwords with BCrypt before storing them.
- If a secret is ever committed, revoke or rotate it immediately; removing it from a later commit is not sufficient.

## Current Limitations

- Accommodation prices in the update script are algorithmically estimated rather than retrieved from a hotel-pricing provider.
- The repository does not yet include database initialization files or automated tests.
