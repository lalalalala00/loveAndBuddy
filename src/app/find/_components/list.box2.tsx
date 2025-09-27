import WeeklyCalendarCard from './weekly.calendar.card';
import { useBooking } from '@/context/useBookingContext';
import { useState } from 'react';
import ModalIos from '@/common/modal.ios';
import NameTag from '@/common/name.tag';
import { CardOverviewRow } from './data/cards';
import { supabase } from '@/lib/supabaseClient';
import { Certificate } from '@/utils/sign';

function combineDateTimeToISO(dateStr?: string | null, timeStr?: string | null) {
    if (!dateStr || !timeStr) return null;
    const [y, m, d] = dateStr.split('-').map(Number);
    const [hh, mm] = timeStr.split(':').map(Number);
    return new Date(y, m - 1, d, hh, mm, 0).toISOString();
}

const ListBox2 = ({ list }: { list: CardOverviewRow }) => {
    const { timeDate, state } = useBooking();

    const [infoData, setInfoData] = useState<boolean>(false);

    const label = timeDate ? '예약하기' : '대화하기';

    const [open, setOpen] = useState(false);
    const [infoDone, setInfoDone] = useState(false);
    const [busy, setBusy] = useState(false);
    const [actionMsg, setActionMsg] = useState<string | null>(null);

    const openActionModal = (userId: string) => {
        setActionMsg(null);
        setInfoDone(false);
        setOpen(true);
    };

    const confirmAction = async (targetUserId: string) => {
        if (!timeDate) {
            setInfoDone(true);
            setActionMsg('대화 시작 준비 완료!');
            return;
        }

        // 예약하기: bookings insert
        setBusy(true);
        setActionMsg(null);
        try {
            const startISO = combineDateTimeToISO(state.draft.date, state.draft.time);
            if (!startISO) throw new Error('날짜/시간이 올바르지 않아요.');

            // 현재 로그인 유저
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) throw new Error('로그인이 필요합니다.');

            const payload: any = {
                // 예약 대상(버디)
                user_id: targetUserId,
                // 예약자(의뢰인) id 등을 저장하고 싶다면 추가 컬럼 필요: requester_id: user.id
                start_at: startISO, // timestamptz
                place: state.draft.place ?? null,
                location: state.draft.location ?? null,
                // 필요 시 pet_id, memo 등 추가
            };

            const { error } = await supabase.from('bookings').insert(payload);
            if (error) throw error;

            setInfoDone(true);
            setActionMsg('예약 요청이 전송되었어요! 답장이 오면 버디토키에서 알려드릴게요.');
        } catch (e: any) {
            setActionMsg(e?.message ?? '예약 요청에 실패했어요.');
        } finally {
            setBusy(false);
        }
    };

    const handleClose = () => {
        setInfoData(false);
        setOpen(false);
    };

    const certs = (list?.certificates_preview ?? []) as Certificate[];
    const bullets = certs.flatMap((cp) => [
        ...(Array.isArray(cp.cert) ? cp.cert.map((t) => `✰ ${t} 보유`) : []),
        ...(cp.issuer ? [`✰ ${cp.issuer} 수료`] : []),
        ...(cp.name ? [`✰ ${cp.name} 인증`] : []),
    ]);

    return (
        <div className="rounded-2xl w-full h-auto shadow ">
            <div className="mb-3 rounded-2xl w-full h-auto shadow ">
                <div className="flex flex-col items-center bg-[rgb(246,246,246)] border-b border-[rgb(227,227,227)] rounded-t-2xl">
                    <NameTag imgCss="w-[60px] h-[60px]" find info={list} />
                </div>
                <div className="p-2 flex flex-col gap-2 min-h-[245px] overflow-visible">
                    <div className="">
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
                        onClick={() => setOpen(!open)}
                        className={`btn-card custom-card w-full rounded-lg py-2  text-[14px] cursor-pointer ${timeDate ? '' : '!bg-[#e6e6e6]'}`}
                    >
                        {label}
                    </button>
                </div>
            </div>

            <ModalIos
                isOpen={open}
                handleModalState={handleClose}
                title={timeDate ? '예약 요청 보내기' : '대화하기'}
                leftComment={!infoData ? (timeDate ? '예약 요청 보내기' : '대화하기') : undefined}
                leftAction={
                    !infoData
                        ? () => {
                              if (timeDate) {
                              }
                              setInfoData(true);
                          }
                        : undefined
                }
                width="330px"
                height="500px"
            >
                {infoData ? (
                    <div className="flex flex-col justify-center items-center h-[370px] text-[14px]">
                        <span>예약 요청 보내기 완료!</span>
                        <span>
                            답장이 오면 <b>버디토키</b>에서 알려드릴게요!
                        </span>
                    </div>
                ) : (
                    <div className="flex flex-col justify-between items-start p-3 h-full">
                        <div className="h-full">
                            <h3 className="text-[15px] font-semibold mb-2">예약 정보 확인</h3>
                            <ul className="text-[14px] text-gray-700 space-y-1 mb-3 flex flex-col justify-start items-start">
                                <li>버디: {state.draft.buddy?.name ?? '-'}</li>
                                <li>반려동물: {state.draft.pet?.name ?? '-'}</li>
                                <li>동네: {state.draft.pet?.name ?? '-'}</li>
                                <li>장소: {state.draft.pet?.name ?? '-'}</li>
                                <li>
                                    일시: {state.draft.date ?? '-'} {state.draft.time ?? ''}
                                </li>
                            </ul>
                        </div>

                        <div className="mt-2 text-[12px] text-right">
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
