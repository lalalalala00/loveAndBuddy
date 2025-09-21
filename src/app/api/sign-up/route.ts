// app/api/sign-up/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SRK = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const admin = createClient(URL, SRK, { auth: { autoRefreshToken: false, persistSession: false } });
const anon  = createClient(URL, ANON, { auth: { autoRefreshToken: false, persistSession: false } });

export async function POST(req: Request) {
  try {
    const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    if (!token) return NextResponse.json({ ok:false, error:'no token' }, { status:401 });

    const { data: gu, error: guErr } = await anon.auth.getUser(token);
    if (guErr || !gu?.user) return NextResponse.json({ ok:false, error: guErr?.message || 'invalid token' }, { status:401 });
    const uid = gu.user.id;

    const body = await req.json().catch(() => ({}));
    const {
      name, nickname, type, avatar_url,
      user_birth_year, user_comment,
      animals = [], certs = [],
    } = body ?? {};

    // 1) 프로필 업데이트
    const patch: any = {
      ...(typeof name === 'string' ? { name: name.trim() } : {}),
      ...(typeof nickname === 'string' ? { user_nickname: nickname.trim() } : {}),
      ...(typeof avatar_url === 'string' ? { avatar_url } : {}),
      ...(Number.isFinite(user_birth_year) ? { user_birth_year } : {}),
      ...(typeof user_comment === 'string' ? { user_comment } : {}),
      ...(type ? { type } : {}),
    };
    if (Object.keys(patch).length) {
      const { error } = await admin.from('users').update(patch).eq('id', uid);
      if (error) return NextResponse.json({ ok:false, error:error.message }, { status:400 });
    }

    // 2) 동물 upsert (owner_id = uid)
    if (Array.isArray(animals) && animals.length) {
      const upserts = animals.map((a:any, idx:number) => ({
        owner_uuid: uid,
        name: a.name ?? '',
        birth_year: a.birth_year ?? null,
        type: a.type ?? 'dog',
        variety: a.variety ?? null,
        color: a.color ?? null,
        personality: a.personality ?? 'introvert',
        level: String(a.level ?? '0'),
        comment: a.comment ?? null,
        img: a.img ?? null,
        first: typeof a.first === 'boolean' ? a.first : idx === 0,
      }));
      const { error } = await admin.from('animals').insert(upserts);
      if (error) return NextResponse.json({ ok:false, error:error.message }, { status:400 });
    }

    // 3) 자격증 upsert (user_id = uid)
    if (Array.isArray(certs) && certs.length) {
      const upserts = certs.map((c:any) => ({
        user_id: uid,
        name: c.name,
        issuer: c.issuer,
        acquired_at: c.acquired_at, // 'YYYY-MM-DD'
        url: c.url ?? null,
      }));
      const { error } = await admin.from('certificates').insert(upserts);
      if (error) return NextResponse.json({ ok:false, error:error.message }, { status:400 });
    }

    return NextResponse.json({ ok:true });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:e?.message || 'unexpected' }, { status:500 });
  }
}
