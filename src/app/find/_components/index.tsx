'use client';

import { useEffect, useMemo, useState } from 'react';

import AsapBoxLove from './asap.box.love';
import ListBox2 from './list.box2';

import CompactBuddyCard from './compact.buddy.card';
import BuddyFilterBar from './buddy.filter.bar';
import LoveList from './list.love';
import Tooltip from '@/common/tooltip';
import { useRouter } from 'next/navigation';
import SelectedPlace from '@/common/selected.place';
import { CardOverviewRow } from './data/cards';
import { supabase } from '@/lib/supabaseClient';
import { DUMMY_CARDS } from './data/cards.others';
import { buildDateLabel, Filters, inRange } from '@/utils/date';
import { DUMMY_LOVE_GROUPS } from './data/cards.love';
import { LoveGroupCard } from '@/utils/sign';
import { useUserState } from '@/context/useUserContext';
import LoveCollageFilter2 from '@/app/dearLove/_components/love.filter2';
import { Option } from '@/common/selected.box';
import { Chip } from '@/common/animal.card.select';

// 주 시작(월요일)로 맞춘 at0
const at0Local = (d: Date) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
};

function getRangeFromFilters(f: Filters): { start: Date; end: Date } | null {
    const today = at0Local(new Date());
    switch (f.dateKey) {
        case 'none':
            return null;
        case 'today': {
            const start = today;
            const end = new Date(start);
            end.setDate(end.getDate() + 1);
            end.setMilliseconds(-1);
            return { start, end };
        }
        case 'tomorrow': {
            const start = new Date(today);
            start.setDate(start.getDate() + 1);
            const end = new Date(start);
            end.setDate(end.getDate() + 1);
            end.setMilliseconds(-1);
            return { start, end };
        }
        case 'thisweek': {
            // 월~일
            const dow = (today.getDay() + 6) % 7; // 월=0
            const start = new Date(today);
            start.setDate(start.getDate() - dow);
            const end = new Date(start);
            end.setDate(end.getDate() + 7);
            end.setMilliseconds(-1);
            return { start, end };
        }
        case 'weekend': {
            const dow = (today.getDay() + 6) % 7; // 월=0
            const sat = new Date(today);
            sat.setDate(sat.getDate() + (5 - dow));
            const sunEnd = new Date(today);
            sunEnd.setDate(sunEnd.getDate() + (7 - dow));
            sunEnd.setMilliseconds(-1);
            return { start: at0Local(sat), end: sunEnd };
        }
        case 'custom': {
            if (!f.dateFrom || !f.dateTo) return null;
            const [y1, m1, d1] = f.dateFrom.split('-').map(Number);
            const [y2, m2, d2] = f.dateTo.split('-').map(Number);
            const start = at0Local(new Date(y1, (m1 ?? 1) - 1, d1 ?? 1));
            const end = at0Local(new Date(y2, (m2 ?? 1) - 1, d2 ?? 1));
            end.setDate(end.getDate() + 1);
            end.setMilliseconds(-1); // inclusive
            return { start, end };
        }
        default:
            return null;
    }
}

