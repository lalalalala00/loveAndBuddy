'use client';

import { useEffect, useMemo, useState } from 'react';
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
import EmptyMonthCollage from './empty.state2';
import { formatStamp } from '@/utils/date';

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

    const [selectedPhotos, setSelectePhotos] = useState<string[]>();

    const [selectedAnimalIds, setSelectedAnimalIds] = useState<string[] | null>(null);

    const [isFiltering, setIsFiltering] = useState<boolean>(false);

    const handlePhotoClick = (i: number, photos: string[]) => {
        setSelectedPhoto(true);
        setSelectedPhotoIndex(i);
        setSelectePhotos(photos);
    };

    const targetLoves = useMemo(() => (dearLove ? [dearLove] : sortedDearLoves), [dearLove, sortedDearLoves]);

    const filteredLoves = useMemo(() => {
        if (!selectedAnimalIds || selectedAnimalIds.length === 0) return targetLoves;

        const allAnimalIds = animals?.map((a) => a.animal_uuid) ?? [];
        if (selectedAnimalIds.length === allAnimalIds.length) return targetLoves;

        const selSet = new Set(selectedAnimalIds);

        return targetLoves.filter((d) => {
            if (!d.with_animals) return false;
            const ids = d.with_animals
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean);
            return ids.some((id) => selSet.has(id));
        });
    }, [selectedAnimalIds, animals, targetLoves]);

    const pageTitle = useMemo(() => {
        const t = dearLove?.title?.trim?.();
        if (t) return t;
        const buddyName = currentBuddy?.name ?? 'Buddy';
        return `${buddyName}와 함께한 디얼러브`;
    }, [dearLove?.title, currentBuddy?.name, selectedAnimalIds]);

    const allAnimalIds = useMemo(() => (animals ?? []).map((a) => a.animal_uuid), [animals]);

    useEffect(() => {
        const sel = selectedAnimalIds ?? [];
        setIsFiltering(sel.length > 0 && sel.length < allAnimalIds.length);
    }, [selectedAnimalIds, allAnimalIds]);

    const handleCoverClick = (buddyId?: string | null, nextDear?: DearLove) => {
        if (!buddyId || !nextDear) return;
        actions.selectByDear(nextDear);
        setIsFiltering(false);
    };

    const selectedLabel = useMemo(() => {
        const sel = new Set(selectedAnimalIds ?? []);
        const names = (animals ?? []).filter((a) => sel.has(a.animal_uuid)).map((a) => a.name);

        if (names.length === 0) return '';

        return `${names.join(', ')}의 디얼러브`;
    }, [animals, selectedAnimalIds]);

    return (
        <div className="min-h-screen w-full text-gray-800 relative">
            <div className="text-center px-6 py-4 bg-[#f3f7ee] rounded-t-2xl border-b border-[#e3ecdc] text-[15px] font-semibold text-[#5b7551] tracking-tight">
                -`♥´- dear.love_〘 {animals.map((a) => a.name).join(', ')} 〙 -`♥´-
            </div>

            <DateSelected setSelectedDate={setSelectedDate} />

            {!dearLove ? (
                <div>
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
                                        {isFiltering
                                            ? selectedLabel
                                            : `${pageTitle} _ ${currentBuddy?.name ?? ''} 버디`}
                                    </h2>
                                }
                                clickCss="w-full"
                            />
                            <LoveCollageFilter2 onChange={(ids) => setSelectedAnimalIds(ids)} />
                        </div>

                        <CoverList
                            dearLoves={sortedDearLoves}
                            resolveBuddyName={(id?: string | null) =>
                                (id && buddyCache[id]?.name) || (id ? 'Buddy' : '')
                            }
                            handleCoverClick={handleCoverClick}
                            currentBuddyId={currentBuddyId ?? ''}
                            currentDearId={dearLove?.id ?? null}
                            selectedAnimalIds={selectedAnimalIds}
                        />
                    </section>

                    <div className=" mx-auto max-w-[1000px] pt-3 pb-3">
                        <div className="border-t-2 border-[#e7efe1]" />
                    </div>
                    <main className=" mx-auto max-w-[1200px] px-3 mt-4">
                        <span className="flex justify-center mb-6 text-[12px] text-[#8f8f8f] text-shadow-2xs">
                            {formatStamp(filteredLoves[0]?.date_at)}
                        </span>

                        <div className="columns-2 md:columns-4 gap-2 [column-fill:_balance]">
                            {filteredLoves.map((item) =>
                                item.photos.map((photo, i) => (
                                    <div key={i} className="mb-2 break-inside-avoid w-full">
                                        {i === 0 && (
                                            <div className="mb-2">
                                                <FileNameBox
                                                    bgImg={dearLove?.representative_img ?? '/cover/3.png'}
                                                    textColor=""
                                                    dearLove={dearLove}
                                                    currentBuddy={currentBuddy as BuddyLite | null}
                                                />
                                            </div>
                                        )}
                                        {i === 3 && (
                                            <div className="mb-2">
                                                <DiaryMessage text={item?.comment ?? ''} />
                                            </div>
                                        )}
                                        <button
                                            onClick={() => handlePhotoClick(i, item.photos)}
                                            className="group w-full rounded-xl border border-[#dfe9d7] bg-white/95 shadow-sm overflow-hidden transition hover:shadow-md hover:-translate-y-0.5"
                                        >
                                            <img
                                                src={photo}
                                                alt=""
                                                loading="lazy"
                                                decoding="async"
                                                className={`block w-full min-w-full object-cover ${item.comment ? 'rounded-t-xl' : 'rounded-xl'}`}
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
                title={pageTitle}
                leftComment="*⁀➷♥ Heart ⌁❤︎⌁﻿"
                leftAction={() => console.log('heart')}
            >
                <PhotoModal
                    handleModalState={() => setSelectedPhoto(false)}
                    images={selectedPhotos}
                    selectedIndex={selectedPhotoIndex}
                />
            </ModalIos>
        </div>
    );
}
