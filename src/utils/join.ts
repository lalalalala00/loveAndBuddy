// utils/pricingPromo.ts
export type CancelWindow = 'over48h' | '24to48h' | 'within24h' | 'noShow';

export interface JoinWalkInput {
  perPetKRW: number;      // 1마리 단가
  pets: number;           // 참여 마리수 (1~3)
  commissionRate: number; // 버디 커미션(플랫폼 몫), 예: 0.15
  loveFeeRate: number;    // 러브 수수료율(기본), 예: 0.05
  isLoyalMember: boolean; // 혜택 조건 1: 숨을 많이 사용한 회원
  petDifficulties: number[]; // 혜택 조건 2: 모든 마리 난이도 ≤ 3 이어야 적용
}

const KRW = (n: number) => Math.round(n);

function allPetsEasy(diffs: number[]) {
  return diffs.length > 0 && diffs.every((d) => d <= 3);
}

export function loveFeeRateWithPromo(base: number, pets: number, isLoyalMember: boolean, diffs: number[]) {
  const eligible = isLoyalMember && allPetsEasy(diffs);
  if (!eligible) return base;

  if (pets >= 3) return Math.max(0, base - 0.10);
  if (pets === 2) return Math.max(0, base - 0.05);
  return base;
}

export function settleJoinWalk(input: JoinWalkInput) {
  const pets = Math.min(Math.max(1, Math.floor(input.pets)), 3);
  const gross = input.perPetKRW * pets; // 서비스 금액(단가×마리수)

  const loveFeeRate = loveFeeRateWithPromo(
    input.loveFeeRate,
    pets,
    input.isLoyalMember,
    input.petDifficulties,
  );

  const commissionAmt = KRW(gross * input.commissionRate);  // 플랫폼 커미션(버디측)
  const loveFeeAmt    = KRW(gross * loveFeeRate);            // 러브 수수료(감면/면제 적용)
  const buddyPayout   = gross - commissionAmt;               // 버디 실수령(절대 할인 없음)
  const platformRev   = commissionAmt + loveFeeAmt;          // 플랫폼 총수익
  const loveFinalPay  = gross + loveFeeAmt;                  // 러브 최종 결제액

  return {
    pets,
    gross,
    buddyPayout,
    commissionAmt,
    loveFeeAmt,
    platformRevenue: platformRev,
    loveFinalPay,
    rates: { commission: input.commissionRate, loveFee: loveFeeRate },
    promoApplied: loveFeeRate !== input.loveFeeRate,
  };
}
