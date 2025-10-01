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
import { DUMMY_LOVE_ANIMALS, DUMMY_LOVE_GROUPS } from './data/cards.love';
import { LoveGroupCard } from '@/utils/sign';
import { useUserState } from '@/context/useUserContext';
import LoveCollageFilter2 from '@/app/dearLove/_components/love.filter2';

const Index = () => {
    const { animals } = useUserState();
    const router = useRouter();
    const [selectedType, setSelectedType] = useState<number>(1);
    const [list, setList] = useState<CardOverviewRow[]>([]);
    const [loadingList, setLoadingList] = useState(false);
    const [errorList, setErrorList] = useState<string | null>(null);

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

    return (
        <div className="flex flex-col mt-5 mb-8 pb-10 rounded-2xl bg-[#fefefe] border-2 border-[#fafdf4] shadow-[4px_4px_10px_#f7f9f6,-4px_-4px_10px_#ffffff]">
            <div className="relative flex justify-center items-center text-center px-6 py-4 border-b border-gray-200 text-[15px] mb-12 font-semibold text-gray-700">
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
                <div className="absolute top-1/2 right-0">
                    {selectedType === 0 ? (
                        <button onClick={() => router.push('/find/write/love')}>버디 요청하기</button>
                    ) : (
                        <button onClick={() => router.push('/find/write/buddy')}>버디 소개 올리기</button>
                    )}
                </div>
            </div>
            <div className="flex justify-between items-end mb-3 ">
                <div className="flex justify-center w-full">
                    <LoveCollageFilter2 />
                </div>
                <div className="flex  justify-end items-center px-5 w-[920px]">
                    <div className="flex flex-col items-end">
                        <SelectedPlace />
                        <BuddyFilterBar onFiltersChange={setFilters} selectedType={selectedType} />
                    </div>
                </div>
            </div>

            <div className="flex px-5">
                <div className="w-1/4 mr-5 rounded-2xl shadow-md bg-[#f3f7ee] p-4 min-w-[306px] sticky top-4 h-[780px]">
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
                        <span className="text-[12px] flex justify-center">
                            <Tooltip
                                comment="6가지 조건을 모두 만족한"
                                tooltip="하트 20개 이상, 디얼러브 20장 이상, 매너점수 8점 이상, 수의 관련 자격증, 펫시터 교육 수료, 반려동물 경험 인증"
                                clickCss="font-bold text-[#333] cursor-pointer mr-1 underline decoration-dotted text-[12px]"
                            />
                            믿을 수 있는 buddy예요.
                        </span>
                    ) : (
                        <span className="text-[12px] flex justify-center">
                            {' '}
                            📅 오늘부터 <b className="mx-1">7일 이내로</b> 구하는 러브예요!
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
                                    <div className="text-gray-500 text-sm p-3">
                                        오늘부터 7일 안에 가능한 Love 카드가 없어요.
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="">
                                    {list
                                        .filter(
                                            (it) =>
                                                (it.heart ?? 0) >= 20 &&
                                                (it.dear_love ?? 0) >= 20 &&
                                                (it.manner ?? 0) >= 8,
                                        )
                                        .map((item) => (
                                            <div key={item.user_id} className="break-inside-avoid mb-3">
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
                    <div className="w-3/4 columns-1 sm:columns-2 lg:columns-3 gap-2">
                        {loveFiltered.map((item, i) => (
                            <div key={i} className="mb-3 break-inside-avoid">
                                <LoveList list={item} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="w-3/4 columns-1 sm:columns-2 lg:columns-3 gap-x-4">
                        {filtered.map((item) => (
                            <div key={item.user_id} className="break-inside-avoid mb-4">
                                <ListBox2 list={item} />
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
