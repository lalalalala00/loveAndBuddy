import WeeklyCalendarCard from './weekly.calendar.card';
import { useBooking } from '@/context/useBookingContext';
import { useEffect, useMemo, useState } from 'react';
import ModalIos from '@/common/modal.ios';
import NameTag from '@/common/name.tag';
import { CardOverviewRow } from './data/cards';
import { supabase } from '@/lib/supabaseClient';
import { Certificate } from '@/utils/sign';
import { Booking, EMPTY_USER } from '@/utils/data';
import { useUserState } from '@/context/useUserContext';

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

type Props = { list: CardOverviewRow };

const ListBox2 = ({ list }: Props) => {
    const { state, timeDate } = useBooking();
    const { getUser } = useUserState();

    const [open, setOpen] = useState(false);
    const [infoDone, setInfoDone] = useState(false);
    const [busy, setBusy] = useState(false);
    const [actionMsg, setActionMsg] = useState<string | null>(null);
    const [infoData, setInfoData] = useState(false);

    const [buddyBooking, setBuddyBooking] = useState<Booking>({
        user: EMPTY_USER,
        date: 0,
        location: '',
        place: '',
        uuid: '',
        buddy: EMPTY_USER,
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
            location: state.draft.location ?? '',
            place: state.draft.place ?? '',
            buddy: {
                uuid: list.user_id,
                name: list.name,
                avatar_url: list.avatar_url ?? '',
                type: list.type,
                user_birth_year: list.user_birth_year ?? '0000',
                user_comment: list.user_comment ?? '화이팅',
            },
        }));
    }, [open, state.draft, list, getUser]);

    const handleClose = () => {
        setInfoData(false);
        setOpen(false);
        setActionMsg(null);
        setInfoDone(false);
    };

    const isValidDate = (v?: string | null) => !!v && /^\d{4}-\d{2}-\d{2}$/.test(v);

    const isValidTimeOrRange = (v?: string | null) =>
        !!v && /^([01]\d|2[0-3]):[0-5]\d(\~([01]\d|2[0-3]):[0-5]\d)?$/.test(v!);

    const canRequest = Boolean(timeDate && isValidDate(state.draft.date) && isValidTimeOrRange(state.draft.time));

    const confirmAction = async () => {
        setActionMsg(null);

        if (!canRequest) {
            setInfoData(true);
            setInfoDone(true);
            setActionMsg('대화 시작 준비 완료! 날짜/시간을 선택하시면 실제 예약 요청으로 전환돼요.');
            return;
        }

        setBusy(true);
        try {
            const startISO = combineDateTimeToISO(state.draft.date, state.draft.time);
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

                <div className="p-2 flex flex-col gap-2 min-h-[245px] overflow-visible">
                    <div>
                        <div className="text-[12px] text-gray-500 ml-1 mt-2 px-2">
                            📸 사진촬영동의 · 🪪 신원인증 · ✔️ 인성검사완료
                        </div>

                        <WeeklyCalendarCard availability={{ startHour: 9, endHour: 22 }} />

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
                        className={`btn-card custom-card w-full rounded-lg py-2 text-[14px] cursor-pointer !bg-[#e6e6e6] ${!canRequest ? 'opacity-60 cursor-not-allowed' : ''}`}
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
                height="500px"
            >
                {infoData ? (
                    <div className="flex flex-col justify-center items-center h-[370px] text-[14px]">
                        <span>예약 요청 보내기 완료!</span>
                        <span>
                            답장이 오면 <b>버디토키</b>에서 알려드릴게요!
                        </span>
                        {actionMsg && <div className="mt-3 text-[12px] text-gray-600">{actionMsg}</div>}
                    </div>
                ) : (
                    <div className="flex flex-col justify-between items-start p-3 h-full">
                        <div className="h-full w-full">
                            <h3 className="text-[15px] font-semibold mb-2">예약 정보 확인</h3>
                            <ul className="text-[14px] text-gray-700 space-y-1 mb-3">
                                <li>버디: {buddyBooking?.buddy.name ?? '-'}</li>
                                <li>반려동물: {state.draft.pet?.name ?? '-'}</li>
                                <li>동네: {state.draft.location ?? '-'}</li>
                                <li>장소: {state.draft.place ?? '-'}</li>
                                <li>
                                    일시: {state.draft.date ?? '-'} {state.draft.time ?? ''}
                                </li>
                            </ul>
                            {actionMsg && <div className="mt-2 text-[12px] text-rose-600">{actionMsg}</div>}
                        </div>

                        <div className="mt-2 text-[12px] text-right w-full">
                            {!timeDate && (
                                <span className="text-gray-500">날짜/시간을 선택하면 예약하기로 전환돼요</span>
                            )}
                        </div>
                    </div>
                )}
            </ModalIos>
        </div>
    );
};

export default ListBox2;
