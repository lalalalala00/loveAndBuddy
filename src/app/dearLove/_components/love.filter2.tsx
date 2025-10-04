'use client';
import { useUserState } from '@/context/useUserContext';
import { useEffect, useState } from 'react';

export default function LoveCollageFilter2({ onChange }: { onChange?: (selectedIds: string[]) => void }) {
    const { animals } = useUserState();
    const [sel, setSel] = useState<Set<string>>(new Set());

    const palette = ['#A5D6A7', '#FECACA', '#BFDBFE', '#FDE68A', '#C7D2FE', '#FBCFE8'];
    useEffect(() => {
        const idsFromAnimals = animals?.map((a) => a.animal_uuid) ?? [];
        const initIds = idsFromAnimals;

        const next = new Set(initIds);
        setSel(next);
        onChange?.(Array.from(next));
    }, [animals]);

    const isSingle = (animals?.length ?? 0) <= 1;

    const toggle = (id: string) => {
        if (isSingle) return;

        setSel((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                if (prev.size === 1) return prev;
                next.delete(id);
            } else {
                next.add(id);
            }
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
        <section className="max-md:flex max-md:justify-end max-md:w-full max-md:mb-3">
            {animals.map((item, i) => {
                const id = item.animal_uuid;
                const on = sel.has(id);
                const accent = palette[i % palette.length];
                const src = item.img || '/placeholder/avatar.png';

                return (
                    <button
                        key={i}
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggle(item.animal_uuid)}
                        onKeyDown={onKey(item.animal_uuid)}
                        style={
                            {
                                ['--accent' as any]: accent,
                            } as React.CSSProperties
                        }
                        className={[
                            ' w-[50px] h-[50px] rounded-full',
                            on
                                ? 'ring-2 ring-[var(--accent)] ring-offset-2 bg-[var(--accent)] -translate-y-1'
                                : 'hover:-translate-y-0.5',
                        ].join(' ')}
                    >
                        <img
                            src={src}
                            alt={item.name}
                            loading="lazy"
                            decoding="async"
                            className="w-[50px] h-[50px] object-cover rounded-full"
                        />
                    </button>
                );
            })}
        </section>
    );
}
