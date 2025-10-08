'use client';

import ModalIos from '@/common/modal.ios';
import { LocationCard } from './location.card';
import { supabase } from '@/lib/supabaseClient';
import { Booking, EMPTY_USER, EMPTY_SELECTED_ANIMALS_LIST, SelectedAnimals } from '@/utils/data';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useUserState } from '@/context/useUserContext';
import { CardOverviewRow } from './data/cards';
import { Option } from '@/common/selected.box';
import { Role } from '@/utils/sign';
import WeeklyCalendarCard from './weekly.calendar.card';
import { NameTagInfoMinimal } from '@/common/name.tag';

function combineDateTimeToISO(dateStr?: string | null, timeStr?: string | null) {
    if (!dateStr || !timeStr) return null;
    const [y, m, d] = dateStr.split('-').map(Number);
    const [hh, mm] = timeStr.split(':').map(Number);
    return new Date(y, m - 1, d, hh, mm, 0).toISOString();
}

function combineDateTimeToUnixMs(dateStr?: string | null, timeStr?: string | null) {
    if (!dateStr || !timeStr) return null;
    const [y, m, d] = dateStr.split('-').map(Number);
    const [hh, mm] = timeStr.split(':').map(Number);
    return new Date(y, m - 1, d, hh, mm, 0).getTime();
}

