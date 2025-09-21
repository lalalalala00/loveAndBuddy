'use client';
import { useMemo, useState } from 'react';

type Love = { id: string; name: string; imgs: string };

export default function LoveCollageFilter({
    loves,
    initialSelectedIds,
    onChange,
}: {
    loves: Love[];
    initialSelectedIds?: string[];
    onChange?: (selectedIds: string[]) => void;
}) {
    const initial = useMemo(() => new Set(initialSelectedIds ?? loves.map((v) => v.id)), [initialSelectedIds, loves]);
    const [sel, setSel] = useState<Set<string>>(initial);

    const palette = ['#A5D6A7', '#FECACA', '#BFDBFE', '#FDE68A', '#C7D2FE', '#FBCFE8'];

    const hash = (s: string) => {
        let h = 2166136261;
        for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i)) * 16777619;
        return h >>> 0;
    };
    const rand01 = (h: number, salt = 0) => ((h ^ (salt * 9301 + 49297)) % 1000) / 1000;

    const toggle = (id: string) => {
        setSel((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            onChange?.(Array.from(next));
            return next;
        });
    };

    const onKey = (id: string) => (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle(id);
        }
    };

    return (
        <section className="mx-auto max-w-[1100px] px-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-5">
                {loves.map((item, i) => {
                    const on = sel.has(item.id);
                    const h = hash(item.id);
                    const r = (rand01(h) * 12 - 6).toFixed(2); // -6deg ~ +6deg
                    const tx = (rand01(h, 1) * 6 - 3).toFixed(1); // -3px ~ +3px
                    const ty = (rand01(h, 2) * 6 - 3).toFixed(1);
                    const tapeTilt = (rand01(h, 3) * 14 - 7).toFixed(1); // -7deg ~ +7deg
                    const tapeHue = palette[i % palette.length];
                    const accent = palette[(i + 3) % palette.length];

                    return (
                        <button
                            key={item.id}
                            type="button"
                            aria-pressed={on}
                            onClick={() => toggle(item.id)}
                            onKeyDown={onKey(item.id)}
                            style={
                                {
                                    // 개별 카드 변형/색상
                                    ['--rot' as any]: `${r}deg`,
                                    ['--tx' as any]: `${tx}px`,
                                    ['--ty' as any]: `${ty}px`,
                                    ['--tape-rot' as any]: `${tapeTilt}deg`,
                                    ['--tape' as any]: tapeHue,
                                    ['--accent' as any]: accent,
                                } as React.CSSProperties
                            }
                            className={[
                                'collage-item', // 아래 CSS 적용
                                'relative w-[70px] h-[70px]',
                                'transition will-change-transform select-none',
                                on ? 'ring-2 ring-[var(--accent)] ring-offset-2' : 'hover:-translate-y-0.5',
                            ].join(' ')}
                        >
                            {/* 선택 시 뒤 배경 종이색 */}
                            {/* <div
                                className={[
                                    'absolute inset-0 rounded-[18px] -z-10 transition',
                                    on ? 'bg-[var(--accent)]/25' : 'bg-transparent',
                                ].join(' ')}
                            /> */}

                            {/* 상단 와시테이프 */}
                            {/* <span className="tape" /> */}

                            {/* 폴라로이드 프레임 */}
                            <div className="">
                                <img
                                    src={item.imgs}
                                    alt={item.name}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-[70px] h-[70px] object-cover"
                                />
                            </div>

                            {/* 이름 라벨 */}
                            <span className="name-tag">{item.name}</span>

                            {/* 체크/플러스 배지 */}
                            {/* <span className={['badge', on ? 'badge-on' : 'badge-off'].join(' ')}>
                                    {on ? '✓' : '+'}
                                </span> */}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
