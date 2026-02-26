# 🌍 GlobaLog (Borderless Expense Tracker)
> **A Precise Multi-Currency Ledger & Asset Tracker**
> Born from the real-world challenges of an international student, GlobaLog is a service that tracks assets with precision, accounting for fluctuating exchange rates.

---

## 📝 Summary
GlobaLog is a web service I developed based on my personal needs as an international student. Managing assets across various currencies—such as Korean Won (KRW), Singapore Dollars (SGD), and US Dollars (USD)—revealed the limitations of existing expense tracker apps. Specifically, the high volatility of exchange rates made it difficult to determine the exact base-currency value of my assets every time I exchanged money. To solve this, I implemented a specialized multi-currency ledger that automatically fetches historical and real-time exchange rates and accurately calculates the "Weighted Average Exchange Rate" for every deposit.

---

## ⭐️ Key Functions
* **Multi-Currency Wallet Creation**: Create and manage wallets in various base currencies such as KRW, SGD, USD, etc.
* **Historical & Real-time Rate Integration**: Integrated with the Frankfurter API to automatically fetch the exact exchange rate corresponding to the transaction date (past or present).
* **Automated Weighted Average Rate Calculation**: Even with multiple deposits at different rates, the system uses a weighted average formula to calculate the "final applied rate" with 8-decimal precision and stores it in the database.
* **Intuitive Asset Conversion UI**: Visualizes not only the current foreign currency balance but also the "Total Invested Base Currency (e.g., KRW)" and the "Average Applied Rate" at a glance.
* **Date-Specific Transaction Logging**: Seamlessly record past expenses or income by applying the accurate exchange rate from the specific date of the transaction.

---

## 🛠 Tech Stack
* **Backend**: Java, Spring Boot, Spring Data JPA, Hibernate, PostgreSQL, Spring Security
* **Frontend**: React (Vite), JavaScript, CSS, HTML5 *(Note: Frontend work was assisted by AI)*
* **External API**: Frankfurter Exchange Rates API

---

## ⚙️ Architecture
* **RESTful API-based Client-Server Architecture** (Spring Boot Backend & React SPA Frontend)

---

## 🤚🏻 Roles & Responsibilities
* **Personal Project**: Planning, Backend Development, and Database Design.
* **Frontend Development**: UI/UX implementation through pair programming with an AI assistant.

---

## 🤔 Key Learnings
* **External API Integration**: Learned how to integrate the Frankfurter Exchange Rates API using Spring Boot's `RestTemplate` and handle dynamic parameters (dates, currencies).
* **Business Logic Implementation**: Integrated the mathematical "Weighted Average" formula into the backend logic to handle transactions occurring at different exchange rates.
* **Database Precision**: Experienced the importance of controlling decimal precision (`precision`, `scale`) in JPA entity design to prevent micro-errors in financial data.
* **Security & Communication**: Resolved communication issues between Frontend and Backend by configuring CORS (Cross-Origin Resource Sharing) and disabling CSRF via Spring Security.
* **AI Collaboration**: Learned how to rapidly build a Frontend UI and efficiently bind API response data to the display through collaboration with AI.

---

## 📺 Demo Video

---

## 🚀 How to Run Locally

### 1. Backend
* Configure your PostgreSQL credentials in `application.properties`.
* Run the following command in the project root or start `ApiApplication` via IDE.
```bash
./gradlew bootRun
```

### 2. Frontend
* Navigate to the `frontend` directory, install dependencies, and start the server.
```bash
cd frontend
npm install
npm run dev
```