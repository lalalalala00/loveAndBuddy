// EmptyMonthCollage.tsx
'use client';
import { useUserState } from '@/context/useUserContext';
import { useMemo } from 'react';

type Animal = { name: string; image?: string | null; avatar_url?: string | null };
type Dear = { date_at?: string | null; photos?: (string | { url: string })[] };

const hashStr = (s: string) => {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
};
const seededShuffle = <T,>(arr: T[], seedStr: string) => {
    const res = [...arr];
    let seed = hashStr(seedStr) || 1;
    const rand = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
    for (let i = res.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [res[i], res[j]] = [res[j], res[i]];
    }
    return res;
};
const extractUrls = (dears: Dear[]) => {
    const out: string[] = [];
    for (const d of dears)
        for (const p of d.photos ?? []) {
            if (typeof p === 'string') out.push(p);
            else if (p?.url) out.push(p.url);
        }
    return Array.from(new Set(out));
};

export default function EmptyMonthCollage({
    animals,
    dears,
    selectedYYYYMM,
}: {
    animals: Animal[];
    dears: Dear[];
    selectedYYYYMM: string; // 'YYYY-MM'
}) {
    const imgs = animals.map((a) => a.img).filter(Boolean) as string[];

    const monthPool = useMemo(() => {
        const inMonth = dears.filter((d) => (d.date_at ?? '').startsWith(selectedYYYYMM));
        const urls = extractUrls(inMonth.length ? inMonth : dears);
        return urls;
    }, [dears, selectedYYYYMM]);

    const petUrls = useMemo(() => {
        const arr = animals.map((a) => a.image ?? a.avatar_url).filter((v): v is string => !!v);
        return Array.from(new Set(arr));
    }, [animals]);

    const { bgTiles, cardA, cardB, hero } = useMemo(() => {
        const shuffled = seededShuffle(monthPool, selectedYYYYMM);
        const bgTiles = shuffled.slice(0, 12);

        const rest = shuffled.slice(12);
        const cardA = rest.slice(0, 3);
        const cardB = rest.slice(3, 6);

        const hero = petUrls[0] ?? shuffled[0] ?? '';

        return { bgTiles, cardA, cardB, hero };
    }, [monthPool, petUrls, selectedYYYYMM]);

    const emptyMessage = (selectedDate: string) => {
        const today = new Date();
        const [y, m] = selectedDate.split('-').map(Number);

        const selected = new Date(y, m - 1, 1);

        const diff = selected.getTime() - new Date(today.getFullYear(), today.getMonth(), 1).getTime();

        if (diff > 0) {
            return '이 달의 이야기는 아직 시작되지 않았어요. 곧 새로운 디얼러브로 채워질 거예요 ✿';
        } else if (diff < 0) {
            return `${selectedYYYYMM.slice(5, 7)}월의 디얼러브는 기록되지 않았지만, 마음속에 소중히 남아있을 거예요 ♡`;
        } else {
            return '이 달의 이야기는 아직 남겨지지 않았어요. 지금 이 순간을 기록해보는 건 어떨까요?';
        }
    };

    return (
        <section className="relative mx-auto max-w-[1200px] px-4 mt-8">
            <div className=" flex items-center justify-center">
                <div className="">
                    <p className="text-center text-[14px] md:text-[15px] text-[#5b7551] font-medium">
                        {emptyMessage(selectedYYYYMM)}
                    </p>
                </div>
            </div>
            <div className="relative rounded-3xl border border-[#e3ecdc] bg-[#f3f7ee] shadow-[6px_8px_24px_#eef6e6,inset_-6px_-8px_24px_#ffffff] overflow-hidden">
                <div className="grid grid-cols-2 opacity-40 blur-[2px] sm:grid-cols-3 md:grid-cols-4 gap-1 p-2">
                    {bgTiles.length ? (
                        bgTiles.map((src, i) => (
                            <div key={i} className="relative aspect-square rounded-2xl overflow-hidden">
                                <img
                                    src={src}
                                    alt=""
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-cover scale-[1.02]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full flex items-center justify-center p-12">
                            <div className="w-28 h-28 rounded-full bg-white/80 border border-[#e3ecdc] shadow-inner flex items-center justify-center">
                                <span className="text-[#5b7551] font-bold text-2xl">
                                    {(animals[0]?.name ?? 'Love').slice(0, 2)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* 앞쪽 카드 A */}
                {!!cardA.length && (
                    <div className="absolute left-4 top-6 w-[55%] max-w-[420px] rounded-2xl overflow-hidden bg-white/90 backdrop-blur-sm shadow-xl rotate-[-2.2deg]">
                        <div className="flex items-center gap-2 px-3 py-2 border-b border-[#eef3ea]">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#ff6b6b]" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#feca57]" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#1dd1a1]" />
                            <span className="ml-2 text-[12px] text-gray-600 text-center"># dear.love</span>
                        </div>
                        <div className=" grid grid-cols-3">
                            {cardA.map((src, i) => (
                                <div key={i} className="aspect-square overflow-hidden">
                                    <img src={src} alt="" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 앞쪽 카드 B */}
                {!!cardB.length && (
                    <div className="absolute right-6 top-20 w-[42%] max-w-[360px] overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm  shadow-xl rotate-[1.6deg]">
                        <div className="flex items-center gap-2 px-3 py-2 border-b border-[#eef3ea]">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#ff6b6b]" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#feca57]" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#1dd1a1]" />
                        </div>
                        <div className="grid grid-cols-2">
                            {cardB.map((src, i) => (
                                <div key={i} className="aspect-[4/5] overflow-hidden">
                                    <img src={src} alt="" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 하단 작은 패널(이모지판 느낌) */}
                <div className="absolute left-8 bottom-6 w-[280px] rounded-2xl border border-[#e3ecdc] bg-white/90 backdrop-blur-sm shadow-lg">
                    <div className="px-3 py-2 text-[12px] text-gray-600 border-b border-[#eef3ea]">
                        smileys &amp; people
                    </div>
                    <div className="p-2 grid grid-cols-8 gap-1 text-[18px] select-none">
                        {'😊🙂🥰😆😘😌😇🤗😉😙😚🤭😴🤤🤩🥹'.split('').map((e, i) => (
                            <span key={i} className="flex items-center justify-center">
                                {' '}
                                {e}{' '}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {imgs.length > 0 && (
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                  w-[62%] max-w-[560px] rounded-3xl border border-[#e3ecdc]
                  bg-white/60 backdrop-blur-xl shadow-[0_12px_32px_rgba(157,187,128,0.28)]"
                >
                    <div className="relative">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 p-2">
                            {imgs.map((src, i) => (
                                <div key={`${src}-${i}`} className="relative aspect-square rounded-2xl overflow-hidden">
                                    <img
                                        src={src}
                                        alt=""
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                                </div>
                            ))}
                        </div>

                        <div className="px-4 py-2 rounded-xl border border-[#e3ecdc] bg-white shadow-sm text-[13px] text-gray-700">
                            {animals.map((a) => a.name).join(', ')}와 함께한 기록해 보세요. 사진을 업로드하면 이 달의
                            디얼러브가 채워져요 ✦
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
