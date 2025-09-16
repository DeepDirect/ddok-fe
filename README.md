# 📖 똑DDOK — 당신 곁의 동료, 딸깍!

> 지도 기반 프로젝트·스터디 매칭 & 팀 협업 플랫폼 

<br />

지도 기반으로 스터디/프로젝트를 빠르게 찾고 참여하고, 팀 협업(채팅·일정·알림)까지 한 곳에서 처리하는 플랫폼입니다.   

프로젝트 기간: 2025.08 ~ 2025.09 (기획 및 개발)   
시연영상 [YouTube](https://www.youtube.com/watch?v=lYVMEXc4BAU)   
Link: [DDOK](http://www.deepdirect.site)
Code: [FE](https://github.com/DeepDirect/ddok-fe), [BE](https://github.com/DeepDirect/ddok-be)   

---

## 🫶 팀원
| 이름      | 역할                 | GitHub 링크                                     |
|----------|--------------------|------------------------------------------------|
| 정원용     | 팀장, Full Stack, Infra    | [@projectmiluju](https://github.com/projectmiluju) |
| 권혜진     | Backend            | [@sunsetkk](https://github.com/sunsetkk)       |
| 박건      | Frontend            | [@Jammanb0](https://github.com/Jammanb0)       |
| 박소현     | Frontend           | [@ssoogit](https://github.com/ssoogit)         |
| 박재경     | Full Stack  | [@Shin-Yu-1](https://github.com/Shin-Yu-1) |
| 이은지     | Frontend           | [@ebbll](https://github.com/ebbll)             |
| 최범근     | Backend            | [@vayaconChoi](https://github.com/vayaconChoi) |

<br />

---

## ✨ 주요 기능

- 지도 기반 탐색: 카카오맵에서 주변 스터디/프로젝트/플레이어를 한눈에 확인 (상태/카테고리 필터)
- 포지션 매칭: 역할/경험/시간대 기반 맞춤 필터와 추천
- 원클릭 참여: 오픈톡/댓글 없이 클릭 한 번으로 신청/취소
- 팀 협업: 팀 생성 시 자동 채팅방, 일정 조율(캘린더), 팀 ReadMe
- 신뢰도 시스템: 온도(완주율/기여도), 배지/랭킹으로 책임감과 지속 참여 유도

<br/>

## 🖼️ 스크린샷

<br/>

## 🛠️ 기술 스택 (Frontend)

| 분류                | 기술명                                                                                 |
|-------------------|--------------------------------------------------------------------------------------|
| **프레임워크/언어**    | React, TypeScript, Vite, PNPM                                                      |
| **라우팅**           | TanStack Router, React Router                                                       |
| **상태 관리**         | Zustand (전역 상태), TanStack React Query (서버 상태)                              |
| **폼/유효성 검사**     | React Hook Form, Zod, @hookform/resolvers                                          |
| **스타일**           | SCSS Modules, SCSS, clsx                                                           |
| **UI 라이브러리**      | Radix UI, Sonner (토스트), react-spinners (로딩)                                   |
| **아이콘**           | Phosphor Icons                                                                      |
| **마크다운**          | uiw/react-md-editor                                                                |
| **네트워크 요청**      | axios                                                                              |
| **실시간 통신**       | @stomp/stompjs (STOMP WebSocket 클라이언트)                                         |
| **지도**             | Kakao Maps JavaScript API, react-kakao-maps-sdk                                     |
| **날짜/시간 처리**     | dayjs, date-fns                                                                    |
| **테이블**           | TanStack Table                                                                     |
| **캘린더**           | react-datepicker, FullCalendar                                                     |
| **차트/시각화**       | (선택) Recharts / Chart.js                                                         |
| **코드 품질/자동화**    | ESLint, Prettier, Stylelint, Husky, lint-staged                                   |
| **번들/배포**         | AWS S3, CloudFront                                                                 |
| **기타**             | react-dnd (드래그앤드롭), Kakao OAuth                                               |


<br />

---

## 📁 디렉토리 구조

```bash
src/
├── api/         # API 호출 함수 (axios 등)
├── assets/      # 이미지, 폰트 등 정적 리소스
├── components/  # 공통 UI 컴포넌트
├── constants/   # 상수 값 정의
├── features/    # 기능 단위 모듈 (채팅, 프로젝트 등)
├── hooks/       # 공통 커스텀 훅
├── layouts/     # 공통 페이지 레이아웃
├── mocks/       # 목(Mock) 데이터
├── pages/       # 페이지 컴포넌트
├── router/      # 라우팅 설정
├── schemas/     # 요청/응답 타입 및 Zod 스키마
├── stores/      # Zustand 전역 상태 관리
├── styles/      # 글로벌 스타일, 디자인 토큰
├── types/       # 전역 TypeScript 타입 정의
└── utils/       # 공용 유틸리티 함수
```

<br />

---

## 🏃‍➡️ 설치 및 실행
```bash
# 패키지 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 빌드
pnpm build
```
