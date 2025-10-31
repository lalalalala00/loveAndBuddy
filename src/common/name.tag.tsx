'use client';

import { useEffect, useRef, useState } from 'react';
import Tooltip from './tooltip';
import { getAgeFromYear, getDecadeLabel } from '@/utils/date';
import { Role } from '@/utils/type';
import { useRouter } from 'next/navigation';

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
    const router = useRouter();
    const mannerEmoji = getMannerEmoji(4);

    const rootRef = useRef<HTMLDivElement | null>(null);
    const popoverRef = useRef<HTMLDivElement | null>(null);

    const [buddySelected, setBuddySelected] = useState(false);
    const [favorite, setFavorite] = useState<boolean>(false);

    const firstAnimal = info?.animals?.[0] ?? {};

    const safeImgSrc =
        info?.card_kind === 'buddy' || user
            ? (info?.avatar_url && info.avatar_url.trim()) || undefined
            : (firstAnimal.img && firstAnimal.img.trim()) || '/project/buddy_sit_1.png';

    useEffect(() => {
        if (!buddySelected) return;

        const onMouseDown = (e: MouseEvent) => {
            const t = e.target as Node;
            if (
                rootRef.current &&
                !rootRef.current.contains(t) &&
                (!popoverRef.current || !popoverRef.current.contains(t))
            ) {
                setBuddySelected(false);
            }
        };

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setBuddySelected(false);
        };

        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [buddySelected]);

    const onRoom = () => {
        if (!love) {
            const payload = {
                from: 'card',
                name: info?.name ?? '',
                avatar_url: info?.avatar_url ?? '',
                heart: String(info?.heart ?? 4),
                manner: String(info?.manner ?? 9),
                dear_love: String(info?.dear_love ?? 0),
                type: info?.type ?? '',
                gender: info?.gender ?? '',
                user_id: info?.user_id ?? '',
                user_birth_year: String(info?.user_birth_year ?? ''),
                user_comment: info?.user_comment ?? '',
                animal_type: info?.animal_type ?? '',
            };

            const params = new URLSearchParams();
            Object.entries(payload).forEach(([key, val]) => {
                if (val !== undefined && val !== null && val !== '') {
                    params.set(key, val.toString());
                }
            });

            router.push(`/buddyRoom?${params.toString()}`);
            return;
        }

        router.push('/dearLove');
    };

    return (
        <div ref={rootRef} className="flex flex-col items-center p-2 rounded-2xl w-full">
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
                    <div
                        ref={popoverRef}
                        role="dialog"
                        aria-modal="true"
                        className="absolute top-[45px] left-1/2 -translate-x-1/2 z-50 w-[260px] rounded-2xl
               border border-[#eef3e6] bg-white/90 backdrop-blur-xl
               shadow-[6px_6px_16px_#e8eee1,-6px_-6px_16px_#ffffff]
               px-3 py-3 animate-[fadeInUp_180ms_ease-out]
               before:content-[''] before:absolute before:-top-2 before:left-1/2 before:-translate-x-1/2
               before:w-3 before:h-3 before:rotate-45 before:bg-white/90
               before:border-l before:border-t before:border-[#eef3e6]"
                    >
                        <div className="space-y-1.5">
                            <p className="text-[12px] text-gray-600">
                                ꯁꯧ 마음:
                                <span className="font-semibold ml-1">
                                    {(info?.heart ?? firstAnimal?.heart ?? 0).toString()}
                                </span>
                            </p>

                            <p className="text-[12px] text-gray-600">
                                {mannerEmoji} 매너 점수:
                                <span className="font-semibold ml-1">
                                    {(info?.manner ?? firstAnimal?.manner ?? 0).toString()} 점
                                </span>
                            </p>

                            <p className="text-[12px] text-gray-600">
                                ✎ꪑ 디얼 러브:
                                <span className="font-semibold ml-1">{(info?.dear_love ?? 0).toString()} 장</span>
                            </p>
                        </div>

                        {(find || love) && (
                            <div className="my-3 h-px bg-gradient-to-r from-transparent via-[#eef3e6] to-transparent" />
                        )}

                        {find && (
                            <div className="grid grid-cols-2 gap-y-1">
                                <p className="text-[12px] text-gray-600">
                                    성별:
                                    <span className="font-semibold ml-1">{info?.gender ?? '-'}</span>
                                </p>
                                <p className="text-[12px] text-gray-600">
                                    연령대:
                                    <span className="font-semibold ml-1">
                                        {getDecadeLabel(info?.user_birth_year) ?? '-'}
                                    </span>
                                </p>
                                <p className="text-[12px] text-gray-600 col-span-2">
                                    동물:
                                    <span className="font-semibold ml-1">{info?.animal_type ?? 'dog'}</span>
                                </p>
                            </div>
                        )}

                        {love && (
                            <div className="grid grid-cols-2 gap-y-1">
                                <p className="text-[12px] text-gray-600">
                                    난이도:
                                    <span className="font-semibold ml-1">{firstAnimal?.level ?? '-'}</span>
                                </p>
                                <p className="text-[12px] text-gray-600">
                                    반려 나이:
                                    <span className="font-semibold ml-1">
                                        {getAgeFromYear(firstAnimal?.birth_year ?? '0000') ?? '-'}살
                                    </span>
                                </p>
                                <p className="text-[12px] text-gray-600 col-span-2">
                                    동물:
                                    <span className="font-semibold ml-1">{firstAnimal?.animal_type ?? 'dog'}</span>
                                </p>
                            </div>
                        )}

                        <button
                            onClick={onRoom}
                            className="cursor-pointer w-full mt-3 rounded-xl px-3 py-2 text-[13px] font-medium
                 bg-gradient-to-b from-[#f9fcf4] to-[#eef4e7]
                 border border-[#e7efe0]
                 shadow-[2px_2px_8px_#e8eee1,-2px_-2px_8px_#ffffff]
                 hover:shadow-[3px_3px_10px_#e6ede0,-3px_-3px_10px_#ffffff]
                 transition-all"
                        >
                            {love ? '디얼러브 보러가기' : `버디룸 보러가기`}
                        </button>
                    </div>
                )}
            </div>

            <div className={`${find || love ? 'flex' : ''} ${tagCss}`}>
                <div className="flex items-center gap-1 text-[11px] text-gray-700">
                    ꯁꯧ{' '}
                    <span className="font-semibold text-gray-800">
                        {(info?.heart ?? firstAnimal.heart ?? 10).toString()}
                    </span>
                    <span className="text-gray-400">·</span>
                    🍃{' '}
                    <span className="font-semibold text-gray-800">
                        {(info?.manner ?? firstAnimal.manner ?? 9).toString()}
                    </span>
                    <span className="text-gray-400">·</span>
                    ✎ꪑ <span className="font-semibold text-gray-800">{(info?.dear_love ?? 0).toString()}</span>
                </div>

                {find && asap && !user && (
                    <div className="flex items-center gap-1 text-[11px] text-gray-700 ml-2">
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-800">{info?.gender ?? '-'}</span>
                        <span className="text-gray-400">·</span>
                        <span className="text-gray-800">
                            {getDecadeLabel(info?.user_birth_year ?? undefined) ?? 30}
                        </span>
                        <span className="text-gray-400">·</span>
                        <span className="text-gray-800">{info?.animal_type ?? 'dog'}</span>
                    </div>
                )}

                {love && asap && !user && (
                    <div className="flex items-center gap-1 text-[11px] text-gray-700 ml-2">
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-500">Lv.</span>
                        <span className="font-semibold text-gray-800">{firstAnimal.level ?? '-'}</span>
                        <span className="text-gray-400">·</span>
                        <span className="font-semibold text-gray-800">
                            {(getAgeFromYear(firstAnimal.birth_year ?? '0000') ?? 7).toString()}{' '}
                            <span className="text-gray-400">살 ·</span>
                        </span>

                        <span className="text-gray-800">{firstAnimal.animal_type ?? 'dog'}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NameTag;