export default function BookingModal({
    open,
    onClose,
    infoData,
    setInfoData,
    list,
    selectedDT,
    selectedAnimals,
    location,
    setSelectedDT,
    modal = false,
}: {
    open: boolean;
    onClose: () => void;
    infoData: boolean;
    setInfoData: Dispatch<SetStateAction<boolean>>;
    list: NameTagInfoMinimal;
    selectedDT: { date: string; time: string };
    selectedAnimals: SelectedAnimals[];
    location: Option[];
    setSelectedDT?: Dispatch<SetStateAction<{ date: string; time: string }>>;
    modal: boolean;
}) {
    const { getUser } = useUserState();

    const [busy, setBusy] = useState(false);
    const [actionMsg, setActionMsg] = useState<string | null>(null);
    const [searchLocation, setSearchLocation] = useState<string>('');

    const [buddyBooking, setBuddyBooking] = useState<Booking>({
        user: EMPTY_USER,
        date: 0,
        location: [],
        place: '',
        uuid: '',
        buddy: EMPTY_USER,
        animals: EMPTY_SELECTED_ANIMALS_LIST,
    });

    useEffect(() => {
        const locationNames: string[] = (location ?? []).map((i) => i.name);

        const buddyUserId = list.user_id ?? '';
        const buddyName = (list.name ?? '').toString();
        const buddyAvatar = (list.avatar_url ?? '').toString();
        const buddyType = (list.type ?? 'love') as Role;
        const buddyBirthYear = (list.user_birth_year ?? '0000') + '';
        const buddyComment = (list.user_comment ?? '화이팅').toString();

        setBuddyBooking((prev) => ({
            ...prev,
            uuid: prev.uuid,
            user: {
                uuid: getUser?.uuid ?? '',
                name: getUser?.name ?? '회원',
                avatar_url: getUser?.avatar_url ?? '',
                type: (getUser?.type ?? 'love') as Role,
                user_birth_year: (getUser?.user_birth_year ?? '0000') + '',
                user_comment: getUser?.user_comment ?? '',
            },
            date: combineDateTimeToUnixMs(selectedDT.date, selectedDT.time) ?? 0,
            location: locationNames,
            place: searchLocation ?? '',
            buddy: {
                uuid: buddyUserId,
                name: buddyName,
                avatar_url: buddyAvatar,
                type: buddyType,
                user_birth_year: buddyBirthYear,
                user_comment: buddyComment,
            },
            animals: selectedAnimals ?? EMPTY_SELECTED_ANIMALS_LIST,
        }));
    }, [open, selectedDT, list, getUser, selectedAnimals, location, searchLocation]);

    const canRequest = Boolean(selectedDT.date && selectedDT.time.length > 1);

    const confirmAction = async () => {
        setActionMsg(null);
        setInfoData(true);

        if (!canRequest) {
            setActionMsg('대화 시작 준비 완료! 날짜/시간을 선택하시면 실제 예약 요청으로 전환돼요.');
            return;
        }

        setBusy(true);
        try {
            const startISO = combineDateTimeToISO(selectedDT.date, selectedDT.time);
            if (!startISO) throw new Error('날짜/시간이 올바르지 않아요.');

            const {
                data: { user: authUser },
            } = await supabase.auth.getUser();
            if (!authUser) throw new Error('로그인이 필요합니다.');

            const payload = { buddyBooking };
            const { error } = await supabase.from('bookings').insert(payload);
            if (error) throw error;

            setActionMsg('예약 요청이 전송되었어요! 답장이 오면 버디토키에서 알려드릴게요.');
        } catch (e: any) {
            setActionMsg(e?.message ?? '예약 요청에 실패했어요.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <ModalIos
            isOpen={open}
            handleModalState={onClose}
            title="예약 요청 보내기"
            leftComment={!infoData ? (busy ? '전송 중...' : '예약 요청 보내기') : undefined}
            leftAction={!infoData ? (busy ? undefined : confirmAction) : undefined}
            width={modal ? '380px' : '330px'}
            height="520px"
        >
            {infoData ? (
                <div className="flex flex-col justify-center items-center h-[370px] text-[14px] ">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3 custom-card">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M20 7L9 18L4 13"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <span className="text-[15px] font-semibold mb-1">예약 요청 보내기 완료!</span>
                    <span className="text-gray-700">
                        답장이 오면 <b>버디토키</b>에서 알려드릴게요!
                    </span>
                    {/* {actionMsg && <div className="mt-3 text-[12px] text-gray-600 text-center px-4">{actionMsg}</div>} */}
                </div>
            ) : (
                <div className="relative w-full p-3 h-[400px] overflow-y-scroll no-scrollbar">
                    <div className="w-full rounded-2xl bg-white/70 border border-gray-100 shadow-[8px_8px_20px_rgba(163,177,138,0.18),_-8px_-8px_20px_rgba(255,255,255,0.9)] p-3 mb-1">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-[#f3f7ee] shadow-inner flex items-center justify-center">
                                <img
                                    src={buddyBooking.buddy.avatar_url ?? '/project/buddy_sit_1.png'}
                                    alt={buddyBooking?.buddy?.name ?? 'buddy'}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <div className="text-[13px] text-[#5b7551] font-semibold">예약 정보 확인</div>
                                <div className="text-[16px] font-semibold text-[#374151]">
                                    {buddyBooking?.buddy?.name ?? '-'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {modal && (
                        <div className="my-3">
                            <WeeklyCalendarCard
                                modal
                                availability={{ startHour: 9, endHour: 22 }}
                                setSelectedDT={setSelectedDT}
                                infoData={infoData}
                            />
                        </div>
                    )}

                    <div className="rounded-2xl bg-white/70 border border-gray-100 shadow-[8px_8px_20px_rgba(163,177,138,0.18),_-8px_-8px_20px_rgba(255,255,255,0.9)] p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M7 3v3M17 3v3M4 8h16M6 21h12a2 2 0 0 0 2-2V8H4v11a2 2 0 0 0 2 2Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <span className="text-[12px] text-gray-500">일시</span>
                        </div>
                        <div className="text-[14px] text-gray-800">
                            {selectedDT?.date ?? '-'} {selectedDT?.time ?? ''}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-1">
                        <div className="rounded-2xl bg-white/70 border border-gray-100 shadow-[8px_8px_20px_rgba(163,177,138,0.18),_-8px_-8px_20px_rgba(255,255,255,0.9)] p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M8 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4Zm8 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4ZM6 15c2-1.5 10-1.5 12 0"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <span className="text-[12px] text-gray-500">함께할 친구들</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {selectedAnimals?.length ? (
                                    selectedAnimals.map((a) => (
                                        <span
                                            key={a.id}
                                            className="px-2 py-1 rounded-full text-[12px] bg-[#f3f7ee] border border-white/40 shadow-inner"
                                        >
                                            {a.name}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-[13px] text-gray-400">-</span>
                                )}
                            </div>
                        </div>

                        <LocationCard value={searchLocation} onChange={(next) => setSearchLocation(next)} />
                    </div>
                </div>
            )}
        </ModalIos>
    );
}
