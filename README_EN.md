_한국어_: [README.md](README.md)

# GlobaLog

A multi-currency asset management and expense tracking platform. Tracks the precise base-currency value and weighted average exchange rate of foreign currency holdings, accounting for exchange rate fluctuations over time.

---

## Summary

This project originated from the real-world challenge of managing assets across multiple currencies — KRW, SGD, USD — as an international student. Existing expense apps either applied a fixed exchange rate at the time of input or lacked the ability to calculate a running average rate across multiple transactions at different rates. To address this, GlobaLog integrates a historical and real-time exchange rate API (keyed to the transaction date) and applies a weighted average formula to track asset value with 8-decimal precision.

---

## Key Features

- **Multi-Currency Wallets**: Create and manage independent wallets per currency (KRW, USD, SGD, EUR, HKD)
- **Historical and Real-time Rate Fetching**: Automatically retrieves the exchange rate for the exact transaction date via the Frankfurter API
- **Weighted Average Rate Calculation**: Recalculates the average cost-basis rate on every deposit using the weighted average formula, stored at 8-decimal precision
- **Portfolio Summary Dashboard**: Aggregates total wallet count, tracked currencies, and total balance per currency in a single view
- **Backdated Transaction Support**: Records past transactions using the actual exchange rate from that date
- **Asset Conversion Visualization**: Displays foreign currency balance, KRW-equivalent total, and average applied rate simultaneously

---

## Tech Stack

| Layer | Stack |
|---|---|
| Backend | Java 17, Spring Boot 4.0.1, Spring Data JPA, Hibernate, Spring Security, Spring Validation |
| Database | PostgreSQL |
| Frontend | React 19 (Vite), React Router DOM, CSS Custom Properties |
| External API | Frankfurter Exchange Rates API |
| Build | Gradle |

---

## Architecture

```
Client (React SPA)
    |
    | HTTP (Vite proxy → localhost:8080)
    |
Spring Boot Application
    ├── Controller Layer   — 6 REST endpoints, @Valid request validation
    ├── Service Layer      — Business logic, @Transactional management
    ├── Repository Layer   — Spring Data JPA, custom derived queries
    └── Domain Layer       — JPA entities (Wallet, Transaction)
    |
PostgreSQL
```

**Key design decisions:**
- `@Transactional(readOnly = true)` on all read-path methods — disables Hibernate dirty-checking to reduce overhead
- Two-step `deleteWallet()` (transactions → wallet) wrapped in a single `@Transactional` to prevent orphaned records
- `BigDecimal` used throughout — intermediate calculations at `scale=18`, final persistence at `scale=8` with `RoundingMode.HALF_UP`
- `@RestControllerAdvice` for global exception handling — maps `IllegalArgumentException → 400`, `RuntimeException → 500`
- Bean Validation (`@NotNull`, `@Positive`, `@Pattern`) on DTOs to reject invalid requests before reaching the service layer
- RestTemplate configured with 3s connection timeout and 5s read timeout

---

## Roles

Personal project — solely responsible for planning, backend development, and database design. Frontend UI was implemented through AI pair programming.

---

## Key Learnings

- **Financial logic correctness**: Integrated the weighted average formula into business logic and controlled decimal precision with BigDecimal `precision`/`scale` to eliminate floating-point errors
- **Transaction atomicity**: Understood the rollback behavior of `@Transactional` and the importance of data integrity across multi-step database operations
- **Defensive API integration**: Identified and fixed an indefinite thread-blocking issue caused by missing RestTemplate timeouts, reinforcing the importance of defensive code for external dependencies
- **API design maturity**: Designed a global exception handler and DTO validation layer to intercept malformed requests before they reach business logic
- **Spring Security**: Understood the filter chain execution order and centralized CORS policy into a single `SecurityConfig`

---

## How to Run Locally

### Prerequisites

- Java 17+
- PostgreSQL
- Node.js 18+

### 1. Backend

Configure your PostgreSQL credentials in `api/src/main/resources/application.properties`.

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/globalog
spring.datasource.username=your_username
spring.datasource.password=your_password
```

```bash
cd api
./gradlew bootRun
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and communicates with the backend at `localhost:8080` via the Vite proxy.
