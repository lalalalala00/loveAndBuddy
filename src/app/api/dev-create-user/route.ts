// // app/api/dev-create-user/route.ts
// export const runtime = 'nodejs';

// import { NextResponse } from 'next/server';
// import { createClient } from '@supabase/supabase-js';

// const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
//   auth: { autoRefreshToken: false, persistSession: false },
// });

// export async function POST(req: Request) {
//   try {
//     if (!SUPABASE_URL || !SERVICE_ROLE) {
//       return NextResponse.json(
//         { ok: false, error: 'Missing env: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY' },
//         { status: 500 },
//       );
//     }

//     const body = await req.json().catch(() => ({}));
//     const email = String(body?.email || '').trim();
//     const password = String(body?.password || '');

//     if (!email || !password) {
//       return NextResponse.json({ ok: false, error: 'email/password required' }, { status: 400 });
//     }
//     if (password.length < 6) {
//       return NextResponse.json({ ok: false, error: 'password must be at least 6 characters' }, { status: 400 });
//     }

//     // 1) Auth 사용자 생성 (이 단계에서 트리거가 없으니 안정적)
//     const { data, error } = await admin.auth.admin.createUser({
//       email,
//       password,
//       email_confirm: true, // 이메일 인증 없이 활성화
//     });
//     if (error) {
//       // Supabase가 던지는 "Database error creating new user"도 여기로 옵니다.
//       return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
//     }
//     const authId = data.user?.id;
//     if (!authId) {
//       return NextResponse.json({ ok: false, error: 'missing auth user id' }, { status: 500 });
//     }

//     // 2) public.users에 직접 한 줄 생성 (SERVICE_ROLE 사용 → RLS 무시)
//     //    최소 필드만 넣고, 나머지는 기본값에 맡깁니다.
//     const { error: upErr } = await admin
//       .from('users')
//       .upsert(
//         { id: authId, email, type: 'love' }, // 기본 role은 필요시 바꾸세요
//         { onConflict: 'id' },
//       );

//     if (upErr) {
//       // Auth는 생성됐으니 200은 유지하고, 경고만 반환(원하시면 207/500으로 바꿔도 됩니다)
//       return NextResponse.json(
//         { ok: true, id: authId, warn: `user created in auth, but profile insert failed: ${upErr.message}` },
//         { status: 200 },
//       );
//     }

   
   
//        return NextResponse.json({ ok: true });
//   } catch (e: any) {
//     return NextResponse.json({ ok: false, error: e?.message || 'unexpected error' }, { status: 500 });
//   }
// }

// app/api/dev-create-user/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SRK = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const admin = createClient(URL, SRK, { auth: { autoRefreshToken: false, persistSession: false } });

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body?.email || '').trim();
    const password = String(body?.password || '');
    if (!email || !password) return NextResponse.json({ ok:false, error:'email/password required' }, { status:400 });
    if (password.length < 6) return NextResponse.json({ ok:false, error:'password must be at least 6 characters' }, { status:400 });

    const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
    if (error) return NextResponse.json({ ok:false, error:error.message }, { status:400 });

    const authId = data.user?.id!;
    // users 최소행 (나머지는 /api/sign-up에서 채움)
    const { error: upErr } = await admin.from('users').upsert({ id: authId, email, type: 'love' }, { onConflict: 'id' });
    if (upErr) return NextResponse.json({ ok:true, id:authId, warn:`profile upsert failed: ${upErr.message}` });

    return NextResponse.json({ ok:true, id:authId });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:e?.message || 'unexpected' }, { status:500 });
  }
}
