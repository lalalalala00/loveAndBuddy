import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ ok:false, error:'email/password required' }, { status:400 });
    if (password.length < 6) return NextResponse.json({ ok:false, error:'Password should be at least 6 characters' }, { status:400 });

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const admin = createClient(url, serviceKey, { auth:{ autoRefreshToken:false, persistSession:false } });

    // 이미 있으면 통과 처리(테스트 편의)
    const list = await admin.auth.admin.listUsers({ page:1, perPage:100 });
    const existed = list.data?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase());
    if (existed) return NextResponse.json({ ok:true, userId: existed.id, note:'existing_user' });

    const { data, error } = await admin.auth.admin.createUser({
      email, password, email_confirm: true, app_metadata:{ provider:'email' as const }
    });
    if (error) return NextResponse.json({ ok:false, error: error.message }, { status:400 });

    return NextResponse.json({ ok:true, userId: data.user.id });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error: e?.message || 'unknown error' }, { status:500 });
  }
}
