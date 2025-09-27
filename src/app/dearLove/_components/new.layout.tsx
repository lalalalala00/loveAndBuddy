'use client';

import { useMemo, useState } from 'react';
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
import { useDearLoveIndex } from '@/hooks/useDearLove';
import EmptyMonthState from './empty.state';
import EmptyMonthCollage from './empty.state2';

export default function NewLayout() {
    const { animals, dearLoves = [] } = useUserState();

    const [selectedDate, setSelectedDate] = useState<string>(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    });

    const filteredDearLoves = useMemo(() => {
        if (!selectedDate) return dearLoves;
        const prefix = selectedDate;
        return dearLoves.filter((d) => (d.date_at ?? '').startsWith(prefix));
    }, [dearLoves, selectedDate]);

    const { state, actions } = useDearLoveIndex(filteredDearLoves, getUserById);
    const { sortedDearLoves, dearLove, currentBuddy, currentBuddyId, buddyCache } = state;

    const [selectedAnimal, setSelectedAnimal] = useState<string[]>([]);
    const [selectedPhoto, setSelectedPhoto] = useState(false);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

    const handleCoverClick = (buddyId?: string | null, nextDear?: DearLove) => {
        if (!buddyId || !nextDear) return;
        actions.selectByDear(nextDear);
    };

    const handlePhotoClick = (i: number) => {
        setSelectedPhoto(true);
        setSelectedPhotoIndex(i);
    };

    const formatStamp = (iso?: string | null) => {
        if (!iso) return '';
        const d = new Date(iso);
        const w = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
        return `${d.getMonth() + 1}월 ${d.getDate()}일 (${w}) ${d.getHours()}시 ${String(d.getMinutes()).padStart(2, '0')}분`;
    };

    const targetLoves = useMemo(() => (dearLove ? [dearLove] : sortedDearLoves), [dearLove, sortedDearLoves]);

    return (
        <div className="min-h-screen w-full text-gray-800 relative">
            <div className="text-center px-6 py-4 bg-[#f3f7ee] rounded-t-2xl border-b border-[#e3ecdc] text-[15px] font-semibold text-[#5b7551] tracking-tight">
                -`♥´- dear.love_〘 {animals.map((a) => a.name).join(', ')} 〙 -`♥´-
            </div>

            <DateSelected setSelectedDate={setSelectedDate} />

            {!dearLove ? (
                <div>
                    {/* <EmptyMonthState animals={animals} selectedDate={selectedDate} /> */}

                    <EmptyMonthCollage animals={animals} dears={dearLoves} selectedYYYYMM={selectedDate} />
                </div>
            ) : (
                <>
                    <section className="mx-auto flex-col max-w-[1200px] px-3 mt-2 mb-8 flex ">
                        <div className="flex justify-between items-end w-full mb-1 px-2 z-20">
                            <Tooltip
                                tooltip={`${currentBuddy?.name ?? ''} 버디룸 보러가기`}
                                comment={
                                    <h2 className="text-[15px] mb-1 font-semibold text-[#5b7551] ">
                                        {currentBuddy?.name ?? 'Buddy'} 함께한 디얼러브
                                    </h2>
                                }
                                clickCss="w-full"
                            />
                            <LoveCollageFilter2 onChange={setSelectedAnimal} currentBuddyId={currentBuddyId} />
                        </div>

                        <CoverList
                            dearLoves={sortedDearLoves}
                            resolveBuddyName={(id?: string | null) =>
                                (id && buddyCache[id]?.name) || (id ? 'Buddy' : '')
                            }
                            handleCoverClick={handleCoverClick}
                            currentBuddyId={currentBuddyId}
                        />
                    </section>

                    <div className=" mx-auto max-w-[1000px] pt-3 pb-3">
                        <div className="border-t-2 border-[#e7efe1]" />
                    </div>
                    <main className=" mx-auto max-w-[1200px] px-3 mt-4">
                        <span className="flex justify-center mb-6 text-[12px] text-[#8f8f8f] text-shadow-2xs">
                            {formatStamp(dearLove.date_at)}
                        </span>

                        <div className="columns-2 md:columns-4 gap-2 [column-fill:_balance]">
                            {targetLoves.map((item) =>
                                item.photos.map((photo, i) => (
                                    <div key={i} className="mb-2 break-inside-avoid">
                                        {i === 0 && (
                                            <div className="mb-2">
                                                <FileNameBox
                                                    bgImg={dearLove?.representative_img}
                                                    textColor=""
                                                    dearLove={dearLove}
                                                    currentBuddy={currentBuddy as BuddyLite | null}
                                                />
                                            </div>
                                        )}
                                        {i === 5 && (
                                            <div className="mb-2">
                                                <DiaryMessage text={item?.comment} />
                                            </div>
                                        )}
                                        <button
                                            onClick={() => handlePhotoClick(i)}
                                            className="group rounded-xl border border-[#dfe9d7] bg-white/95 shadow-sm overflow-hidden transition hover:shadow-md hover:-translate-y-0.5"
                                        >
                                            <img
                                                src={photo}
                                                alt=""
                                                loading="lazy"
                                                decoding="async"
                                                className={`block w-full object-cover ${item.comment ? 'rounded-t-xl' : 'rounded-xl'}`}
                                            />
                                            {/* {item.comment && (
                                                <div className="p-2">
                                                    <p className="text-[14px] md:text-[15px] leading-4 text-gray-800">
                                                        {item.comment}
                                                    </p>
                                                </div>
                                            )} */}
                                        </button>
                                    </div>
                                )),
                            )}
                        </div>
                    </main>
                </>
            )}

            <div className="h-12" />

            <ModalIos
                isOpen={selectedPhoto}
                handleModalState={() => setSelectedPhoto(false)}
                width="50%"
                height="800px"
                title={'title'}
                leftComment="*⁀➷♥ Heart ⌁❤︎⌁﻿"
                leftAction={() => console.log('heart')}
            >
                <PhotoModal
                    handleModalState={() => setSelectedPhoto(false)}
                    images={imgs}
                    selectedIndex={selectedPhotoIndex}
                />
            </ModalIos>
        </div>
    );
}
