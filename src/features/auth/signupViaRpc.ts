
import { supabase } from '@/lib/supabaseClient';
import type { SignUpFormValues } from '@/utils/sign';


export async function signupViaRpc(payload: SignUpFormValues) {

const { data: authData, error: signErr } = await supabase.auth.signUp({
email: payload.email,
password: payload.password,
});
if (signErr) throw signErr;


const { error } = await supabase.rpc('signup_with_profile', {
p_email: payload.email,
p_name: payload.name,
p_type: payload.type,
p_avatar_url: payload.avatar_url,
p_user_birth_year: payload.user_birth_year ? Number(payload.user_birth_year) : null,
p_user_comment: payload.user_comment ?? null,
p_animal: {
owner_nickname: payload.animals.owner_nickname,
name: payload.animals.name,
birth_year: payload.animals.birth_year,
type: payload.animals.type,
variety: payload.animals.variety,
color: payload.animals.color,
personality: payload.animals.personality,
level: payload.animals.level,
comment: payload.animals.comment,
img: payload.animals.img,
first: payload.animals.first,
},
p_certificates: payload.certificates ?? [],
});


if (error) throw error;
return true;
}