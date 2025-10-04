'use client';

import { useState } from 'react';
import Tooltip from './tooltip';
import { CardOverviewRow } from '@/app/find/_components/data/cards';
import { getAgeFromYear, getDecadeLabel } from '@/utils/date';
import { Animal } from '@/utils/sign';

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
    info: CardOverviewRow;
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

    const [showTooltip, setShowTooltip] = useState(false);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [favorite, setFavorite] = useState<boolean>(false);

    const handleMouseMove = (e: React.MouseEvent) => {
        setCursorPos({ x: e.clientX, y: e.clientY });
    };

    return (
        <div className="flex flex-col items-center p-2 rounded-2xl w-full">
            <div className="flex w-full justify-between">
                <div className="flex-1 flex justify-start w-1/3" />
                <img
                    src={
                        info?.card_kind === 'buddy'
                            ? info?.avatar_url
                            : user
                              ? info?.avatar_url
                              : (info?.animals[0].img ?? '/project/buddy_sit_1.png')
                    }
                    alt=""
                    className={` object-cover rounded-full shadow ${imgCss ? imgCss : 'w-[60px] h-[60px]'} flex justify-center`}
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
                        {/* <p className="text-[13px] text-gray-800 font-semibold mb-1">{buddyData.nickname}</p> */}
                        <div className="px-2">
                            <p className="text-[12px] text-gray-600 mb-1">
                                ꯁꯧ 마음: <span className="font-medium">{info?.heart || info?.animals[0].heart}</span>
                            </p>
                            <p className="text-[12px] text-gray-600">
                                {mannerEmoji} 매너 점수: <span className="font-medium">{info?.manner} 점</span>
                            </p>
                            <p className="text-[12px] text-gray-600">
                                ✎ꪑ 디얼 러브: <span className="font-medium">{info?.dear_love} 장</span>
                            </p>
                            {find && (
                                <>
                                    <div className="flex">
                                        <p className="text-[12px] text-gray-600 mb-1">
                                            <span className="font-medium">{info?.gender}</span>
                                        </p>
                                        <p className="text-[12px] text-gray-600">
                                            연령대: <span className="font-medium">{info?.user_birth_year}</span>
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
                                        난이도 <span className="font-medium">{info?.animals[0].level}</span>
                                    </p>
                                    <p className="text-[12px] text-gray-600">
                                        반려동물 나이:{' '}
                                        <span className="font-medium">
                                            {getAgeFromYear(info?.animals[0].birth_year)}살
                                        </span>
                                    </p>
                                    <p className="text-[12px] text-gray-600">
                                        동물: <span className="font-medium">{info?.animal_type ?? 'dog'}</span>
                                    </p>
                                </>
                            )}
                        </div>

                        <button
                            // onClick={() => router.push(`/buddy/${buddyData.buddyId}`)}
                            className="cursor-pointer w-full mt-2 custom-card-hover custom-card rounded-lg"
                        >
                            <span className="text-[14px]"> {love ? '디얼러브' : 'nickname 버디룸'} 보러가기</span>
                        </button>
                    </div>
                )}
            </div>
            <div className={`${find || love ? 'flex' : ''} ${tagCss}`}>
                <div className="flex items-center gap-1 text-[12px] text-[#666]">
                    ꯁꯧ {(info?.heart ?? user) ? '10' : info?.animals[0].heart} · 🍃{' '}
                    {(info?.manner ?? user) ? '9' : info?.animals[0].manner} · ✎ꪑ {user ? '68' : info?.dear_love}
                </div>
                {find && asap && !user && (
                    <div className="flex items-center gap-1 text-[12px] text-[#666] ml-2">
                        | {info?.gender} · {getDecadeLabel(info?.user_birth_year) || 30} · {info?.animal_type ?? 'dog'}
                    </div>
                )}
                {love && asap && !user && (
                    <div className="flex items-center gap-1 text-[12px] text-[#666] ml-2">
                        | {info?.level} · {getAgeFromYear(info?.animals[0].birth_year) || '7'}살 ·{' '}
                        {info?.animals[0].animal_type ?? 'dog'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NameTag;
