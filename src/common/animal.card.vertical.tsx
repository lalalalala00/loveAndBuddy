import { Chip, sortWithOwnerFirst } from './animal.card.select';
import { Animal } from '@/utils/sign';
import Tooltip from './tooltip';
import { getAgeFromYear } from '@/utils/date';

export default function AnimalCardVertical({
    initial,
    onDelete,
}: {
    initial: Animal[];
    onDelete?: (id: string) => void;
}) {
    const list = sortWithOwnerFirst(initial);

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
                {list.map((item, i) => (
                    <div
                        key={i}
                        // onClick={() => onDelete?.(item.animal_uuid)}
                        className={[
                            'relative rounded-2xl p-2 mb-2',
                            ' border border-[#e3ecdc] shadow',
                            `${item.first ? 'bg-[#f3f7ee]' : 'bg-[#f3f7ee23]'}`,

                            ,
                        ].join(' ')}
                    >
                        <div className="relative flex flex-col  gap-3">
                            <Tooltip
                                comment={
                                    <img
                                        src={item.img.length > 1 ? item.img : '/project/buddy_sit_1.png'}
                                        alt={item.name}
                                        className={`w-full h-30 object-cover rounded-xl ring-1 ring-[#e3ecdc] shadow-md ${list.length >= 2 ? 'hover:opacity-50 cursor-pointer hover:border hover:border-red-300' : ''}`}
                                    />
                                }
                                double
                                tooltip="더블클릭 => 삭제"
                                onClick={() => onDelete?.(item.animal_uuid)}
                                clickCss="w-full"
                            />

                            <div className="absolute top-27 left-1/2 -translate-x-1/2">
                                <span className="rounded-xl px-2 py-0.5 text-[10px] bg-white shadow">
                                    {item.type === 'dog' ? '🐶' : '🐱'}
                                </span>
                            </div>

                            <div className="flex-1 min-w-0 pt-1">
                                <div className="flex flex-col">
                                    <div className="font-medium text-[15px] truncate px-1 flex relative">
                                        {item.name}
                                        <span className="ml-1 align-middle text-emerald-600/70 text-[12px]">𝛝𝟈</span>
                                    </div>

                                    <div className="mt-1 flex flex-wrap gap-1.5 text-[11px]">
                                        {/* <Chip>{item.type === 'dog' ? '🐶 dog' : '🐱 cat'}</Chip> */}
                                        <Chip>{getAgeFromYear(item.birth_year)}살</Chip>
                                        {item.color && <Chip>{item.color}</Chip>}
                                        <Chip>{item.personality === 'extrovert' ? '🌼 외향적' : '🌙 내향적'}</Chip>
                                    </div>
                                </div>

                                {item.first && (
                                    <button
                                        disabled
                                        className="absolute top-2 left-2 px-3 py-1.5 text-[12px] rounded-lg shadow text-[#51683b] bg-white cursor-default"
                                        aria-pressed="true"
                                    >
                                        대표
                                    </button>
                                )}

                                <div className="mt-2">
                                    <div className="flex items-center justify-between text-[12px] text-[#9dbb80] mb-1 px-1">
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

                                <p className="mt-2 text-[12px] text-gray-400 line-2">✎ {item.comment}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
