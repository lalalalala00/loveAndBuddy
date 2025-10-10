
const JOIN_WALK_MAX = 3;


export function buddyPayout(perPet:number, pets:number, commission:number) {
  const count = Math.min(pets, JOIN_WALK_MAX);
  return perPet * count * (1 - commission);
}
