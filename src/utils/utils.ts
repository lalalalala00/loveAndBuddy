// 커미션/할인 상수 (튜닝 포인트)
const BASE_COMMISSION = 0.15; // 15%
const PRO_DISCOUNT = { none: 0, lite: 0.03, plus: 0.07 };       // -%p
const TIER_DISCOUNT = { S: 0.02, A: 0.01, B: 0, C: 0 };          // -%p (최저하한 5%)
const MULTIPET_FEE_DISCOUNT = (n:number) => (n>=3 ? 0.10 : n===2 ? 0.05 : 0); // 러브 수수료 할인
const JOIN_WALK_MAX = 3;

export function calcCommission(pro:'none'|'lite'|'plus', tier:'S'|'A'|'B'|'C') {
  return Math.max(0.05, BASE_COMMISSION - PRO_DISCOUNT[pro] - TIER_DISCOUNT[tier]);
}

export function buddyPayout(perPet:number, pets:number, commission:number) {
  const count = Math.min(pets, JOIN_WALK_MAX);
  return perPet * count * (1 - commission);
}
// 러브는 perPet × pets + 플랫폼 수수료(할인 적용) 구조 유지 → 버디 3× 수익 보장 + 러브 혜택 동시 달성
