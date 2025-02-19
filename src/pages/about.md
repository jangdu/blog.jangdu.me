---
layout: ../layouts/AboutLayout.astro
title: "About"
---

- Kotlin 또는 Java로 Spring Framework에서의 개발 경험은 없지만 의존성 주입(DI)과 같은 기능을 제공하는 비슷한 Framework인 NestJS를 사용한 백엔드 개발에 익숙합니다. NextJS에 대한 경험이 없었지만, 개인적인 학습을 통해서 한달 내에 프로젝트에 기여한 경험이 있습니다. 경험하지 못한 기술을 적극적으로 학습해 적용하는 과정을 즐기는 개발자로, 부족한 부분은 빠르게 적응해 프로젝트에 기여할 수 있습니다.
- 백엔드 4명으로 구성된 팀에서 프로젝트를 진행하며, 프론트엔드를 함께 구현할 수 있도록 이전에 학습했던 React 관련 지식을 공유하는 등 소통을 기반으로 학습하며 성장하는 개발자입니다.
- 텍스트로 된 데이터를 직접 AI에 입력해 Audio로 변환하던 단순 반복 작업을 자동화하는 등 반복을 지양하며 효율적인 환경을 구성하기 위해서 노력합니다.
- 사용자의 피드백을 기반으로 문제를 제시하고 해결하는 경험을 통해 성장한다고 생각합니다.
  개인 프로젝트보다 업무에 시간을 투자하며 몰입해 성장하는 개발자입니다.

## Skills

- **frontend :** JavaScript, TypeScript, React.js, Next.js, react-query
- **backend :** ExpressJS, NestJS, AWS (EC2, S3, Lambda 등), Azure (VM, Azure Functions 등)
- **DataBase :** MySQL, PostgreSQL, Firebase

## 경력

## 주식회사 아고라스 (2023.12 ~ )

### 웹 기반 코딩 교육 플랫폼 codefriends 풀스택 개발

[https://www.codefriends.net](https://www.codefriends.net/)

- Frontend(NextJS, react-query, Recoil) 개발
- Backend(NestJS, typeORM, MySQL) 개발, 배포, 운영

- Recoil 상태관리 개선

  - 여러 컴포넌트에서 상태를 수정하며 문제 발생
  - 해당 상태 수정 로직을 커스텀 훅으로 변경하며 문서화 진행
  - 향후 다른 상태 관리 라이브러리 도입 시 기준점 수립

- 수업자료를 프로젝트 내부 JSON을 S3로 이전 및 빌드 속도 개선

  - 수업 자료를 S3로 이동해 프로젝트 크기 90% 감소
  - 추가된 S3 Call로 인해 느려진 렌더링은 SSG를 통해 개선

- 수강생 학습 통계 일관성 이슈 해결

  - 여러 테이블에 무분별하게 저장되는 수강 시간, 진행율 일관성 이슈 발생
  - 여러 테이블들의 데이터를 통일 후, 조회 시 날짜, 강좌 별 Redis를 통한 해결

- TypeORM 0.2버전에서 0.3으로 마이그레이션

- 전역 Exception 처리
  - NestJS의 global filter를 사용해 ValidationError와 같은 예외처리
  - 모든 Service에서 try-catch를 사용하던 비효율적인 과정 생략

### 교육 플랫폼 Admin 풀스택 개발

- React Admin, react-query, react-table 프론트엔드 개발
- NestJS, TypeORM 백엔드 개발
- 유저나 쿠폰을 직관적인 테이블로 관리하며 비효율적인 업무 개선
- Email 전송 자동화 AWS Lambda 배포
- 텍스트로 된 1000개 이상의 수업자료를 직접 TTS AI에 입력해 Audio로 변환하던 단순 반복 작업 자동화

### 교육 플랫폼 모바일 앱 개발

- React Native(Expo), react-query, Justand 프론트엔드 개발
- Expo를 활용해 간단한 초기 세팅 등 생산성에 초점을 두고 개발
- Apple, google 등 oauth 및 자체 로그인 풀스택 개발
- Justand 상태관리
  - 이전 프로젝트에서 Recoil의 단점 경험 후, state와 action을 분리하는 상태 관리 선택

## **Projects**

### Drinkit 팀프로젝트 2023.08 ~ 2023.09 (5주)

주류 쇼핑몰 팀 프로젝트 ( 백엔드 4인 )

- [Github](https://github.com/jangdu/Develop-Drinkit)
- Skill : Nest.js, React, PostgreSQL, webRTC, Redis, RDS, Open AI

### **주요 구현 내용**

React활용 Frontend 구현

- SPA 관련 구현 경험 없는 백엔드 4인으로 구성된 팀원
  - 프론트엔드를 혼자 구현하는 것보다 효율적인 개발을 위해
    **팀원들에게 최소한의 React 문법 및 기능을 소개**해 협업 효율 증가
- ContexAPI 활용 전역 상태관리
  - 비교적 단순한 상태관리를 통해 팀원들의 지식 습득 리소스를 최소화해 개발

**WebRTC를 활용한 최대 4명이 실시간 소통가능한 화상채팅 구현**

- 피어들이 직접 미디어를 교환하는 **메쉬 방식으로 구현**
- 수용가능한 인원이 소수인 채팅방을 메쉬 방식으로 구현해 서버의 부담 최소화
- 테스트결과 10명까지는 클라이언트끼리 직접 미디어를 교환해도 브라우저의 무리가 발생하지 않아 선택

NestJS Backend 구현

- 기본적인 쇼핑몰의 CRUD
- 채팅방 목록을 **Redis를 활용 캐싱 후 응답 속도 개선(750ms → 340ms)**

Naver Cloud와 AWS를 활용한 멀티클라우드 환경 구성

- 프리티어와 크래딧을 사용하기 위해 여러 플랫폼을 사용하며 개발 및 서버 비용 절감
- 메인서버의 보안을 위한 https 및 트래픽 분산을 위한 로드밸런서를 적용한 뒤 약 10만 건 요청 시, **CPU 사용량이 약 50%, TPS 약 14% 개선**
- Route53의 A레코드 가중치 기반 라우팅 정책을 사용해서 DB부하 분산
- 스냅샷 방식으로 ReadReplica에 대한 동기화 진행, 평균 0.8초 동기화
- RDS Read Replica의 복제본을 승격시키는 방식을 사용해 재해상황에도 가용성을 확보할 수 있도록 구현
