soom — Love & Buddy

사랑으로 반려동물을 돌보는 러브(love) 와 믿음직한 버디(buddy) 를 연결해 주는 웹 앱입니다.
Next.js 15 + React 19 + Tailwind CSS v4 + Supabase(Auth/Storage) 기반.

✨ 주요 기능

회원가입 & 로그인

이메일/비밀번호 로그인 (현재 테스트 편의를 위해 이메일 인증은 비활성화)

회원가입 후 자동 로그인 플로우

프로필 관리

프로필 이미지 업로드 (Supabase Storage)

닉네임/한마디 수정

역할(러브/버디/러버디) 기반 입력 폼

러브 전용

반려동물 등록(이름/출생연도/품종/성격/사진 등)

반려동물 사진 업로드 (Storage)

버디 전용

자격증 등록(명칭/발급처/취득일/URL)

홈 대시보드(드래그 앤 드롭)

react-grid-layout으로 위젯(캘린더, 커뮤니티, 버디 연결 등) 배치

로컬스토리지로 레이아웃/숨김 상태 영구 저장

게스트 모드

제한된 수정만 가능(예: 게스트 계정은 저장 차단 안내)

🧱 기술 스택

Framework: Next.js 15.3.x (App Router, Turbopack dev)

UI: React 19, Tailwind CSS v4 (@tailwindcss/postcss)

State: React Context (Auth / UserState)

Auth/DB/Storage: Supabase JS v2

Drag & Drop: react-grid-layout, react-resizable

Depoyment: Vercel

Domain: withsoom.app (Vercel 연결)

📁 주요 디렉터리
src/
app/
providers/AuthProvider.tsx # Supabase 세션 구독 + Router refresh
globals.css # Tailwind v4 + 커스텀 유틸/클래스
components/
home/index.tsx # GridLayout 대시보드(로컬스토리지 저장)
home/calendar.tsx # 캘린더 위젯
sign.login.tsx # 로그인 모달
sign.up.tsx # 회원가입 모달(+업로드/가입 요청)
setting.modal.tsx # 프로필/동물/자격증 수정
context/
useUserContext.tsx # 유저/동물/자격증/토스트 컨텍스트
lib/
supabaseClient.ts # Supabase 초기화
profile.upload.ts # Storage 업로드 유틸
utils/
sign.ts, date.ts # 타입/상수/포맷터

⚙️ 환경변수

.env.local 예시:

# Supabase

NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...

🚀 실행

# 1) 패키지 설치

npm install

# 2) 개발 서버

npm run dev

# http://localhost:3000

빌드/배포:

npm run build
npm start

Tailwind v4 & Turbopack 주의

🗂️ 스타일(CSS)

Tailwind v4 유틸 + 프로젝트 공통 유틸 클래스

커스텀 유틸 예)

.custom-card, .shadow-inset, .no-scrollbar, .animate-blink 등

Turbopack에서 PostCSS 설정이 없으면 에러가 날 수 있으니 위 PostCSS 설정을 반드시 추가.

🔐 인증 & 세션

AuthProvider가 클라이언트에서 초기 세션 로드 + onAuthStateChange 구독 후 router.refresh()로 화면 동기화.

회원가입 흐름:

/api/dev-create-user (테스트용)로 계정 발급

supabase.auth.signInWithPassword로 즉시 로그인

Storage 업로드(프로필/동물)

/api/sign-up로 프로필 + 동물/자격증 저장

성공 토스트 → 모달 닫기

게스트 계정은 저장 제한 안내 모달을 띄우며 실제 업데이트는 막습니다.

💾 대시보드 레이아웃 저장

react-grid-layout 사용

레이아웃과 숨김 상태를 localStorage에 저장/복원:

rgl:home:layout

rgl:home:hidden

안전 병합(ensureLayout)으로 잘못된/누락 항목 복원

🌐 배포(Vercel) & 도메인

Vercel에 프로젝트 연결 → 도메인 추가

가비아 DNS에서 다음 레코드 추가

A @ → 216.198.79.1

CNAME www → cname.vercel-dns.com. ← 가비아는 끝에 점 필요

(서브도메인) CNAME dev → cname.vercel-dns.com.

Vercel Domains에서 Primary를 withsoom.app로 지정하고 www → apex 리다이렉트 옵션 권장

.app TLD는 HTTPS 강제(HSTS) — SSL은 Vercel이 자동 발급

🧩 자주 겪는 이슈 & 팁

PostCSS config is undefined
→ postcss.config.mjs에서 export default { plugins: ['@tailwindcss/postcss'] } 필요

@tailwindcss/oxide native binding 에러 (Vercel 빌드)
→ Tailwind v4 + PostCSS 설정 확인, 루트 globals.css에서 @import 'tailwindcss'; 유지

Hydration mismatch
→ window/Date.now() 등 클라 전용 값은 useEffect로 분기. SSR 시 레이아웃 좌표/크기 등 클라에서만 계산하도록 조정

react-grid-layout 스타일
→ Turbopack + CSS import 시 PostCSS 경고가 나면 위 PostCSS 설정 적용

자동 로그인 후 화면 반영
→ AuthProvider에서 onAuthStateChange 시 router.refresh() 호출

## ✅ 향후 로드맵

- 이메일 인증 플로우 복구 / Magic Link
    - Supabase 이메일 인증 재활성화, Magic Link 로그인 도입, 인증 상태 UI/문구 정교화

- 디얼러브 Post / 러브 카드 Post / 버디 카드 Post
    - 작성 폼 → 서버 POST 연동, 이미지 업로드 분리(Storage→URL), 스키마 검증(Zod), 에러/토스트 표준화

- 예약/결제 흐름(CTA: 산책 종료 후 재예약 유도)
    - 예약 생성·변경·취소 플로우, 결제(정액/정기권) 도입, 산책 종료 직후 동일 버디 재예약 CTA

- 평판/리뷰(RLS) & 온보딩
    - 매칭 후 상호 리뷰·신뢰도 점수, 신고/분쟁 대응, 역할별 온보딩/교육 이수 표시

- UGC·커뮤니티 추가
    - 게시/댓글/신고, 태그/검색/정렬, 작성 가이드라인 및 배지/레벨 등 기여 보상
