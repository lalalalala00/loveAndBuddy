
import { supabase } from '@/lib/supabaseClient';
import type { Animal, Certificate } from '@/utils/sign';

export async function uploadAvatarAndGetUrl(userId: string, file?: File|null, fallback?: string|null) {
  if (!file) return fallback ?? null;
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${userId}/avatar.${ext}`;
  const { error } = await supabase.storage.from('avatars')
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw error;
  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return data.publicUrl ?? null;
}

export async function uploadAnimalImage(userId: string, key: string, file: File) {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${userId}/animals/${key}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from('avatars')
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw error;
  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return data.publicUrl ?? null;
}

export async function uploadCertFile(userId: string, file: File) {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
  const path = `${userId}/certs/${Date.now()}-${file.name.replace(/[^\w.\-]+/g, '_').slice(0,80)}`;
  const { error } = await supabase.storage.from('certificates')
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw error;
  const { data } = supabase.storage.from('certificates').getPublicUrl(path);
  return data.publicUrl ?? null;
}

export function buildAnimalsPayload(list: Animal[]) {
  let seenFirst = false;
  const items = (list ?? [])
    .filter(a => (a.name?.trim() || a.img))
    .map((a, idx) => {
      let first = (a as any).first ?? idx === 0;
      if (first) {
        if (seenFirst) first = false;
        else seenFirst = true;
      }
      const base: any = {
        name: a.name?.trim() ?? '',
        birth_year: a.birth_year ? Number(a.birth_year) : null,
        type: (a as any).type ?? (a as any).animal_type ?? 'dog',
        variety: a.variety ?? '',
        color: a.color ?? '',
        personality: (a as any).personality ?? 'introvert',
        level: Number((a as any).level ?? 0),
        comment: a.comment ?? '',
        img: a.img ?? '',
        first,
      };
      const uuid = (a as any).animal_uuid;
      if (uuid && /^[0-9a-f-]{36}$/i.test(uuid)) base.animal_uuid = uuid;
      return base;
    });

  if (!items.some(i => i.first) && items[0]) items[0].first = true;
  return items;
}

export function buildCertificatesPayload(certs: any[]) {
  return (certs ?? []).map((c: any) => {
    const item: any = {
      name: (c.name ?? '').trim(),
      issuer: (c.issuer ?? '').trim(),
      acquired_at: c.acquired_at || null,
      url: c.url ?? null,
    };
   if ((c as any).id) item.id = (c as any).id;
    return item;
  });
}

 


