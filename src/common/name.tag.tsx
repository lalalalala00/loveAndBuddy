'use client';

import { useState } from 'react';
import Tooltip from './tooltip';

const getMannerEmoji = (score: number) => {
    if (score >= 9) return '🌸';
    if (score >= 6) return '🍃';
    return '🌿';
};

const NameTag = ({
    imgCss,
    tagCss,
    find,
    love,
    small,
    asap,
}: {
    imgCss?: string;
    tagCss?: string;
    find?: boolean;
    love?: boolean;
    small?: boolean;
    asap?: boolean;
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
                    src="/project/buddy_sit_1.png"
                    alt=""
                    className={` object-cover rounded-full ${imgCss ? imgCss : 'w-[60px] h-[60px]'} flex justify-center`}
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
                <span className="px-1 inline-block text-[12px] font-semibold">nickname</span>
                <span className="text-gray-400 text-[12px]">›</span>

                {buddySelected && (
                    <div className="absolute top-[45px] left-1/2 -translate-x-1/2 z-20 w-[200px] bg-white rounded-xl px-2 py-3 btn-card animate-fadeIn">
                        {/* <p className="text-[13px] text-gray-800 font-semibold mb-1">{buddyData.nickname}</p> */}
                        <div className="px-2">
                            <p className="text-[12px] text-gray-600 mb-1">
                                ꯁꯧ 마음: <span className="font-medium">3</span>
                            </p>
                            <p className="text-[12px] text-gray-600">
                                {mannerEmoji} 매너 점수: <span className="font-medium">4 점</span>
                            </p>
                            <p className="text-[12px] text-gray-600">
                                ✎ꪑ 디얼 러브: <span className="font-medium">7 장</span>
                            </p>
                            {find && (
                                <>
                                    <div className="flex">
                                        <p className="text-[12px] text-gray-600 mb-1">
                                            <span className="font-medium">여성</span>
                                        </p>
                                        <p className="text-[12px] text-gray-600">
                                            연령대: <span className="font-medium">30대</span>
                                        </p>
                                    </div>

                                    <p className="text-[12px] text-gray-600">
                                        동물: <span className="font-medium">강아지</span>
                                    </p>
                                </>
                            )}
                            {love && (
                                <>
                                    <p className="text-[12px] text-gray-600 mb-1">
                                        난이도 <span className="font-medium">9</span>
                                    </p>
                                    <p className="text-[12px] text-gray-600">
                                        반려동물 나이: <span className="font-medium">12살</span>
                                    </p>
                                    <p className="text-[12px] text-gray-600">
                                        동물: <span className="font-medium">강아지</span>
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
                <div className="flex items-center gap-1 text-[12px] text-[#666]">ꯁꯧ 3 · 🍃 4 · ✎ꪑ 38</div>
                {find && asap && (
                    <div className="flex items-center gap-1 text-[12px] text-[#666] ml-2">| 여성 · 30대 · 강아지</div>
                )}
                {love && asap && (
                    <div className="flex items-center gap-1 text-[12px] text-[#666] ml-2">| 8 · 12살 · 강아지</div>
                )}
            </div>
        </div>
    );
};

export default NameTag;
