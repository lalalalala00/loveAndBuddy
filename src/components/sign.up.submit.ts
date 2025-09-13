import { createClient } from '@supabase/supabase-js';
import type { SignUpFormValues } from '@/utils/sign';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function signUpWithProfile(payload: SignUpFormValues) {
  // 1) 회원가입 (이메일/비밀번호 기반)
  const { data: authData, error: signErr } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
  });
  if (signErr) throw signErr;

  const userId = authData.user?.id;
  if (!userId) throw new Error('유저 ID를 얻지 못했습니다.');

  // 2) users upsert (auth.users.id를 PK로 사용)
  const { error: userErr } = await supabase.from('users').upsert(
    {
      id: userId,
      email: payload.email,
      name: payload.name,
      type: payload.type,                // 'love' | 'buddy' | 'lovuddy'
      avatar_url: payload.avatar_url,
      user_birth_year: payload.user_birth_year ? Number(payload.user_birth_year) : null,
      user_comment: payload.user_comment ?? null,
    },
    { onConflict: 'id' }
  );
  if (userErr) throw userErr;

  // 3) animals insert (선생님 요구: uuid는 백엔드가 생성 → animal_uuid/owner_uuid는 프론트가 직접 채우지 않거나 최소한 owner_uuid만 userId로)
  const a = payload.animals;
  const { error: animalErr } = await supabase.from('animals').insert({
    owner_uuid: userId,
    owner_nickname: a.owner_nickname || payload.name, // 비워도 트리거가 users.name으로 채움
    name: a.name,
    birth_year: a.birth_year,
    type: a.type,                   // 'dog' | 'cat' | 'others'
    variety: a.variety,
    color: a.color,
    personality: a.personality,     // 'introvert' | 'extrovert'
    level: a.level,                 // 문자열 '0' 등
    comment: a.comment,
    img: a.img,
    first: !!a.first,
  });
  if (animalErr) throw animalErr;

  // 4) certificates batch insert (있을 때만)
  if (payload.certificates && payload.certificates.length > 0) {
    const rows = payload.certificates.map((c) => ({
      user_uuid: userId,
      name: c.name,
      issuer: c.issuer,
      acquired_at: c.acquired_at,  // 'YYYY-MM-DD'
      url: c.url ?? null,
    }));
    const { error: certErr } = await supabase.from('certificates').insert(rows);
    if (certErr) throw certErr;
  }

  return { userId };
}
