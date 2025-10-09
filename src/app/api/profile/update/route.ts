export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import { Animal } from '@/utils/sign';

const URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SRK  = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;



const admin = createClient(URL, SRK,  { auth: { autoRefreshToken: false, persistSession: false } });
const anon  = createClient(URL, ANON, { auth: { autoRefreshToken: false, persistSession: false } });



const OWNER_COL = 'owner_uuid' as const;
const KEY_COL   = 'animal_uuid' as const;


const isUuid = (v: any) =>
  typeof v === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);

const clampNum = (n: any, lo = 0, hi = 10) => {
  const x = Number(n);
  return Number.isFinite(x) ? Math.max(lo, Math.min(hi, x)) : lo;
};

export async function GET() {
  return NextResponse.json({ ok: true, route: '/api/profile/update' });
}

export async function POST(req: Request) {
  try {

    const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    if (!token) return NextResponse.json({ ok: false, error: 'no token' }, { status: 401 });

    const { data: gu, error: guErr } = await anon.auth.getUser(token);
    if (guErr || !gu?.user) {
      return NextResponse.json({ ok: false, error: guErr?.message || 'invalid token' }, { status: 401 });
    }
    const uid = gu.user.id;


    const body = await req.json().catch(() => ({}));
    const { profile, animals, certificates } = body ?? {};


    if (profile) {
      const patch: Record<string, any> = {};
      if (typeof profile.name === 'string')      patch.name = profile.name.trim();
      if (typeof profile.nickname === 'string')  patch.user_nickname = profile.nickname.trim();
      if (typeof profile.avatar_url === 'string' && profile.avatar_url.length > 0) {
        patch.avatar_url = profile.avatar_url;
      }
      if(typeof profile.user_comment === 'string') patch.user_comment = profile.user_comment.trim()
      if (Object.keys(patch).length) {
        const { error } = await admin.from('users').update(patch).eq('id', uid);
        if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
      }
    }


    if (animals?.replace && Array.isArray(animals.items)) {
       const { data: oldList, error: oldErr } = await admin
        .from('animals')
        .select<typeof KEY_COL>(KEY_COL)     
        .eq(OWNER_COL, uid)                   
        .returns<Array<Pick<Animal, typeof KEY_COL>>>(); 

      if (oldErr) return NextResponse.json({ ok: false, error: oldErr.message }, { status: 400 });

      let rows = (animals.items as any[])
        .filter((a) => (a?.name && String(a.name).trim()) || a?.img) 
        .map((a: any, idx: number) => {
          // PK: 유효한 uuid면 유지, 아니면 신규 uuid 발급 (NOT NULL 방지)
          const pk = isUuid(a[KEY_COL]) ? a[KEY_COL] : randomUUID();

          return {
            [KEY_COL]: pk,
            [OWNER_COL]: uid,                           
            name: (a.name ?? '').trim(),
            birth_year: a.birth_year ?? null,
            type: (a.type ?? 'dog').trim(),
            variety: (a.variety ?? '').trim(),
            color: (a.color ?? '').trim(),
            personality: (a.personality ?? 'introvert').trim(),
            level: clampNum(a.level, 0, 10),            // 0~10 보정
            comment: (a.comment ?? '').trim(),
            img: a.img ?? '',
            first: !!(a.first ?? (idx === 0)),          // 우선 표기
            owner_nickname: profile.name,

      
          };
        });

      // 대표(first) 보정: 최소 1마리, 중복 금지
      const firstCount = rows.filter(r => r.first).length;
      if (firstCount === 0 && rows.length) {
        rows[0].first = true;
      } else if (firstCount > 1) {
        let kept = false;
        rows = rows.map(r => (r.first && !kept ? (kept = true, r) : { ...r, first: false }));
      }

      // upsert (PK 기준)
      const keepIds = new Set(rows.map(r => r[KEY_COL] as string)); 
      const { data: upserted, error: upErr } = await admin
        .from('animals')
        .upsert(rows, { onConflict: KEY_COL })
        .select(KEY_COL);
      if (upErr) return NextResponse.json({ ok: false, error: upErr.message }, { status: 400 });

      // replace: 전달되지 않은 예전 행 삭제 (내 소유 건만)
      const oldIds = (oldList ?? []).map(r => r[KEY_COL] as string);
      const toDelete = oldIds.filter(id => !keepIds.has(id));
         if (toDelete.length) {
        const { error } = await admin
          .from('animals')
          .delete()
          .in(KEY_COL, toDelete)
          .eq(OWNER_COL, uid);
        if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
      }
    }

    if (certificates?.replace && Array.isArray(certificates.items)) {
      const { data: oldList, error: oldErr } = await admin
        .from('certificates')
        .select('id')
        .eq('user_id', uid);
      if (oldErr) return NextResponse.json({ ok: false, error: oldErr.message }, { status: 400 });

      const upserts = (certificates.items ?? []).map((c: any) => {
        const row: any = {
          user_id: uid,
          name: (c.name ?? '').trim(),
          issuer: (c.issuer ?? '').trim(),
          acquired_at: c.acquired_at ?? null,
          url: c.url ?? null,
        };
        if (c.id) row.id = c.id;
        return row;
      });

      let newRows: any[] = [];
      if (upserts.length) {
        const { data, error } = await admin.from('certificates').upsert(upserts, { onConflict: 'id' }).select('id');
        if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
        newRows = data ?? [];
      } else {
        await admin.from('certificates').delete().eq('user_id', uid);
      }

      const keepIds = new Set(newRows.map(r => r.id));
      const delIds  = (oldList ?? []).map(r => r.id).filter((id) => !keepIds.has(id));
      if (delIds.length) {
        const { error } = await admin.from('certificates').delete().in('id', delIds);
        if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    // 서버 예외
    return NextResponse.json({ ok: false, error: e?.message || 'unexpected' }, { status: 500 });
  }
}
