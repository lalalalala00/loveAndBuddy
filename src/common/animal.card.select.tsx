import { getAgeFromYear } from '@/utils/date';
import { Animal } from '@/utils/sign';
import { useState } from 'react';

export function sortWithOwnerFirst(list: Animal[]) {
    return [...list].sort((a, b) => Number(b.first) - Number(a.first));
}

export default function AnimalSelect({
    initial,
    onChange,
}: {
    initial: Animal[];
    onChange?: (next: Animal[]) => void;
}) {
    const [items, setItems] = useState<Animal[]>(() => sortWithOwnerFirst(initial));

    const initialOwnerId = initial.find((a) => a.first)?.animal_uuid ?? initial[0]?.animal_uuid ?? '';
    const [selected, setSelected] = useState<Set<string>>(() => new Set(initialOwnerId ? [initialOwnerId] : []));

    const setAsOwner = (targetId: string) => {
        setItems((prev) => {
            const next = prev.map((a) => ({ ...a, first: a.animal_uuid === targetId }));
            const sorted = sortWithOwnerFirst(next);
            onChange?.(sorted);
            return sorted;
        });
        setSelected(new Set([targetId]));
    };

    const toggleSelect = (item: Animal) => {
        setSelected((prev) => {
            if (item.first) return prev;
            const next = new Set(prev);
            next.has(item.animal_uuid) ? next.delete(item.animal_uuid) : next.add(item.animal_uuid);

            const selectedList = items.filter((a) => next.has(a.animal_uuid) || a.first);
            onChange?.(sortWithOwnerFirst(selectedList));
            return next;
        });
    };

    return (
        <div className="space-y-3">
            <RepresentativePreview items={items} selected={selected.size} />

            <div className="flex flex-col overflow-y-scroll h-[470px] no-scrollbar">
                {items.map((item, i) => {
                    const isSelected = selected.has(item.animal_uuid);
                    return (
                        <div
                            key={i}
                            onClick={() => toggleSelect(item)}
                            className={[
                                'relative rounded-2xl p-2 mb-2 cursor-pointer transition',
                                'border shadow',
                                item.first ? 'bg-[#f3f7ee]' : 'bg-white',
                                isSelected || item.first
                                    ? 'border-dashed border-2 border-[#afcb94]'
                                    : 'border-[#e3ecdc]',
                            ].join(' ')}
                        >
                            <div className="flex gap-3">
                                <img
                                    src={item.img.length > 1 ? item.img : '/project/buddy_sit_1.png'}
                                    alt={item.name}
                                    className="w-28 h-30 object-cover rounded-xl ring-1 ring-[#e3ecdc] shadow-md"
                                />

                                <div className="flex-1 min-w-0 pt-1">
                                    <div className="flex items-start justify-between">
                                        <div className="truncate">
                                            <div className="font-medium text-[15px] truncate">
                                                {item.name}
                                                <span className="ml-1 align-middle text-emerald-600/70 text-[12px]">
                                                    𝛝𝟈
                                                </span>
                                            </div>
                                            <div className="mt-1 flex flex-wrap gap-1.5 text-[11px]">
                                                <Chip>{getAgeFromYear(item.birth_year)}살</Chip>
                                                {item.color && <Chip>{item.color}</Chip>}
                                                <Chip>
                                                    {item.personality === 'extrovert' ? '🌼 외향적' : '🌙 내향적'}
                                                </Chip>
                                            </div>
                                        </div>

                                        <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                                            {item.first ? (
                                                <button
                                                    disabled
                                                    className="px-3 py-1.5 text-[12px] rounded-lg shadow text-[#51683b] bg-white cursor-default"
                                                    aria-pressed="true"
                                                >
                                                    대표
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => setAsOwner(item.animal_uuid)}
                                                    className="px-2 py-1.5 text-[12px] rounded-lg shadow text-[#51683b] bg-[#f3f7ee] custom-card-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                                                >
                                                    대표로 설정
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        <div className="flex items-center justify-between text-[12px] text-[#9dbb80] mb-1">
                                            <span>level</span>
                                            <span className="font-medium">{item.level}/10</span>
                                        </div>
                                        <div className="w-full h-2.5 rounded-full bg-[#e6efe0] overflow-hidden shadow-inner">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-[#f3ebd2] to-[#b2d2a4] transition-[width]"
                                                style={{ width: `${(+item.level / 10) * 100}%` }}
                                            />
                                        </div>
                                    </div>

                                    <p className="mt-2 text-[12px] text-gray-400">코멘트를 추가해보세요 ✎</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export function Chip({ children }: { children: React.ReactNode }) {
    return (
        <span className="px-2 py-0.5 rounded-full bg-white/70 border border-[#ddf3c9] text-[#51683b]">{children}</span>
    );
}

export function RepresentativePreview({ items, selected }: { items: Animal[]; selected: number }) {
    const rep = items.find((a) => a.first);

    if (!rep) return null;
    return (
        <div className="flex items-center gap-2 p-2 rounded-xl bg-white/70 border border-[#e3ecdc] w-full">
            <img
                src={rep.img ? rep.img : '/project/buddy3.png'}
                alt={rep.name}
                className="w-8 h-8 rounded-lg object-cover"
            />
            <div className="flex flex-col">
                <span className="text-[13px] text-gray-700">
                    대표 반려동물: <b>{rep.name}</b> {selected >= 2 && `외 ${selected - 1}`}
                </span>
                <span className="text-[12px]">반려동물이 2마리 이상일 경우 대표 반려동물 이름으로 등록됩니다.</span>
            </div>
        </div>
    );
}
