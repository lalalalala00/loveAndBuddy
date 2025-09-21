// api/users.ts
import { supabase } from '@/lib/supabaseClient';

export type BuddyLite = {
    id: string;
    name?: string | null;
    avatar_url?: string | null;
    type?: string | null;
};

export async function getUserById(uid: string) {
    if (!uid) return null;
    const { data, error } = await supabase
        .from('users')
        .select('id, name, avatar_url, type')
        .eq('id', uid)
        .maybeSingle();
    if (error) throw error;
    return data as BuddyLite | null;
}
