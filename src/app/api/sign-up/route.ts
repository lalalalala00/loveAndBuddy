
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

type Role = 'love' | 'buddy' | 'lovuddy';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization') ?? '';
    if (!authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }


    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: { headers: { Authorization: authHeader } },
        auth: { persistSession: false },
      }
    );

    const { data: userRes, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userRes?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = userRes.user;


    const body = await req.json();
    const {
      name,
      type,
      certificate_url = null,
      animals = [],
      certs = [],
    }: {
      name: string;
      type: Role;
      certificate_url?: string | null;
      animals?: Array<any>;
      certs?: Array<any>;
    } = body;

    if (!name || !type) {
      return NextResponse.json({ error: 'name/type이 필요합니다.' }, { status: 400 });
    }

    const { error: uerr } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        name,
        type,
        certificate_url,
      })
      .select('id')
      .single();

    if (uerr) {
      return NextResponse.json({ error: uerr.message }, { status: 400 });
    }

    if (Array.isArray(animals) && animals.length > 0) {
      const animalPayloads = animals.map((f: any, idx: number) => ({
        owner_id: user.id,
        owner_nickname: name,
        name: f.name ?? '',
        birth_year: f.age ? Number(f.age) : null,
        level: Math.min(10, Math.max(1, Number(f.level ?? 5))),
        type: f.type ?? 'dog', // 'dog' | 'cat' | 'other'
        variety: f.variety ?? '',
        color: f.color ?? '',
        comment: f.comment ?? '',
        is_primary: idx === 0, 
        img: f.img ?? '',
        personality: f.personality ?? 'extrovert', // 'extrovert' | 'introvert' | 'neutral'
      }));

      const { error: aerr } = await supabase.from('animals').insert(animalPayloads);
      if (aerr) {
        return NextResponse.json({ error: aerr.message }, { status: 400 });
      }
    }


    if (Array.isArray(certs) && certs.length > 0) {
      const certPayloads = certs.map((c: any) => ({
        user_id: user.id,
        title: c.title ?? c.name ?? '자격증',
        issuer: c.issuer ?? null,
        issued_at: c.issuedAt ?? c.issued_at ?? null,
        expires_at: c.expiresAt ?? c.expires_at ?? null,
        url: c.url ?? null,
        file_path: c.filePath ?? c.file_path ?? null,
        status: 'pending',
      }));

      const { error: cerr } = await supabase.from('certificates').insert(certPayloads);
      if (cerr) {
        return NextResponse.json({ error: cerr.message }, { status: 400 });
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? '알 수 없는 오류' },
      { status: 500 }
    );
  }
}
