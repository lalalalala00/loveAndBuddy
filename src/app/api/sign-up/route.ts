import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const body = await req.json();
    const authHeader = req.headers.get('authorization') || '';
    const jwt = authHeader.replace(/^Bearer\s+/i, '');

    // 사용자의 세션(JWT)로 동작하는 클라이언트 → RLS에서 auth.uid()가 유저로 인식됨
    const client = createClient(supaUrl, anon, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // 현재 유저
    const { data: userRes, error: userErr } = await client.auth.getUser();
    if (userErr || !userRes.user) return NextResponse.json({ ok:false, error:'No session' }, { status:401 });
    const uid = userRes.user.id;

    // 1) users upsert
    const { error: uErr } = await client.from('users').upsert({
      id: uid,
      email: userRes.user.email,
      name: body.name,
      type: body.type,                // 'love' | 'buddy' | 'lovuddy'
      avatar_url: body.avatar_url ?? null,
    }, { onConflict: 'id' });
    if (uErr) return NextResponse.json({ ok:false, error: uErr.message }, { status:400 });

    // 2) animals (배열)
    const animals = Array.isArray(body.animals) ? body.animals : [];
    if (animals.length) {
      const rows = animals.map((a:any, i:number) => ({
        owner_uuid: uid,
        owner_nickname: body.name,
        name: a.name,
        birth_year: a.age ? (new Date().getFullYear() - Number(a.age)) : 2018, // age→birth_year 변환(임시)
        type: a.type,                           // 'dog'|'cat'|'others'
        variety: a.variety ?? '',
        color: a.color ?? '',
        personality: a.personality ?? 'introvert',
        level: String(a.level ?? '0'),
        comment: a.comment ?? '',
        img: a.img ?? '',
        first: !!a.owner || i === 0,
      }));
      const { error: aErr } = await client.from('animals').insert(rows);
      if (aErr) return NextResponse.json({ ok:false, error: aErr.message }, { status:400 });
    }

    // 3) certificates
    const certs = Array.isArray(body.certs) ? body.certs : [];
    if (certs.length) {
      const rows = certs.map((c:any) => ({
        user_uuid: uid,
        name: c.name,
        issuer: c.issuer,
        acquired_at: c.acquired_at,   // 'YYYY-MM-DD'
        url: c.url ?? null,
      }));
      const { error: cErr } = await client.from('certificates').insert(rows);
      if (cErr) return NextResponse.json({ ok:false, error: cErr.message }, { status:400 });
    }

    return NextResponse.json({ ok:true });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error: e?.message || 'unknown error' }, { status:500 });
  }
}
