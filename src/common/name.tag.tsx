'use client';

import { useState } from 'react';
import Tooltip from './tooltip';
import { getAgeFromYear, getDecadeLabel } from '@/utils/date';
import { Role } from '@/utils/type';

type AnimalBrief = {
    img?: string | null;
    heart?: number | null;
    manner?: number | null;
    level?: number | null;
    birth_year?: number | null;
    animal_type?: string | null;
    comment?: string;
    name?: string;
};

export type NameTagInfoMinimal = {
    card_kind?: 'buddy' | 'love';
    name?: string | null;
    owner_nickname?: string | null;
    avatar_url?: string | null;

    heart?: number | null;
    manner?: number | null;
    dear_love?: number | null;

    type?: Role | null;

    gender?: string | null;
    user_id?: string;
    user_birth_year?: number | null;
    user_comment?: string;
    animal_type?: string | null;
    animals?: AnimalBrief[];

    reliability: number | null;

    date?: string;
    start_time?: string;
    end_time?: string;

    location?: string;
    place?: string;
};

const getMannerEmoji = (score: number) => {
    if (score >= 9) return '🌸';
    if (score >= 6) return '🍃';
    return '🌿';
};

const NameTag = ({
    info,
    imgCss,
    tagCss,
    find,
    love,
    small,
    asap,
    user,
}: {
    info: NameTagInfoMinimal;
    imgCss?: string;
    tagCss?: string;
    find?: boolean;
    love?: boolean;
    small?: boolean;
    asap?: boolean;
    user?: boolean;
}) => {
    const mannerEmoji = getMannerEmoji(4);

    const [buddySelected, setBuddySelected] = useState(false);
    const [favorite, setFavorite] = useState<boolean>(false);

    const firstAnimal = info?.animals?.[0] ?? {};

    const safeImgSrc =
        info?.card_kind === 'buddy' || user
            ? (info?.avatar_url && info.avatar_url.trim()) || undefined
            : (firstAnimal.img && firstAnimal.img.trim()) || '/project/buddy_sit_1.png';

    return (
        <div className="flex flex-col items-center p-2 rounded-2xl w-full">
            <div className="flex w-full justify-between">
                <div className="flex-1 flex justify-start w-1/3" />
                <img
                    src={safeImgSrc}
                    alt=""
                    className={`object-cover rounded-full shadow ${imgCss ? imgCss : 'w-[60px] h-[60px]'} flex justify-center`}
                    loading="lazy"
                    decoding="async"
                />
                {!small ? (
                    <div className="flex-1 flex justify-end items-center">
                        <Tooltip
                            comment="ʚϊɞ"
                            tooltip="Add to Favorites"
                            clickCss={`${favorite ? 'text-yellow-400' : ''} text-[20px] `}
                            onClick={() => setFavorite(!favorite)}
                        />
                    </div>
                ) : (
                    <div className="flex-1" />
                )}
            </div>

            <div
                className={`${tagCss} relative flex items-center px-3 pt-1 cursor-pointer z-1`}
                onClick={() => setBuddySelected(!buddySelected)}
            >
                <span className="px-1 inline-block text-[12px] font-semibold">
                    {info?.card_kind === 'buddy' ? info?.name : user ? info?.name : info?.owner_nickname}
                </span>
                <span className="text-gray-400 text-[12px]">›</span>

                {buddySelected && (
                    <div className="absolute top-[45px] left-1/2 -translate-x-1/2 z-20 w-[200px] bg-white rounded-xl px-2 py-3 btn-card animate-fadeIn">
                        <div className="px-2">
                            <p className="text-[12px] text-gray-600 mb-1">
                                ꯁꯧ 마음:{' '}
                                <span className="font-medium">
                                    {(info?.heart ?? firstAnimal.heart ?? 0).toString()}
                                </span>
                            </p>
                            <p className="text-[12px] text-gray-600">
                                {mannerEmoji} 매너 점수:{' '}
                                <span className="font-medium">
                                    {(info?.manner ?? firstAnimal.manner ?? 0).toString()} 점
                                </span>
                            </p>
                            <p className="text-[12px] text-gray-600">
                                ✎ꪑ 디얼 러브:{' '}
                                <span className="font-medium">{(info?.dear_love ?? 0).toString()} 장</span>
                            </p>
                            {find && (
                                <>
                                    <div className="flex">
                                        <p className="text-[12px] text-gray-600 mb-1">
                                            <span className="font-medium">{info?.gender ?? '-'}</span>
                                        </p>
                                        <p className="text-[12px] text-gray-600 ml-2">
                                            연령대: <span className="font-medium">{info?.user_birth_year ?? '-'}</span>
                                        </p>
                                    </div>

                                    <p className="text-[12px] text-gray-600">
                                        동물: <span className="font-medium">{info?.animal_type ?? 'dog'}</span>
                                    </p>
                                </>
                            )}
                            {love && (
                                <>
                                    <p className="text-[12px] text-gray-600 mb-1">
                                        난이도 <span className="font-medium">{firstAnimal.level ?? '-'}</span>
                                    </p>
                                    <p className="text-[12px] text-gray-600">
                                        반려동물 나이:{' '}
                                        <span className="font-medium">
                                            {getAgeFromYear(firstAnimal.birth_year ?? '0000') ?? '-'}살
                                        </span>
                                    </p>
                                    <p className="text-[12px] text-gray-600">
                                        동물: <span className="font-medium">{firstAnimal.animal_type ?? 'dog'}</span>
                                    </p>
                                </>
                            )}
                        </div>

                        <button className="cursor-pointer w-full mt-2 custom-card-hover custom-card rounded-lg">
                            <span className="text-[14px]"> {love ? '디얼러브' : 'nickname 버디룸'} 보러가기</span>
                        </button>
                    </div>
                )}
            </div>

            <div className={`${find || love ? 'flex' : ''} ${tagCss}`}>
                <div className="flex items-center gap-1 text-[12px] text-[#666]">
                    ꯁꯧ {(info?.heart ?? firstAnimal.heart ?? 10).toString()} · 🍃{' '}
                    {(info?.manner ?? firstAnimal.manner ?? 9).toString()} · ✎ꪑ {(info?.dear_love ?? 0).toString()}
                </div>
                {find && asap && !user && (
                    <div className="flex items-center gap-1 text-[12px] text-[#666] ml-2">
                        | {info?.gender ?? '-'} · {getDecadeLabel(info?.user_birth_year ?? undefined) ?? 30} ·{' '}
                        {info?.animal_type ?? 'dog'}
                    </div>
                )}
                {love && asap && !user && (
                    <div className="flex items-center gap-1 text-[12px] text-[#666] ml-2">
                        | {firstAnimal.level ?? '-'} ·{' '}
                        {(getAgeFromYear(firstAnimal.birth_year ?? '0000') ?? 7).toString()}살 ·{' '}
                        {firstAnimal.animal_type ?? 'dog'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NameTag;