const Index = () => {
    const { animals } = useUserState();
    const router = useRouter();
    const [selectedType, setSelectedType] = useState<number>(1);
    const [list, setList] = useState<CardOverviewRow[]>([]);
    const [loadingList, setLoadingList] = useState(false);
    const [errorList, setErrorList] = useState<string | null>(null);

    const [selectedAnimalIds, setSelectedAnimalIds] = useState<string[] | null>(null);

    const [location, setLocation] = useState<Option[]>([]);

    const [filters, setFilters] = useState<Filters>({
        dateKey: 'thisweek',
        species: 'all',
        genders: [],
        sortKey: 'trust',
        sortDir: 'desc',
    });

    useEffect(() => {
        const run = async () => {
            setLoadingList(true);
            setErrorList(null);
            try {
                const { data, error } = await supabase
                    .from('card_overview')
                    .select('*')
                    .eq('card_kind', 'buddy')
                    .order('reliability', { ascending: false });

                if (error) throw error;

                const supa = (data ?? []) as CardOverviewRow[];
                const seen = new Set<string>();
                const merged = [...supa, ...DUMMY_CARDS].filter((x) => {
                    if (!x.user_id || seen.has(x.user_id)) return false;
                    seen.add(x.user_id);
                    return true;
                });
                setList(merged);
            } catch (e: any) {
                setErrorList(e?.message ?? '목록을 불러오지 못했어요.');
            } finally {
                setLoadingList(false);
            }
        };
        run();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filtered = useMemo(() => {
        const range = buildDateLabel(filters.dateKey, filters.dateFrom, filters.dateTo);

        const speciesOk = (it: CardOverviewRow) => {
            if (filters.species === 'all') return true;
            return it.animal_type === filters.species;
        };

        const genderOk = (it: CardOverviewRow) => {
            if (!filters.genders.length) return true;
            return filters.genders.includes((it.gender as any) || '');
        };

        const dateOk = (it: CardOverviewRow) => (range ? inRange(it, range) : true);

        const arr = list.filter(speciesOk).filter(genderOk).filter(dateOk);

        const val = (it: CardOverviewRow) => {
            switch (filters.sortKey) {
                case 'heart':
                    return it.heart ?? 0;
                case 'manner':
                    return it.manner ?? 0;
                case 'dearlove':
                    return it.dear_love ?? 0;
                case 'trust':
                    return it.reliability ?? 0;
                default:
                    return 0;
            }
        };

        arr.sort((a, b) => (filters.sortDir === 'asc' ? val(a) - val(b) : val(b) - val(a)));
        return arr;
    }, [list, filters]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const loveFiltered = useMemo(() => {
        const sp = filters.species; // 'all' | 'dog' | 'cat' | 'others'
        if (sp === 'all') return DUMMY_LOVE_GROUPS;

        const hasBy = {
            dog: (g: LoveGroupCard) => g.animals.some((a) => a.animal_type === 'dog'),
            cat: (g: LoveGroupCard) => g.animals.some((a) => a.animal_type === 'cat'),
            others: (g: LoveGroupCard) => g.animals.some((a) => a.animal_type !== 'dog' && a.animal_type !== 'cat'),
        } as const;

        if (sp === 'dog') return DUMMY_LOVE_GROUPS.filter(hasBy.dog);
        if (sp === 'cat') return DUMMY_LOVE_GROUPS.filter(hasBy.cat);
        // 'others'
        return DUMMY_LOVE_GROUPS.filter(hasBy.others);
    }, [filters.species]);

    const toLocalDate = (s: string) => {
        const [y, m, d] = s.split('-').map(Number);
        return new Date(y, (m ?? 1) - 1, d ?? 1);
    };

    const loveFilteredSoon = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const end = new Date(today);
        end.setDate(end.getDate() + 7);

        return loveFiltered.filter((g) => {
            if (!g.date) return false;
            const d = toLocalDate(g.date);
            return d >= today && d <= end;
        });
    }, [loveFiltered]);

    const loveSorted = useMemo(() => {
        const range = getRangeFromFilters(filters); // ← 여기서 날짜 범위 계산
        const parse = (s?: string) => {
            if (!s) return null;
            const [y, m, d] = s.split('-').map(Number);
            return at0Local(new Date(y, (m ?? 1) - 1, d ?? 1));
        };

        const inRange = (dt: Date) => {
            if (!range) return true;
            return dt >= range.start && dt <= range.end;
        };

        const filteredByDate = loveFiltered.filter((g) => {
            if (!g.date) return false;
            const dt = parse(g.date);
            return !!dt && inRange(dt);
        });

        return filteredByDate.sort((a, b) => {
            const da = parse(a.date)?.getTime() ?? Number.POSITIVE_INFINITY;
            const db = parse(b.date)?.getTime() ?? Number.POSITIVE_INFINITY;
            return da - db;
        });
    }, [loveFiltered, filters]);

    const selectedAnimals = useMemo(() => {
        if (!selectedAnimalIds || !animals?.length) return [];

        const byId = new Map(animals.map((a) => [a.animal_uuid, a]));
        const _arr = selectedAnimalIds
            .map((id) => {
                const a = byId.get(id);
                if (!a) return null;
                return { id, name: a.name, isFirst: !!a.first, avatar_url: a.img };
            })
            .filter((v): v is { id: string; name: string; isFirst: boolean; avatar_url: string } => Boolean(v));

        return [..._arr].sort((a, b) => Number(b.isFirst) - Number(a.isFirst));
    }, [animals, selectedAnimalIds]);

    return (
        <div className="flex flex-col mt-5 mb-8 pb-10 rounded-2xl bg-[#fefefe] border-2 border-[#fafdf4] shadow-[4px_4px_10px_#f7f9f6,-4px_-4px_10px_#ffffff] max-md:mt-0">
            <div className="relative flex justify-center items-center text-center px-6 py-4 border-b border-gray-200 text-[15px] mb-12 font-semibold text-gray-700 max-md:text-[12px]">
                -`♥´- find.MyDearDay_〘
                <div className="px-2 flex items-center">
                    {type.map((item, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedType(item.value)}
                            className={`${item.value === selectedType ? 'custom-card' : 'custom-card-bg-white'} px-7 py-1 rounded-xl mr-3 last:mr-0`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
                〙 -`♥´-
                <div className="absolute top-1/2 right-5 -translate-y-1/2 max-md:top-0">
                    {selectedType === 0 ? (
                        <button
                            className="border border-[#e3ecdc] px-6 py-1 rounded-xl bg-amber-50 hover:bg-[#f3f7ee]"
                            onClick={() => router.push('/find/write/love')}
                        >
                            버디 요청하기
                        </button>
                    ) : (
                        <button
                            className="border border-[#e3ecdc] px-6 py-1 rounded-xl bg-amber-50 hover:bg-[#f3f7ee]"
                            onClick={() => router.push('/find/write/buddy')}
                        >
                            버디 소개 올리기
                        </button>
                    )}
                </div>
            </div>
            <div className="flex justify-between items-end mb-3 max-md:flex-col">
                <div className="flex justify-center w-full flex-col items-center">
                    {selectedType === 1 && (
                        <>
                            <LoveCollageFilter2 onChange={(ids) => setSelectedAnimalIds(ids)} />
                            <div className="flex mt-1">
                                {selectedAnimals.map((a, i) => (
                                    <span key={a.id} className="flex">
                                        <span
                                            className={`mr-3 text-[13px] ${(a.isFirst || i == 0) && 'bg-amber-100 rounded-lg'}`}
                                        >
                                            <Chip>{a.name}</Chip>
                                        </span>
                                    </span>
                                ))}
                            </div>
                        </>
                    )}
                </div>
                <div className="flex  justify-end items-center px-5 w-[920px]">
                    <div className="flex flex-col items-end">
                        <SelectedPlace setLocation={setLocation} />
                        <BuddyFilterBar onFiltersChange={setFilters} selectedType={selectedType} />
                    </div>
                </div>
            </div>

            <div className="flex px-5 max-md:flex-col">
                <div className="w-1/4 mr-5 rounded-2xl shadow-md bg-[#f3f7ee] p-4 min-w-[306px] sticky top-4 h-[780px] max-md:w-full max-md:h-[370px] max-md:mb-10 max-md:relative">
                    <div className="relative mb-3 px-1 py-2 rounded-xl bg-gradient-to-br from-[#e3ecdc]/90 to-[#f3f7ee]/80 border border-[#d5e2c8] text-[#3c5732] text-center font-semibold text-[14px] tracking-tight shadow-[inset_2px_2px_5px_#ffffff,-2px_-2px_5px_#d5e2c8]">
                        {selectedType === 0 ? (
                            <span className="inline-flex items-center">
                                <div className="text-[18px] animate-pulse mr-2">📍</div>
                                급하게
                                <span className="decoration-[#9dbb80] ml-2">»-buddy→</span>를 찾고 있어요!
                            </span>
                        ) : (
                            <span className="inline-flex items-center text-nowrap">
                                <div className="text-[18px] animate-pulse mr-0.5">🍀</div>
                                신뢰도가 높은
                                <span className="decoration-[#9dbb80] ml-2">buddy</span>를 소개해드릴께요.
                            </span>
                        )}
                    </div>
                    {selectedType === 1 ? (
                        <span className="text-[12px] flex justify-center bg-white/60 py-1 rounded-lg">
                            <Tooltip
                                comment="6가지 조건을 모두 만족한"
                                tooltip="하트 20개 이상, 디얼러브 20장 이상, 매너점수 8점 이상, 수의 관련 자격증, 펫시터 교육 수료, 반려동물 경험 인증"
                                clickCss="font-bold text-[#333] cursor-pointer mr-1 underline decoration-dotted text-[12px]"
                            />
                            믿을 수 있는 buddy예요.
                        </span>
                    ) : (
                        <span className="text-[12px] flex justify-center bg-white/60 py-1 rounded-lg">
                            📅 오늘부터 <b className="mx-1">7일 이내의</b> 러브 카드만 노출됩니다.
                        </span>
                    )}

                    <div className="h-[670px] overflow-y-scroll no-scrollbar">
                        {selectedType === 0 ? (
                            <div>
                                {loveFilteredSoon.length ? (
                                    loveFilteredSoon.map((item, i) => (
                                        <div key={i} className="mb-3 break-inside-avoid">
                                            <AsapBoxLove list={item} />
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex justify-center items-center h-[400px]">
                                        <div className="text-gray-500 text-sm p-3">조건에 맞는 러브가 없어요.</div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="max-md:flex max-md:w-full">
                                    {list
                                        .filter(
                                            (it) =>
                                                (it.heart ?? 0) >= 20 &&
                                                (it.dear_love ?? 0) >= 20 &&
                                                (it.manner ?? 0) >= 8,
                                        )
                                        .map((item) => (
                                            <div key={item.user_id} className="break-inside-avoid mb-3 max-md:mr-2">
                                                <CompactBuddyCard list={item} />
                                            </div>
                                        ))}

                                    {list.filter(
                                        (it) =>
                                            (it.heart ?? 0) >= 20 && (it.dear_love ?? 0) >= 20 && (it.manner ?? 0) >= 8,
                                    ).length === 0 && (
                                        <div className="text-gray-500 text-sm p-3">조건에 맞는 카드가 없어요.</div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
                {selectedType === 0 ? (
                    <div className="w-3/4 columns-1 sm:columns-2 lg:columns-3 gap-2 max-md:w-full">
                        {loveSorted.map((item, i) => (
                            <div key={i} className="mb-3 break-inside-avoid">
                                <LoveList list={item} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="w-3/4 columns-1 sm:columns-2 lg:columns-3 gap-x-4 max-md:w-full">
                        {filtered.map((item) => (
                            <div key={item.user_id} className="break-inside-avoid mb-4">
                                <ListBox2 list={item} selectedAnimals={selectedAnimals} location={location} />
                            </div>
                        ))}
                        {!filtered.length && (
                            <div className="text-gray-500 text-sm p-3">조건에 맞는 카드가 없어요.</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const type = [
    { label: 'buddy', value: 1 },
    { label: 'love', value: 0 },
    // { label: "lovuddy", value: 2 },
];
export default Index;
