'use client';

import { useEffect, useMemo, useState } from 'react';
import { imgs } from './filepage';
import FileNameBox from './file.name.box';
import DiaryMessage from './diary.message';
import DateSelected from './date.selected';
import CoverList from './cover.list';
import Tooltip from '@/common/tooltip';

import LoveCollageFilter2 from './love.filter2';
import { useUserState } from '@/context/useUserContext';
import { BuddyLite, DearLove } from '@/utils/data';
import { getUserById } from '@/common/get.user.by.id';
import PhotoModal from './modal.photo';
import ModalIos from '@/common/modal.ios';

export default function NewLayout() {
    const { animals, dearLoves } = useUserState();

    const firstId = dearLoves?.[0]?.buddy_user_id ?? null;

    const [selectedAni, setSelectedAni] = useState<string[]>([]);

    const [currentBuddyId, setCurrentBuddyId] = useState<string | null>(null);
    const [currentBuddy, setCurrentBuddy] = useState<BuddyLite | null>(null);
    const [buddyCache, setBuddyCache] = useState<Record<string, BuddyLite | null>>({});

    const [dearLove, setDearLove] = useState<DearLove>(dearLoves[0]);

    const [selectedPhoto, setSelectedPhoto] = useState<boolean>(false);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

    useEffect(() => {
        setCurrentBuddyId(firstId);
        setDearLove(dearLoves[0]);
    }, [firstId]);

    useEffect(() => {
        (async () => {
            if (!currentBuddyId) {
                setCurrentBuddy(null);
                return;
            }

            const cached = buddyCache[currentBuddyId];
            if (cached !== undefined) {
                setCurrentBuddy(cached);
                return;
            }

            const user = await getUserById(currentBuddyId).catch(() => null);
            setBuddyCache((prev) => ({ ...prev, [currentBuddyId]: user }));
            setCurrentBuddy(user);
        })();
    }, [currentBuddyId, buddyCache]);
    console.log(currentBuddy, dearLoves, currentBuddyId);

    const handleCoverClick = (buddyId?: string | null, dear: DearLove) => {
        if (!buddyId) return;

        setCurrentBuddyId(buddyId);
        setDearLove(dear);
    };
    console.log(dearLove);
    const gallery = useMemo(() => imgs, []);

    const handlePhotoClick = (i: number) => {
        setSelectedPhoto(!selectedPhoto);
        setSelectedPhotoIndex(i);
    };

    return (
        <div className="min-h-screen w-full text-gray-800 relative">
            <div className="text-center px-6 py-4 bg-[#f3f7ee] rounded-t-2xl border-b border-[#e3ecdc] text-[15px] font-semibold text-[#5b7551] tracking-tight">
                -`♥´- dear.love_〘 {animals.map((a) => a.name).join(', ')} 〙 -`♥´-
            </div>

            <DateSelected />

            <section className="mx-auto flex-col max-w-[1200px] px-3 mt-2 mb-8 flex ">
                <div className="flex justify-between items-end w-full mb-1 px-2 z-20">
                    <Tooltip
                        tooltip={`체리쉬 버디룸 보러가기`}
                        comment={
                            <h2 className="text-[15px] mb-1 font-semibold text-[#5b7551] ">
                                체리쉬와 함께한 1월의 디얼러브
                            </h2>
                        }
                        clickCss="w-full"
                    />
                    <LoveCollageFilter2 onChange={setSelectedAni} currentBuddyId={currentBuddyId} />
                </div>

                <CoverList currentBuddy={currentBuddy} handleCoverClick={handleCoverClick} />
            </section>
            <div className=" mx-auto max-w-[1000px] pt-3 pb-3">
                <div className="border-t-2 border-[#e7efe1]" />
            </div>
            {!dearLoves ? (
                <div>
                    <span> no data</span>
                </div>
            ) : (
                <main className=" mx-auto max-w-[1200px] px-3 mt-4">
                    <span className="flex justify-center mb-6 text-[12px] text-[#8f8f8f] text-shadow-2xs">
                        8월 1일 (금) 오전 9:35
                    </span>
                    <div className="columns-2 md:columns-4 gap-2 [column-fill:_balance]">
                        {gallery.map((item, i) => (
                            <div key={i} className="mb-2 break-inside-avoid">
                                {i === 0 && (
                                    <div className="mb-2">
                                        <FileNameBox
                                            bgImg={dearLove?.representative_img}
                                            textColor=""
                                            dearLove={dearLove}
                                            currentBuddy={currentBuddy}
                                        />
                                    </div>
                                )}
                                {i === 5 && (
                                    <div className="mb-2">
                                        <DiaryMessage text={dearLove?.comment} />
                                    </div>
                                )}

                                <button
                                    onClick={() => handlePhotoClick(i)}
                                    className="group rounded-xl border border-[#dfe9d7] bg-white/95 shadow-sm overflow-hidden transition hover:shadow-md hover:-translate-y-0.5"
                                >
                                    <img
                                        src={item.url}
                                        alt=""
                                        loading="lazy"
                                        decoding="async"
                                        className={`block w-full object-cover ${item.comment ? 'rounded-t-xl' : 'rounded-xl'}`}
                                    />
                                    {item.comment && (
                                        <div className="p-2">
                                            <p className="text-[14px] md:text-[15px] leading-4 text-gray-800">
                                                {item.comment}
                                            </p>
                                        </div>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                </main>
            )}

            <div className="h-12" />

            <ModalIos
                isOpen={selectedPhoto}
                handleModalState={() => setSelectedPhoto(!selectedPhoto)}
                width="50%"
                height="800px"
                title={'title'}
                leftComment="*⁀➷♥ Heart ⌁❤︎⌁﻿"
                leftAction={() => console.log('heart')}
            >
                <PhotoModal
                    handleModalState={() => setSelectedPhoto(!selectedPhoto)}
                    images={imgs}
                    selectedIndex={selectedPhotoIndex}
                />
            </ModalIos>
        </div>
    );
}

const loves = [
    { imgs: '/cha/chacha.png', name: '샤넬', id: '1' },
    { imgs: '/love/rungji.jpeg', name: '룽지', id: '2' },
    { imgs: '/love/meng.png', name: '돌멩이', id: '3' },
    { imgs: '/love/IMG_1659.JPG', name: '도도', id: '4' },
];
