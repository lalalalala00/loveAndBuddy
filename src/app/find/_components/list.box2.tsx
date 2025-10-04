import WeeklyCalendarCard from './weekly.calendar.card';
import { useBooking } from '@/context/useBookingContext';
import { useEffect, useMemo, useState } from 'react';
import ModalIos from '@/common/modal.ios';
import NameTag from '@/common/name.tag';
import { CardOverviewRow } from './data/cards';
import { supabase } from '@/lib/supabaseClient';
import { Animal, Certificate } from '@/utils/sign';
import { Booking, EMPTY_SELECTED_ANIMALS_LIST, EMPTY_USER, SelectedAnimals } from '@/utils/data';
import { useUserState } from '@/context/useUserContext';
import { Option } from '@/common/selected.box';
import { LocationCard } from './location.card';

function combineDateTimeToISO(dateStr?: string | null, timeStr?: string | null) {
    if (!dateStr || !timeStr) return null;
    const [y, m, d] = dateStr.split('-').map(Number);
    const [hh, mm] = timeStr.split(':').map(Number);
    // 로컬 타임존 -> toISOString(UTC)로 변환
    return new Date(y, m - 1, d, hh, mm, 0).toISOString();
}

function combineDateTimeToUnixMs(dateStr?: string | null, timeStr?: string | null) {
    if (!dateStr || !timeStr) return null;
    const [y, m, d] = dateStr.split('-').map(Number);
    const [hh, mm] = timeStr.split(':').map(Number);
    return new Date(y, m - 1, d, hh, mm, 0).getTime(); // ms
}

type Props = { list: CardOverviewRow; selectedAnimals: SelectedAnimals[]; location: Option[] };

const ListBox2 = ({ list, selectedAnimals, location }: Props) => {
    const { state, timeDate } = useBooking();
    const { getUser } = useUserState();

    const [open, setOpen] = useState(false);
    const [infoDone, setInfoDone] = useState(false);
    const [busy, setBusy] = useState(false);
    const [actionMsg, setActionMsg] = useState<string | null>(null);
    const [infoData, setInfoData] = useState(false);

    const [selectedDT, setSelectedDT] = useState<{ date: string; time: string }>({ date: '', time: '' });
    const [searchLocation, setSearchLocation] = useState<string>('');

    const [buddyBooking, setBuddyBooking] = useState<Booking>({
        user: EMPTY_USER,
        date: 0,
        location: '',
        place: '',
        uuid: '',
        buddy: EMPTY_USER,
        animals: EMPTY_SELECTED_ANIMALS_LIST,
    });

    const certs = (list?.certificates_preview ?? []) as unknown as Certificate[];
    const bullets = certs.flatMap((cp) => [
        ...(Array.isArray(cp.cert) ? cp.cert.map((t) => `✰ ${t} 보유`) : []),
        ...(cp.issuer ? [`✰ ${cp.issuer} 수료`] : []),
        ...(cp.name ? [`✰ ${cp.name} 인증`] : []),
    ]);

    useEffect(() => {
        setBuddyBooking((prev) => ({
            ...prev,
            user: {
                uuid: getUser?.uuid ?? '',
                name: getUser?.name ?? '회원',
                avatar_url: getUser?.avatar_url ?? '',
                type: getUser?.type ?? 'love',
                user_birth_year: getUser?.user_birth_year ?? '0000',
                user_comment: getUser?.user_comment ?? '',
            },
            date: (() => {
                const ms = combineDateTimeToUnixMs(state.draft.date, state.draft.time);
                return ms ?? 0;
            })(),
            location: location.map((item) => item.name) ?? '',
            place: searchLocation ?? '',
            buddy: {
                uuid: list.user_id,
                name: list.name,
                avatar_url: list.avatar_url ?? '',
                type: list.type,
                user_birth_year: list.user_birth_year ?? '0000',
                user_comment: list.user_comment ?? '화이팅',
            },
            animals: selectedAnimals ?? EMPTY_SELECTED_ANIMALS_LIST,
        }));
    }, [open, state.draft, list, getUser, selectedAnimals]);

    const handleClose = () => {
        setInfoData(false);
        setOpen(false);
        setActionMsg(null);
        setInfoDone(false);
        setSearchLocation('');
    };

    const canRequest = Boolean(selectedDT.date && selectedDT.time.length > 1);

    const confirmAction = async () => {
        setActionMsg(null);
        setInfoData(true);
        if (!canRequest) {
            setInfoData(true);
            setInfoDone(true);
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

            const payload = {
                buddyBooking,
            };

            const { error } = await supabase.from('bookings').insert(payload);
            if (error) throw error;

            setInfoDone(true);
            setInfoData(true);
            setActionMsg('예약 요청이 전송되었어요! 답장이 오면 버디토키에서 알려드릴게요.');
        } catch (e: any) {
            setActionMsg(e?.message ?? '예약 요청에 실패했어요.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="rounded-2xl w-full h-auto shadow ">
            <div className="mb-3 rounded-2xl w-full h-auto shadow ">
                <div className="flex flex-col items-center bg-[rgb(246,246,246)] border-b border-[rgb(227,227,227)] rounded-t-2xl">
                    <NameTag imgCss="w-[60px] h-[60px]" find info={list} />
                </div>

                <div className="p-2 flex flex-col justify-between gap-2 min-h-[245px] overflow-visible">
                    <div>
                        <div className="text-[12px] text-gray-500 ml-1 mt-2 px-2">
                            📸 사진촬영동의 · 🪪 신원인증 · ✔️ 인성검사완료
                        </div>

                        <WeeklyCalendarCard
                            availability={{ startHour: 9, endHour: 22 }}
                            setSelectedDT={setSelectedDT}
                            infoData={infoData}
                        />

                        <div className="flex flex-col text-[13px] items-start w-full px-2 my-2">
                            {bullets.length ? (
                                bullets.map((text, i) => <span key={i}>{text}</span>)
                            ) : (
                                <span className="text-gray-500">자격증 정보 없음</span>
                            )}

                            <div className="border-t w-full border-[#e6e6e6] py-0.5 mt-0.5" />
                            <span className="text-gray-800">❀ {list.name} 버디의 한마디 -`♡´-</span>
                            <span className="ml-3 font-semibold">{list.user_comment}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setOpen(true)}
                        disabled={!canRequest}
                        className={`btn-card custom-card w-full rounded-lg py-2 text-[14px] cursor-pointer ${!canRequest ? 'opacity-60 cursor-not-allowed bg-[#e6e6e6]' : ''}`}
                        title={!canRequest ? '날짜/시간을 먼저 선택해주세요' : '예약하기'}
                    >
                        예약하기
                    </button>
                </div>
            </div>

            <ModalIos
                isOpen={open}
                handleModalState={handleClose}
                title="예약 요청 보내기"
                leftComment={!infoData ? (busy ? '전송 중...' : '예약 요청 보내기') : undefined}
                leftAction={!infoData ? (busy ? undefined : confirmAction) : undefined}
                width="330px"
                height="520px"
            >
                {infoData ? (
                    <div className="flex flex-col justify-center items-center h-[370px] text-[14px] ">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3 custom-card">
                            <svg
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
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
                        {actionMsg && (
                            <div className="mt-3 text-[12px] text-gray-600 text-center px-4">{actionMsg}</div>
                        )}
                    </div>
                ) : (
                    <div className="relative  w-full p-3 h-[400px] overflow-y-scroll no-scrollbar">
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
                                <div className="flex flex-wrap gap-1.5">
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
        </div>
    );
};

export default ListBox2;
