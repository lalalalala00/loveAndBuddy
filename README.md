soom — Love & Buddy

러브(love)(보호자)와 버디(buddy)(펫시터)를 연결하는 웹 앱.
Next.js 15 · React 19 · Tailwind CSS v4 · Supabase(Auth/Storage).

✨ 주요 기능

회원가입/로그인: 이메일·비밀번호(테스트용으로 이메일 인증 비활성화), 가입 직후 자동 로그인

프로필 관리: 닉네임·한마디 수정, 프로필 이미지 업로드(Supabase Storage)

러브 전용: 반려동물 등록(이름/출생연/품종/성격/사진)

버디 전용: 자격증 등록(명칭/발급처/취득일/URL)

홈 대시보드: react-grid-layout으로 위젯 배치, localStorage에 레이아웃/숨김 상태 영구 저장

게스트 모드: 수정 제한(안내 토스트 표시)

🧱 기술 스택

Framework: Next.js 15 (App Router, Turbopack)

UI: React 19, Tailwind CSS v4 (@tailwindcss/postcss)

State: React Context (Auth / UserState)

Auth/Storage: Supabase JS v2

DnD/Grid: react-grid-layout, react-resizable

Deploy: Vercel · Domain: withsoom.app

`📁 구조
src/
  app/
    providers/AuthProvider.tsx   # Supabase 세션 구독 + router.refresh
    globals.css                  # Tailwind v4 + 공통 유틸
  components/
    home/index.tsx               # 대시보드(RGL) + 로컬 저장
    home/calendar.tsx            # 캘린더 위젯
    sign.login.tsx               # 로그인 모달
    sign.up.tsx                  # 회원가입 모달
    setting.modal.tsx            # 프로필/동물/자격증 수정
  context/
  useUserContext.tsx             # 유저/동물/자격증/토스트 컨텍스트
  lib/
    supabaseClient.ts            # Supabase 초기화
    profile.upload.ts            # Storage 업로드 유틸
  utils/sign.ts, utils/date.ts   # 타입/상수/포맷터
`
⚙️ 환경변수 (.env.local)

# Supabase

NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...

🚀 실행
npm install
npm run dev

# 배포 빌드

npm run build
npm start

🌐 배포 & 도메인(요약)

Vercel → Project → Settings → Domains

withsoom.app, www.withsoom.app, dev.withsoom.app

가비아 DNS

A @ → 216.198.79.1

CNAME www → cname.vercel-dns.com.

CNAME dev → cname.vercel-dns.com.

Vercel에서 Primary를 withsoom.app로, www → apex 리다이렉트 권장

.app은 HTTPS(HSTS) 강제 → SSL은 Vercel이 자동 발급

🔐 인증 & 세션 처리

AuthProvider가 초기 세션 로드 + onAuthStateChange 구독

인증 이벤트 시 router.refresh()로 UI 동기화

회원가입 플로우: 테스트용 /api/dev-create-user → signInWithPassword → Storage 업로드 → /api/sign-up

🧩 트러블슈팅(핵심만)

PostCSS 설정 필요: 루트에 postcss.config.mjs

// postcss.config.mjs
export default { plugins: ['@tailwindcss/postcss'] };

Tailwind v4: src/app/globals.css 상단에 @import 'tailwindcss';

Hydration mismatch: 브라우저 의존 값(window, Date.now(), 레이아웃 계산)은 useEffect에서 처리

RGL 스타일: 필요 시

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

✅ 향후 로드맵

이메일 인증 플로우 복구 / Magic Link

디얼러브 Post / 러브 카드 Post / 버디 카드 Post

모바일 UI/UX 최적화

예약/결제 흐름(CTA: 산책 종료 후 재예약 유도)

평판/리뷰(RLS) & 온보딩

UGC·커뮤니티 추가
