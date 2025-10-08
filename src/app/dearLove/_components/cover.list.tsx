import { useState, useRef, useEffect, useMemo } from 'react';
import { DearLove } from '@/utils/data';
import { formatDate } from '@/utils/date';
import { useUserState } from '@/context/useUserContext';
import Link from 'next/link';

export default function CoverList({
    dearLoves,
    resolveBuddyName,
    handleCoverClick,
    currentBuddyId,
    currentDearId,
    selectedAnimalIds,
}: {
    dearLoves: DearLove[];
    resolveBuddyName: (id?: string | null) => string;
    handleCoverClick: (buddyId?: string | null, dear?: DearLove) => void;
    currentBuddyId: string;
    currentDearId: string;
    selectedAnimalIds: string[] | null;
}) {
    const { animals } = useUserState();
    const [canLeft, setCanLeft] = useState(false);
    const [canRight, setCanRight] = useState(false);

    const railRef = useRef<HTMLDivElement>(null);
    const updateNav = () => {
        const el = railRef.current;
        if (!el) return;
        setCanLeft(el.scrollLeft > 0);
        setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };

    const filtered = useMemo(() => {
        const sel = selectedAnimalIds && selectedAnimalIds.length ? new Set(selectedAnimalIds) : null;
        const hasSel = !!sel;

        return [...dearLoves].reverse().filter((c) => {
            if (!hasSel) return true;
            const ids = (c.with_animals ?? '')
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean);
            return ids.some((id) => sel!.has(id));
        });
    }, [dearLoves, selectedAnimalIds]);

    useEffect(() => {
        const el = railRef.current;
        if (!el) return;

        const t = requestAnimationFrame(updateNav);
        const onScroll = () => updateNav();
        el.addEventListener('scroll', onScroll);
        window.addEventListener('resize', updateNav);

        return () => {
            cancelAnimationFrame(t);
            el.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', updateNav);
        };
    }, [filtered.length]);

    const scrollRail = (dir: 'left' | 'right') => {
        const el = railRef.current;
        if (!el) return;
        const amount = Math.max(200, Math.floor(el.clientWidth * 0.9));
        el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
    };

    const selectedNames = useMemo(() => {
        if (!animals?.length) return [];
        if (!selectedAnimalIds || selectedAnimalIds.length === 0) return [];
        const sel = new Set(selectedAnimalIds);
        return animals.filter((a) => sel.has(a.animal_uuid)).map((a) => a.name);
    }, [animals, selectedAnimalIds]);

    return (
        <div className="relative w-full">
            <div ref={railRef} className="flex gap-1 overflow-x-auto no-scrollbar snap-x snap-mandatory">
                {filtered.reverse().map((c, idx) => {
                    const isSelectedCover = c.id === currentDearId;
                    const isSameBuddy = c.buddy_user_id === currentBuddyId;
                    const ts = c.date_at ? Date.parse(c.date_at) : undefined;

                    return (
                        <button
                            onClick={() => handleCoverClick(c.buddy_user_id, c)}
                            key={idx}
                            className={`snap-start relative shrink-0 w-[205px] h-[130px] group `}
                        >
                            <div
                                className={[
                                    'rounded-[14px] w-5 h-5 transition absolute top-3 right-3 border',
                                    isSelectedCover
                                        ? 'border-[#9ebc81] bg-gradient-to-br from-[#cfe0bf] to-[#9ebc81]'
                                        : isSameBuddy
                                          ? 'border-[#cfe0bf]'
                                          : 'border-gray-300 bg-transparent',
                                ].join(' ')}
                            />
                            <img
                                src={c.representative_img || undefined}
                                alt="cover"
                                className={`w-full h-[130px] rounded-xl object-cover border border-[#dfe9d7] shadow-[2px_4px_10px_#eaf3e2,-2px_-2px_8px_#ffffff] transition group-hover:-translate-y-0.5 ${c.buddy_user_id === currentBuddyId ? ' border-gray-200 border-4' : ''}`}
                                loading="lazy"
                                decoding="async"
                            />
                            <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-t from-black/25 to-transparent opacity-0 group-hover:opacity-100 transition" />
                            <div className="absolute bottom-2 right-3 text-right text-white drop-shadow">
                                <div className="text-[12px] font-semibold">
                                    Buddy_ᬏ᭄꙳⸌ {resolveBuddyName(c.buddy_user_id)}
                                </div>
                                <div className="text-[12px] font-semibold">
                                    {formatDate(Number.isFinite(ts) ? ts : undefined)}
                                </div>
                            </div>
                        </button>
                    );
                })}

                {filtered.length === 0 && (
                    <div className="w-full">
                        <div className="relative flex-col justify-between py-5 w-full h-[130px] overflow-hidden rounded-xl border border-[#dfe9d7] bg-gradient-to-br from-[#f3f7ee] to-white shadow-[2px_4px_10px_#eaf3e2,-2px_-2px_8px_#ffffff] flex items-center ">
                            <div className="absolute -left-10 -top-10 w-28 h-28 rounded-full bg-[#e7efe1]" />
                            <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-[#f4f8ef]" />

                            <div className="relative z-10 flex items-center gap-3 px-4">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white ring-1 ring-[#e3ecdc] shadow-inner">
                                    <span className="text-[18px]">🐾</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[13px] font-semibold text-[#5b7551]">
                                        이 달의 {selectedNames} 이야기는 아직 남겨지지 않았어요.
                                    </span>
                                    <span className="text-[12px] text-gray-600">
                                        {selectedNames}와의 지금 이 순간을 기록해보는 건 어떨까요?
                                    </span>
                                </div>
                            </div>
                            <Link href="/dearLove/write">
                                <button className="text-[14px] custom-card py-1.5 px-6 rounded-lg hover:custom-card-hover">
                                    디얼러브 쓰러가기
                                </button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#f6f9f3] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#f6f9f3] to-transparent" />

            <button
                onClick={() => scrollRail('left')}
                disabled={!canLeft}
                className="absolute -left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border border-[#e3ecdc] bg-white/90 shadow hover:bg-white flex items-center justify-center disabled:opacity-30"
                aria-label="왼쪽으로 스크롤"
            >
                ‹
            </button>
            <button
                onClick={() => scrollRail('right')}
                disabled={!canRight}
                className="absolute -right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border border-[#e3ecdc] bg-white/90 shadow hover:bg-white flex items-center justify-center disabled:opacity-30"
                aria-label="오른쪽으로 스크롤"
            >
                ›
            </button>
        </div>
    );
}
