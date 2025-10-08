import { supabase } from "@/lib/supabaseClient";
import { Certificate } from "@/utils/sign";


export type CardOverviewRow = {
  user_id: string;
  name: string;
  avatar_url: string | null;
  animal_type: string;
  type: 'love' | 'buddy' | 'lovuddy' | null; // 실제 enum/union에 맞게 조정
  user_birth_year: string | null;
  user_comment: string | null;
  card_kind: 'buddy' | 'love';
  manner: number;
  heart: number;
  dear_love: number;
  reliability: number | null;
  level: number | null;
  gender: 'female' | 'male' | 'other' | null;
  bookmarks_count: number;
  animals_count: number;
  certificates_count: number;
  bookings_this_week: number;
  certificates_preview: Certificate[]
};

export type CardDetailRow = {
  user_id: string;
  name: string;
  avatar_url: string | null;
  type: string | null;
  user_birth_year: string | null;
  user_comment: string | null;
  card_kind: 'buddy' | 'love';
  manner: number;
  heart: number;
  dear_love: number;
  reliability: number | null;
  level: number | null;
  gender: 'female' | 'male' | 'other' | null;
  bookmarks: Array<{ uuid: string; name: string; avatar_url: string | null; type: string | null }>;
  certificates: Array<{ id: string; user_id: string; name: string; issuer: string | null; acquired_at: string | null; url: string | null }>;
  animals: Array<{ id: string; owner_id: string; name: string; birth_year: string | null; type: 'dog'|'cat'|'others'; variety: string|null; color: string|null; comment: string|null; personality: string|null; image: string|null; level: number|null; created_at: string|null }>;
  bookings_this_week: Array<{ start_at?: string; date?: number; place: string|null; location: string|null }>; // 현재 뷰는 start_at 기반으로 내려줌
};
export async function fetchAllCardDetails(params?: {
  cardKind?: 'buddy' | 'love';
  limit?: number;         // default 30
  offset?: number;        // default 0
  orderBy?: 'reliability' | 'manner' | 'heart' | 'dear_love' | 'user_id';
  orderDir?: 'asc' | 'desc';
}) {
  const limit = params?.limit ?? 30;
  const offset = params?.offset ?? 0;

  let q = supabase
    .from('card_detail')
    .select('*', { count: 'exact' });

  if (params?.cardKind) q = q.eq('card_kind', params.cardKind);
  if (params?.orderBy)  q = q.order(params.orderBy, { ascending: params.orderDir === 'asc' });
  // 기본 정렬(없으면 신뢰도 내림차순 → user_id)
  if (!params?.orderBy) {
    q = q.order('reliability', { ascending: false }).order('user_id', { ascending: true });
  }

  // 페이지네이션
  q = q.range(offset, offset + limit - 1);

  const { data, error, count } = await q.returns<CardDetailRow[]>();
  if (error) throw error;

  return { data: data ?? [], count: count ?? null };
}


// utils/date.ts (이미 사용 중이신 buildDateLabel 외에 range 만약 필요 시)
export type Filters = {
  dateKey: 'none' | 'today' | 'tomorrow' | 'thisweek' | 'weekend' | 'custom';
  species: 'all' | 'dog' | 'cat' | 'others';
  genders: Array<'female' | 'male'>;
  sortKey: 'trust' | 'manner' | 'heart' | 'dearlove';
  sortDir: 'asc' | 'desc';
  // BuddyFilterBar에서만 로컬로 들고 있다면 아래 두 개는 생략 가능
  customFrom?: string;
  customTo?: string;
};

export function buildDateRange(
  key: Filters['dateKey'],
  customFrom?: string,
  customTo?: string
): { from: string | null; to: string | null } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const toISO = (d: Date) => d.toISOString();

  switch (key) {
    case 'none': return { from: null, to: null };
    case 'today': return { from: toISO(today), to: toISO(addDays(today, 1)) };
    case 'tomorrow': {
      const t = addDays(today, 1);
      return { from: toISO(t), to: toISO(addDays(t, 1)) };
    }
    case 'thisweek': {
      const dow = today.getDay(); // 0: 일
      const monday = addDays(today, -((dow + 6) % 7));
      return { from: toISO(monday), to: toISO(addDays(monday, 7)) };
    }
    case 'weekend': {
      const dow = today.getDay();
      const monday = addDays(today, -((dow + 6) % 7));
      const saturday = addDays(monday, 5);
      return { from: toISO(saturday), to: toISO(addDays(monday, 7)) };
    }
    case 'custom': {
      if (!customFrom || !customTo) return { from: null, to: null };
      const [y1, m1, d1] = customFrom.split('-').map(Number);
      const [y2, m2, d2] = customTo.split('-').map(Number);
      return {
        from: new Date(y1, m1 - 1, d1, 0, 0, 0).toISOString(),
        to: new Date(y2, m2 - 1, d2 + 1, 0, 0, 0).toISOString(),
      };
    }
    default: return { from: null, to: null };
  }
}
