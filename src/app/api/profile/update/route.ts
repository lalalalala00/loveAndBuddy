export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SRK = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const admin = createClient(URL, SRK, { auth: { autoRefreshToken: false, persistSession: false } });
const anon  = createClient(URL, ANON, { auth: { autoRefreshToken: false, persistSession: false } });

// 라우트 살아있는지 빠르게 확인용
export async function GET() {
  return NextResponse.json({ ok: true, route: '/api/profile/update' });
}

export async function POST(req: Request) {
  try {
    const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    if (!token) return NextResponse.json({ ok: false, error: 'no token' }, { status: 401 });

    const { data: gu, error: guErr } = await anon.auth.getUser(token);
    if (guErr || !gu?.user) return NextResponse.json({ ok: false, error: guErr?.message || 'invalid token' }, { status: 401 });

    const uid = gu.user.id;
    const body = await req.json().catch(() => ({}));
    const { profile, animals, certificates } = body ?? {};

    // (1) 프로필 업데이트 — 지금은 이미지(아바타)만 처리해도 됨
    if (profile) {
      const patch: any = {};
      if (typeof profile.nickname === 'string') patch.user_nickname = profile.nickname.trim();
      if (typeof profile.avatar_url === 'string' && profile.avatar_url.length > 0) {
        patch.avatar_url = profile.avatar_url;
      }
      if (Object.keys(patch).length) {
        const { error } = await admin.from('users').update(patch).eq('id', uid);
        if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
      }
    }

    // (2)(선택) 동물/자격증 로직은 나중에 붙여도 OK

   if (certificates?.replace && Array.isArray(certificates.items)) {
      // 기존 목록
      const { data: oldList, error: oldErr } = await admin
        .from('certificates')
        .select('id')
        .eq('user_id', uid);
      if (oldErr) return NextResponse.json({ ok: false, error: oldErr.message }, { status: 400 });

const upserts = (certificates?.items ?? []).map((c: any) => {
  const row: any = {
    user_id: uid,                       // ★ 서버에서 강제
    name: c.name,
    issuer: c.issuer,
    acquired_at: c.acquired_at,
    url: c.url ?? null,
  };
  if (c.id) row.id = c.id;              // 기존 것만 id 포함
  return row;
});

      let newRows: any[] = [];
      if (upserts.length) {
        const { data, error } = await admin
          .from('certificates')
          .upsert(upserts)
          .select('id');
        if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
        newRows = data ?? [];
      } else {
        await admin.from('certificates').delete().eq('user_id', uid);
      }

      // 쓰지 않는 예전 행은 정리
      const keepIds = new Set(newRows.map(r => r.id));
      const delIds = (oldList ?? []).map(r => r.id).filter((id) => !keepIds.has(id));
      if (delIds.length) {
        const { error } = await admin.from('certificates').delete().in('id', delIds);
        if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'unexpected' }, { status: 500 });
  }
}
