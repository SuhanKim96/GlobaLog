_In English_: [README_EN.md](README_EN.md)

# GlobaLog

다통화 자산 관리 및 정밀 가계부 플랫폼. 환율 변동을 반영하여 외화 자산의 정확한 원화 가치와 가중 평균 환율(평단가)을 추적합니다.

---

## Summary

유학생으로서 KRW, SGD, USD 등 여러 통화를 동시에 관리하며 느낀 불편함에서 시작된 프로젝트입니다. 기존 가계부 앱들은 입력 시점의 고정 환율만 사용하거나 환전 시 발생하는 평균 환율 계산에 한계가 있었습니다. 이를 해결하기 위해 거래 날짜 기준의 과거/실시간 환율 API를 연동하고, 가중 평균 환율(Weighted Average) 공식을 적용하여 소수점 8자리까지 정밀하게 자산 가치를 추적할 수 있는 다통화 특화 가계부를 구현했습니다.

---

## Key Features

- **다통화 지갑**: 통화별 독립 지갑 생성 및 실시간 잔액 관리 (KRW, USD, SGD, EUR, HKD)
- **과거/실시간 환율 자동 연동**: Frankfurter API를 통해 거래 날짜에 해당하는 정확한 환율을 백엔드에서 자동 조회
- **가중 평균 환율 자동 계산**: 입금 시마다 가중 평균 공식으로 평단가를 소수점 8자리 정밀도로 갱신하여 DB에 저장
- **포트폴리오 요약 대시보드**: 보유 지갑 수, 추적 통화 목록, 통화별 총 잔액을 한 화면에 집계
- **과거 내역 소급 적용**: 특정 날짜의 거래 기록 시 해당일 환율 데이터를 자동 적용
- **자산 변환 시각화**: 외화 잔액, 원화 환산 총액, 평균 적용 환율을 동시에 표시

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

**주요 설계 결정:**
- 읽기 메서드에 `@Transactional(readOnly = true)` 적용 → Hibernate dirty-checking 비활성화로 오버헤드 절감
- `deleteWallet()` 2단계 삭제(거래 내역 → 지갑)를 단일 트랜잭션으로 묶어 고아 데이터 방지
- `BigDecimal` 전면 도입 — 중간 계산 시 `scale=18`, 최종 저장 시 `scale=8`, `RoundingMode.HALF_UP`
- `@RestControllerAdvice`로 전역 예외 처리 — `IllegalArgumentException → 400`, `RuntimeException → 500`
- Bean Validation(`@NotNull`, `@Positive`, `@Pattern`)으로 DTO 입력값 사전 차단
- RestTemplate 커넥션 3초 / 읽기 5초 타임아웃 설정

---

## Roles

개인 프로젝트 — 기획, 백엔드 개발, 데이터베이스 설계를 전담하였으며, 프론트엔드 UI는 AI 페어 프로그래밍을 활용했습니다.

---

## Key Learnings

- **금융 로직의 정합성**: 가중 평균 공식을 비즈니스 로직에 통합하고 BigDecimal precision/scale로 소수점 오차를 제어하는 방법 습득
- **트랜잭션 원자성**: 다단계 DB 작업에서 `@Transactional`의 롤백 동작과 데이터 무결성의 중요성 체감
- **외부 API 방어적 코드 작성**: 타임아웃 미설정 시 스레드 무한 대기 문제를 직접 발견하고 수정하며 외부 의존성에 대한 방어 코드의 중요성 인식
- **API 설계 성숙도**: 전역 예외 핸들러와 DTO 검증으로 잘못된 요청이 서비스 레이어에 도달하기 전에 차단하는 구조 설계
- **Spring Security**: 필터 체인의 동작 원리를 이해하고 CORS 정책을 SecurityConfig에 중앙화

---

## How to Run Locally

### Prerequisites

- Java 17+
- PostgreSQL
- Node.js 18+

### 1. Backend

`api/src/main/resources/application.properties`에서 PostgreSQL 접속 정보를 설정합니다.

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

프론트엔드는 `http://localhost:5173`에서 실행되며, Vite 프록시를 통해 백엔드(`localhost:8080`)와 통신합니다.
