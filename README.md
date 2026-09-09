# 신다솔 포트폴리오

[🌐 포트폴리오 바로가기](https://my-portfolio-ivory-alpha-91.vercel.app/)

개발 경험과 기술 스택, 프로젝트를 소개하고 개발 과정에서 만난 문제와 해결 방법을 기록하는 개인 포트폴리오 웹사이트입니다.

홈은 한 페이지 안에서 소개, 경험, 기술, 프로젝트, 연락처를 확인할 수 있도록 구성했습니다. Archive에서는 문제 해결 기록과 답변을 작성하고 관리할 수 있습니다.

## 주요 기능

### 포트폴리오

- About, Experience, Skills, Projects, Contact 섹션 구성
- 프로젝트 기간, 역할, 주요 구현 내용, 기술 스택과 GitHub 링크 제공
- 스크롤 위치에 따라 현재 섹션의 메뉴를 활성화
- 모바일에서 활성 메뉴가 보이도록 메뉴 위치를 자동 조정
- 화면 크기에 따른 반응형 레이아웃 제공
- 상단 이동 및 GitHub·이메일 바로가기 제공

### Archive

- 문제 해결 기록 목록 조회 및 해결 여부 필터링
- 기록 작성, 상세 조회, 수정, 삭제
- 해결·미해결 상태 변경
- 기록별 답변 작성, 조회, 수정, 삭제
- 글과 답변에 코드 언어 및 코드 첨부
- 코드 복사 기능
- 관리자 작업 전 Supabase Auth 비밀번호 확인
- React Query를 이용한 로딩, 오류, 캐시 및 서버 데이터 동기화

## 화면 경로

| 경로 | 화면 | 기능 |
| --- | --- | --- |
| `/` | 포트폴리오 홈 | 소개, 경험, 기술, 프로젝트, 연락처 확인 |
| `/archive` | Archive 목록 | 기록 조회 및 해결 여부 필터링 |
| `/archive/new` | 기록 작성 | 새로운 문제 해결 기록 작성 |
| `/archive/:id` | 기록 상세 | 본문, 코드, 답변 확인 및 관리 |
| `/archive/:id/edit` | 기록 수정 | 기존 기록 수정 |

## 기술 스택

| 구분 | 기술 |
| --- | --- |
| Frontend | React, TypeScript, CSS Modules |
| Routing | React Router |
| Server State | TanStack React Query |
| Backend · Database | Supabase Database, Supabase Auth |
| Build | Vite |
| Code Quality | TypeScript, Oxlint |
| Deployment | Vercel |

## 주요 구현 내용

### 컴포넌트 분리

공통 UI인 Header, Navigation, Footer, TopButton, ContactButton을 재사용할 수 있도록 분리했습니다. Home 화면도 각 섹션을 독립된 컴포넌트로 구성했습니다.

기능이 많은 Archive 상세 화면은 페이지가 데이터와 이벤트를 관리하고, 화면은 다음 컴포넌트가 담당하도록 나눴습니다.

- `ArchiveRecordCard`: 기록 본문과 상태 및 관리 버튼
- `ReplySection`: 답변 목록과 작성 폼
- `CodeViewer`: 글과 답변에서 재사용하는 코드 표시 및 복사 UI
- `StatusDialog`: 해결 상태 변경 확인창
- `DeleteDialog`: 글과 답변 삭제 확인창
- `ReplyEditDialog`: 답변 수정 확인창

### 상태와 이벤트 처리

- `useState`로 폼 입력값과 확인창 상태 관리
- `useEffect`로 스크롤 및 화면 크기 변경 이벤트 연결과 정리
- `useRef`로 모바일 메뉴 DOM에 접근하여 활성 메뉴를 화면 중앙으로 이동
- `map`, 조건부 렌더링, Props를 사용해 반복 UI와 상태별 화면 구성
- Custom Hook인 `useActiveSection`, `useScrollTo`로 스크롤 관련 로직 분리

### 라우팅

React Router의 `Routes`, `Route`, `Link`, `useParams`, `useNavigate`, `useLocation`을 사용했습니다. Archive의 목록, 작성, 상세, 수정 화면을 주소로 구분하고 페이지 이동 시 스크롤 위치도 조정했습니다.

### 서버 상태 관리

Supabase 요청 함수와 데이터 타입은 `src/api/archive.ts`에 모았습니다. 화면에서는 React Query의 `useQuery`, `useMutation`, `QueryClient`를 사용해 다음 상태를 관리합니다.

- 목록, 상세 기록 및 답변 조회 결과 캐시
- 요청 중 로딩 상태와 오류 상태 표시
- 작성·수정 성공 후 캐시 갱신
- 삭제 후 관련 캐시 제거 또는 다시 조회

## 프로젝트 구조

```text
src/
├─ api/                    # Archive 데이터 요청 함수와 타입
├─ assets/                 # 프로필 이미지와 기술 아이콘
├─ components/common/      # 공통 Header, Navigation, Footer, 버튼
├─ data/                   # 경험, 기술, 프로젝트 데이터
├─ hooks/                  # 스크롤 관련 Custom Hook
├─ lib/                    # Supabase 클라이언트
├─ pages/
│  ├─ Archive/             # Archive 목록, 작성, 상세, 수정
│  │  └─ components/       # 상세 화면의 기록, 답변, 확인창 컴포넌트
│  └─ Home/sections/       # About, Experience, Skills, Projects, Contact
├─ styles/                 # 공통 CSS 변수
├─ App.tsx                 # 라우트 구성
└─ main.tsx                # React 및 QueryClient 진입점
```

## 실행 방법

### 1. 저장소 복제 및 패키지 설치

```bash
git clone https://github.com/AutoEver-Mobility-WebApp-DevCamp-4th/project-1-dasolsee.git
cd project-1-dasolsee
npm install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 만들고 Supabase 프로젝트 정보를 입력합니다.

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
VITE_ARCHIVE_ADMIN_EMAIL=your_admin_email
```

`.env` 파일은 Git에 포함되지 않습니다. Archive의 관리자 기능을 사용하려면 `VITE_ARCHIVE_ADMIN_EMAIL`에 해당하는 Supabase Auth 사용자가 필요합니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

## 명령어

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | TypeScript 검사 후 배포용 빌드 생성 |
| `npm run lint` | Oxlint 정적 검사 실행 |
| `npm run preview` | 빌드 결과 미리보기 |

## 데이터베이스 관련 파일

`supabase/` 폴더에는 Archive 기능을 확장하면서 사용한 SQL 파일이 있습니다.

- `archive-delete-policies.sql`: 로그인한 관리자의 글·답변 삭제 정책
- `archive-reply-code.sql`: 답변의 코드 언어와 코드 컬럼 추가
- `archive-reply-update-policy.sql`: 로그인한 관리자의 답변 수정 정책

## 반응형 확인

데스크톱과 모바일 레이아웃을 지원하며, 375px 너비에서 가로 페이지 넘침과 메뉴 동작을 확인했습니다.

## 개발자

- 신다솔
- GitHub: [github.com/dasolsee](https://github.com/dasolsee)
- Email: [dasol_2@naver.com](mailto:dasol_2@naver.com)
