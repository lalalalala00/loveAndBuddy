
const JOIN_WALK_MAX = 3;


export function buddyPayout(perPet:number, pets:number, commission:number) {
  const count = Math.min(pets, JOIN_WALK_MAX);
  return perPet * count * (1 - commission);
}
// 러브는 perPet × pets + 플랫폼 수수료(할인 적용) 구조 유지 → 버디 3× 수익 보장 + 러브 혜택 동시 달성
