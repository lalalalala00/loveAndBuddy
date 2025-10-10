
import type { Animal as SignAnimal } from '@/utils/sign';

export type Species = 'all' | 'dog' | 'cat' | 'others';

export function mapToSpecies(
  type: SignAnimal['type']
): Exclude<Species, 'all'> {
  return type === 'dog' ? 'dog' : type === 'cat' ? 'cat' : 'others';
}

export function filterBySpecies<T extends { type: SignAnimal['type'] }>(
  rows: T[],
  species: Species
): T[] {
  if (species === 'all') return rows;
  return rows.filter((r) => mapToSpecies(r.type) === species);
}

export type OwnerGroup<T> = {
  owner_uuid: string;
  owner_nickname: string;
  items: T[];
};

export type AnimalLite = Pick<
  SignAnimal,
  'owner_uuid' | 'owner_nickname' | 'type' | 'animal_uuid' | 'name' | 'img'
> & {
  date?: string | null;       
  start_time?: string | null; 
};

const toTs = (date?: string | null, time?: string | null) => {
  if (!date) return 0;
  const dt = time ? `${date}T${time}:00` : `${date}T00:00:00`;
  const n = Date.parse(dt);
  return Number.isFinite(n) ? n : 0;
};

export function groupByOwner<T extends AnimalLite>(rows: T[]): OwnerGroup<T>[] {
  const map = new Map<string, OwnerGroup<T>>();

  for (const it of rows) {
    if (!it.owner_uuid) continue; 
    const g =
      map.get(it.owner_uuid) ??
      { owner_uuid: it.owner_uuid, owner_nickname: it.owner_nickname ?? '', items: [] };
    g.items.push(it);
    map.set(it.owner_uuid, g);
  }

  const groups = Array.from(map.values());
  for (const g of groups) {
    g.items.sort((a, b) => toTs(a.date, a.start_time) - toTs(b.date, b.start_time));
  }
  return groups;
}
