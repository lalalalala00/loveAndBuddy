import { useState, useRef, useEffect } from 'react';
import { DearLove } from '@/utils/data';
import { formatDate } from '@/utils/date';

export default function CoverList({
    dearLoves,
    resolveBuddyName,
    handleCoverClick,
    currentBuddyId,
    currentDearId,
}: {
    dearLoves: DearLove[];
    resolveBuddyName: (id?: string | null) => string;
    handleCoverClick: (buddyId?: string | null, dear?: DearLove) => void;
    currentBuddyId: string;
    currentDearId: string;
}) {
    const [canLeft, setCanLeft] = useState(false);
    const [canRight, setCanRight] = useState(false);

    const railRef = useRef<HTMLDivElement>(null);

    const updateNav = () => {
        const el = railRef.current;
        if (!el) return;
        setCanLeft(el.scrollLeft > 0);
        setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };

    useEffect(() => {
        updateNav();
        const el = railRef.current;
        if (!el) return;
        const onScroll = () => updateNav();
        el.addEventListener('scroll', onScroll);
        window.addEventListener('resize', updateNav);
        return () => {
            el.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', updateNav);
        };
    }, []);

    const scrollRail = (dir: 'left' | 'right') => {
        const el = railRef.current;
        if (!el) return;
        const amount = Math.max(200, Math.floor(el.clientWidth * 0.9));
        el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
    };

    return (
        <div className="relative w-full">
            <div ref={railRef} className="flex gap-1 overflow-x-auto no-scrollbar snap-x snap-mandatory">
                {[...dearLoves].reverse().map((c, idx) => {
                    const isSelectedCover = c.id === currentDearId;
                    const isSameBuddy = c.buddy_user_id === currentBuddyId;
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
                                src={c.representative_img}
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
                                <div className="text-[12px] font-semibold">{formatDate(c.date_at)}</div>
                            </div>
                        </button>
                    );
                })}
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
