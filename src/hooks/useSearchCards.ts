
import { useEffect, useState } from 'react';
import type { Filters } from '@/utils/date';
import { buildDateRange } from '@/app/find/_components/data/cards';
import { supabase } from '@/lib/supabaseClient';


export type SearchCardRow = {
  user_id: string;
  name: string;
  avatar_url: string | null;
  type: string | null;
  user_birth_year: string | null;
  user_comment: string | null;
  card_kind: 'buddy'|'love';
  manner: number;
  heart: number;
  dear_love: number;
  reliability: number | null;
  level: number | null;
  gender: 'female'|'male'|'other'|null;
  species_types?: string[]; // search_base 뷰를 쓰실 때
};

export function useSearchCards(filters: Filters, opts?: {
  kind?: 'buddy'|'love';
  page?: number;
  pageSize?: number;
}) {
  const [data, setData] = useState<SearchCardRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pageSize = opts?.pageSize ?? 30;
  const page = opts?.page ?? 1;

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);

      const { from, to } = buildDateRange(
        filters.dateKey,
        filters.customFrom,
        filters.customTo,
      );

      const { data, error } = await supabase.rpc('search_cards', {
        p_card_kind: opts?.kind ?? null,
        p_species: filters.species,                                // 'all' | 'dog' | 'cat' | 'others'
        p_genders: filters.genders.length ? filters.genders : null, // text[] | null
        p_sort_key: filters.sortKey,                               // 'trust'|'manner'|'heart'|'dearlove'
        p_sort_dir: filters.sortDir,                               // 'asc'|'desc'
        p_date_from: from,                                         // timestamptz | null
        p_date_to: to,                                             // timestamptz | null
        p_limit: pageSize,
        p_offset: (page - 1) * pageSize,
      });

      if (error) {
        setError(error.message);
        setData([]);
      } else {
        setData((data as SearchCardRow[]) ?? []);
      }
      setLoading(false);
    };
    run();
  }, [
    filters.dateKey, filters.species, filters.genders.join(','),
    filters.sortKey, filters.sortDir, filters.customFrom, filters.customTo,
    opts?.kind, page, pageSize
  ]);

  return { data, loading, error };
}
