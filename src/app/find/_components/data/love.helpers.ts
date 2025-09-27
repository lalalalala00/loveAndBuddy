import { Animal } from "@/utils/sign";


export type Species = 'all' | 'dog' | 'cat' | 'others';

export function mapToSpecies(animal_type: Animal['animal_type']): Exclude<Species, 'all'> {
  return animal_type === 'dog' ? 'dog' : animal_type === 'cat' ? 'cat' : 'others';
}

export function filterBySpecies(rows: Animal[], species: Species) {
  if (species === 'all') return rows;
  return rows.filter((r) => mapToSpecies(r.animal_type) === species);
}

export type OwnerGroup = {
  owner_uuid: string;
  owner_nickname: string;
  items: Animal[];
};

export function groupByOwner(rows: Animal[]): OwnerGroup[] {
  const map: Record<string, OwnerGroup> = {};
  for (const it of rows) {
    if (!map[it.owner_uuid]) {
      map[it.owner_uuid] = { owner_uuid: it.owner_uuid, owner_nickname: it.owner_nickname, items: [] };
    }
    map[it.owner_uuid].items.push(it);
  }

  Object.values(map).forEach((g) =>
    g.items.sort((a, b) => (a.date + a.start_time).localeCompare(b.date + b.start_time))
  );
  return Object.values(map);
}
