import { Filters, buildDateLabel } from '@/utils/date';
import { useEffect, useMemo, useState } from 'react';

type Addr = { name: string; code?: string };

function cx(...c: (string | false | null | undefined)[]) {
    return c.filter(Boolean).join(' ');
}

export default function BuddyFilterBar({
    onFiltersChange,
    selectedType,
}: {
    onFiltersChange?: (f: Filters) => void;
    selectedType: number;
}) {
    const [dateOpen, setDateOpen] = useState(false);
    const [dateKey, setDateKey] = useState<Filters['dateKey']>('none');

    const [species, setSpecies] = useState<Filters['species']>('all');
    const [genders, setGenders] = useState<Filters['genders']>([]);
    const [sortKey, setSortKey] = useState<Filters['sortKey']>('trust');
    const [sortDir, setSortDir] = useState<Filters['sortDir']>('desc');

    const [dateFrom, setDateFrom] = useState<string>('');
    const [dateTo, setDateTo] = useState<string>('');

    useEffect(() => {
        onFiltersChange?.({ dateKey, dateFrom, dateTo, species, genders, sortKey, sortDir });
    }, [dateKey, dateFrom, dateTo, species, genders, sortKey, sortDir, onFiltersChange]);

    const genderActive = (g: 'female' | 'male') => genders.includes(g);
    const toggleGender = (g: 'female' | 'male') =>
        setGenders((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));

    const sortLabelMap = {
        trust: '신뢰도',
        manner: '매너점수',
        heart: '하트수',
        dearlove: '디얼러브',
    } as const;

    const dateLabel = buildDateLabel(dateKey, dateFrom, dateTo);

    return (
        <div className="flex justify-end items-center mb-3">
            <div className="flex flex-col w-[920px]">
                <div className="flex flex-nowrap items-center justify-between gap-3 mt-3 ">
                    <div className="relative">
                        {selectedType === 0 && (
                            <button
                                className={cx(
                                    'px-3 py-2 rounded-full border text-[14px]',
                                    dateKey !== 'none'
                                        ? 'bg-[#aec3991e] border-[#aec399] text-green-800'
                                        : 'border-gray-200 text-gray-700',
                                )}
                                onClick={() => setDateOpen((v) => !v)}
                            >
                                {dateLabel}
                            </button>
                        )}

                        {dateOpen && (
                            <div className="absolute z-10 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-md p-2">
                                {[
                                    { k: 'none', n: '전체 날짜' },
                                    { k: 'today', n: '오늘' },
                                    { k: 'tomorrow', n: '내일' },
                                    { k: 'thisweek', n: '이번 주' },
                                    { k: 'weekend', n: '이번 주말' },
                                ].map((d) => (
                                    <button
                                        key={d.k}
                                        className={cx(
                                            'w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-50',
                                            dateKey === d.k && 'bg-emerald-50 text-emerald-700',
                                        )}
                                        onClick={() => {
                                            setDateKey(d.k as Filters['dateKey']);
                                            if (d.k !== 'custom') {
                                                setDateFrom('');
                                                setDateTo('');
                                            }
                                            setDateOpen(false);
                                        }}
                                    >
                                        {d.n}
                                    </button>
                                ))}

                                <div className="my-2 h-px bg-gray-100" />
                                <div className="px-2 pb-2">
                                    <div className="text-xs text-gray-500 mb-2">직접 설정</div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="date"
                                            className="border rounded-md px-2 py-1 text-sm"
                                            value={dateFrom}
                                            onChange={(e) => setDateFrom(e.target.value)}
                                        />
                                        <span className="text-gray-400">–</span>
                                        <input
                                            type="date"
                                            className="border rounded-md px-2 py-1 text-sm"
                                            value={dateTo}
                                            min={dateFrom || undefined}
                                            onChange={(e) => setDateTo(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2 mt-2">
                                        <button
                                            className="text-xs text-gray-500 hover:text-gray-700"
                                            onClick={() => {
                                                setDateFrom('');
                                                setDateTo('');
                                            }}
                                        >
                                            초기화
                                        </button>
                                        <button
                                            className="text-xs px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-40"
                                            disabled={!dateFrom || !dateTo || new Date(dateFrom) > new Date(dateTo)}
                                            onClick={() => {
                                                setDateKey('custom');
                                                setDateOpen(false);
                                            }}
                                        >
                                            적용
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex max-md:flex-col">
                        <div className="flex items-center bg-white rounded-full border border-gray-200 p-1 mr-2">
                            {[
                                { k: 'all', n: '전체' },
                                { k: 'dog', n: '강아지' },
                                { k: 'cat', n: '고양이' },
                                { k: 'others', n: '다른 친구들' },
                            ].map((opt) => (
                                <button
                                    key={opt.k}
                                    className={cx(
                                        'px-3 py-1.5 rounded-full text-[14px]',
                                        species === (opt.k as Filters['species'])
                                            ? 'bg-[#aec3991e] border-[#aec399] text-green-800'
                                            : 'text-gray-700',
                                    )}
                                    onClick={() => setSpecies(opt.k as Filters['species'])}
                                    aria-pressed={species === opt.k}
                                >
                                    {opt.n}
                                </button>
                            ))}
                        </div>

                        {selectedType === 1 && (
                            <div className="flex items-center gap-2">
                                <button
                                    className={cx(
                                        'px-3 py-2 rounded-full border text-[14px]',
                                        genderActive('female')
                                            ? 'bg-[#aec3991e] border-[#aec399] text-green-800'
                                            : 'border-gray-200 text-gray-700',
                                    )}
                                    onClick={() => toggleGender('female')}
                                    aria-pressed={genderActive('female')}
                                >
                                    여성
                                </button>
                                <button
                                    className={cx(
                                        'px-3 py-2 rounded-full border text-[14px]',
                                        genderActive('male')
                                            ? 'bg-[#aec3991e] border-[#aec399] text-green-800'
                                            : 'border-gray-200 text-gray-700',
                                    )}
                                    onClick={() => toggleGender('male')}
                                    aria-pressed={genderActive('male')}
                                >
                                    남성
                                </button>
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            {selectedType === 1 && (
                                <div className="flex items-center bg-white rounded-full border border-gray-200 p-1">
                                    {(['heart', 'manner', 'dearlove', 'trust'] as Filters['sortKey'][]).map((k) => (
                                        <button
                                            key={k}
                                            className={cx(
                                                'px-3 py-1.5 rounded-full text-[14px]',
                                                sortKey === k
                                                    ? 'bg-[#aec3991e] border-[#aec399] text-green-800'
                                                    : 'text-gray-700',
                                            )}
                                            onClick={() => setSortKey(k)}
                                            aria-pressed={sortKey === k}
                                            title={`정렬: ${sortLabelMap[k]}`}
                                        >
                                            {sortLabelMap[k]}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <button
                                className="px-3 py-2 rounded-full border border-gray-200 text-[14px] hover:bg-gray-50"
                                onClick={() => setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))}
                                title={sortDir === 'desc' ? '내림차순' : '오름차순'}
                            >
                                {sortDir === 'desc' ? '↧' : '↥'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
