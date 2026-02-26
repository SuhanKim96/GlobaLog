_In English_: [README_EN.md](README_EN.md)

# 🌍 GlobaLog (Borderless Expense Tracker)
> **국경 없는 다통화 가계부 및 자산 트래커** > 유학생의 실생활 고민에서 시작된, 환율 변동까지 반영하는 정밀한 자산 관리 서비스입니다.

---

## 📝 Summary
제가 유학생으로 지내며 실제로 필요하다고 느껴서 제작하게 된 웹 서비스입니다. 한국 원화(KRW)와 유학 중인 국가의 통화(SGD 등), 그리고 달러(USD)까지 여러 통화가 섞인 자산을 관리하는 것은 기존 가계부 앱들로는 한계가 있었습니다. 특히 요즘 급변하는 환율, 그리고 환전을 할 때마다 달라지는 '환율' 때문에 내 자산의 정확한 원화 가치를 파악하기 어려웠습니다. 이를 해결하기 위해 입력한 날짜의 과거 환율과 실시간 환율을 자동으로 가져오고, 입금 시마다 '평균 적용 환율(평단가)'을 정확히 계산해 주는 다통화 특화 가계부를 직접 구현하게 되었습니다.

---

## ⭐️ Key Function
* **다통화 지갑 생성**: KRW, SGD, USD 등 사용자가 원하는 기준 통화로 지갑(Wallet)을 생성 및 관리
* **과거 및 실시간 환율 연동**: Frankfurter API를 연동하여, 거래 날짜(과거/현재)에 맞는 정확한 환율을 백엔드에서 자동으로 가져와 금액을 변환
* **가중 평균 환율(평단가) 자동 계산**: 서로 다른 환율로 여러 번 입금하더라도, 가중 평균 공식을 통해 '최종 적용 환율'을 소수점 8자리 정밀도로 정확하게 계산하여 데이터베이스에 저장
* **직관적인 자산 변환 UI**: 외화로 가진 현재 잔액뿐만 아니라, 내가 실제 투입한 '원화(KRW) 환산 총액'과 '평균 적용 환율'을 한눈에 볼 수 있도록 시각화
* **날짜 지정 입출금 기록**: 과거의 지출/수입 내역도 당시의 환율을 적용하여 정확하게 추가 가능

---

## 🛠 Tech Stack
* **Backend**: Java, Spring Boot, Spring Data JPA, Hibernate, PostgreSQL, Spring Security
* **Frontend**: React (Vite), JavaScript, CSS, HTML5 *(Note: Frontend work was assisted with AI)*
* **External API**: Frankfurter Exchange Rates API

---

## ⚙️ Architecture
* RESTful API 기반의 Client-Server Architecture (Spring Boot 백엔드 & React SPA 프론트엔드)

---

## 🤚🏻 Part
* **개인 프로젝트** (기획, 백엔드 개발, 데이터베이스 설계)
* **프론트엔드 개발** (AI 어시스턴트와의 페어 프로그래밍을 통한 UI/UX 구현)

---

## 🤔 Learned
* 외부 REST API(Frankfurter 환율 API)를 Spring Boot RestTemplate을 활용해 연동하고, 동적 파라미터(날짜, 통화)를 처리하는 방법 습득
* 서로 다른 시점의 환율을 적용하기 위한 '가중 평균(Weighted Average)' 수학 공식을 비즈니스 로직에 통합하는 과정 경험
* JPA 엔티티 설계 시, 미세한 환율 오차를 방지하기 위한 소수점 정밀도 제어(precision, scale)의 중요성 체감
* Spring Security를 통한 CSRF 비활성화 및 CORS(Cross-Origin Resource Sharing) 설정으로 프론트엔드-백엔드 간의 통신 이슈 해결
* AI와의 협업을 통해 프론트엔드 UI를 신속하게 구현하고, API 응답 데이터를 화면에 효율적으로 바인딩하는 방법 학습

---

## 📺 Demo Video