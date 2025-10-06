
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

    const { error: upErr } = await admin.from('users').upsert({ id: authId, email, type: 'love' }, { onConflict: 'id' });
    if (upErr) return NextResponse.json({ ok:true, id:authId, warn:`profile upsert failed: ${upErr.message}` });

    return NextResponse.json({ ok:true, id:authId });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:e?.message || 'unexpected' }, { status:500 });
  }
}
