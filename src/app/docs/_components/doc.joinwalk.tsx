// components/JoinWalkRevenuePromo.tsx
'use client';

import { settleJoinWalk } from '@/utils/join';

type Props = {
    perPet?: number; // 기본 20000
    commission?: number; // 기본 0.15 = 15%
    loveFee?: number; // 기본 0.05 = 5%
    isLoyalMember?: boolean;
    // 예: 난이도 1~3(이하)만 참여 시 혜택 적용
    diffs1?: number[]; // 1마리 케이스 난이도 배열 (기본 [2])
    diffs2?: number[]; // 2마리 케이스 (기본 [2,3])
    diffs3?: number[]; // 3마리 케이스 (기본 [1,2,3])
};

const KRW = (n: number) => `₩${n.toLocaleString()}`;

export default function JoinWalkRevenuePromo({
    perPet = 20000,
    commission = 0.15,
    loveFee = 0.05,
    isLoyalMember = true,
    diffs1 = [2],
    diffs2 = [2, 3],
    diffs3 = [1, 2, 3],
}: Props) {
    const rows = [
        settleJoinWalk({
            perPetKRW: perPet,
            pets: 1,
            commissionRate: commission,
            loveFeeRate: loveFee,
            isLoyalMember,
            petDifficulties: diffs1,
        }),
        settleJoinWalk({
            perPetKRW: perPet,
            pets: 2,
            commissionRate: commission,
            loveFeeRate: loveFee,
            isLoyalMember,
            petDifficulties: diffs2,
        }),
        settleJoinWalk({
            perPetKRW: perPet,
            pets: 3,
            commissionRate: commission,
            loveFeeRate: loveFee,
            isLoyalMember,
            petDifficulties: diffs3,
        }),
    ];

    return (
        <div className="space-y-3">
            <div className="rounded-xl  border border-neutral-200 p-3 text-sm bg-white">
                <div className="font-medium mb-1">정산 규칙</div>
                <ul className="list-disc pl-5 space-y-1 ">
                    <li>
                        <b>버디 수익</b>: 기본 단가 × 참여 마리수 × (1 − 커미션)
                    </li>
                    <li>
                        <b>러브 할인</b>: 플랫폼 수수료 <b>2마리 -5%p</b>, <b>3마리 -10%p</b> (최저 0%까지, 버디
                        수익에는 영향 無)
                    </li>
                    <li>
                        취소/지연: <b>48h·24h·당일</b> 구간별 차등(정책 상수로 관리)
                    </li>
                    <li className="text-amber-700">
                        혜택 조건: <b>충성회원</b> & <b>참여 모든 반려동물 난이도 ≤ 3</b>인 경우에만 적용
                    </li>
                </ul>
            </div>

            <div className="rounded-xl border border-neutral-200 p-3 overflow-x-auto bg-white">
                <table className="min-w-[820px] w-full text-sm">
                    <thead className="text-left text-neutral-600">
                        <tr>
                            <th className="py-1 pr-3">마리수</th>
                            <th className="py-1 pr-3">서비스 금액</th>
                            <th className="py-1 pr-3">버디 수익</th>
                            <th className="py-1 pr-3">플랫폼 커미션</th>
                            <th className="py-1 pr-3">러브 수수료</th>
                            <th className="py-1 pr-3">플랫폼 총수익</th>
                            <th className="py-1 pr-3">러브 최종 결제액</th>
                            <th className="py-1 pr-3">프로모션 적용</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r) => (
                            <tr key={r.pets} className="border-t">
                                <td className="py-1 pr-3">{r.pets}마리</td>
                                <td className="py-1 pr-3">{KRW(r.gross)}</td>
                                <td className="py-1 pr-3">{KRW(r.buddyPayout)}</td>
                                <td className="py-1 pr-3">{KRW(r.commissionAmt)}</td>
                                <td className="py-1 pr-3">
                                    {KRW(r.loveFeeAmt)} {r.loveFeeAmt === 0 ? '(면제/하한 0%)' : ''}
                                </td>
                                <td className="py-1 pr-3">{KRW(r.platformRevenue)}</td>
                                <td className="py-1 pr-3">{KRW(r.loveFinalPay)}</td>
                                <td className="py-1 pr-3">{r.promoApplied ? '적용' : '미적용'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <p className="text-[12px] text-neutral-500 mt-2">
                    * 기본 가정: 1마리 {KRW(perPet)}, 커미션 {Math.round(commission * 100)}%, 러브 수수료{' '}
                    {Math.round(loveFee * 100)}%. 혜택은 <b>충성회원 + 난이도 ≤ 3</b> 조합에만 적용됩니다.
                </p>
            </div>
        </div>
    );
}
