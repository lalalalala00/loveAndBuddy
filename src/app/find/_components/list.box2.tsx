import BuddyNameTag from '@/common/buddy.name.tag';
import WeeklyCalendarCard from './weekly.calendar.card';
import { useBooking } from '@/context/useBookingContext';
import { useState } from 'react';
import ModalIos from '@/common/modal.ios';

const ListBox2 = () => {
    const { timeDate, state } = useBooking();

    const [open, setOpen] = useState(false);
    const [infoData, setInfoData] = useState<boolean>(false);

    const label = timeDate ? '예약하기' : '대화하기';

    const buddy = {
        nickname: 'buddy',
        hearts: 2,
        mannerScore: 4,
        dearLove: 28,
        profileImg: '/project/buddy_sit_1.png',
        buddyId: 'buddyId',
    };

    const handleClose = () => {
        setInfoData(false);
        setOpen(false);
    };

    console.log(timeDate);
    return (
        <div className="rounded-2xl w-full h-auto shadow">
            <div className="flex flex-col items-center p-2 bg-[rgb(246,246,246)] border-b border-[rgb(227,227,227)] rounded-t-2xl">
                <img src="/project/buddy_sit_1.png" alt="" className="w-[60px] h-[60px] object-cover rounded-full" />
                <div className="flex items-center px-3 py-1 ">
                    <span className="px-1 inline-block text-[12px] font-semibold">nickname</span>
                    <span className="text-gray-400 text-[12px]">&#62;</span>
                </div>
                <div className="flex items-center gap-1 text-[12px] text-[#666]">ꯁꯧ3 · 🍃4 · 🪪28</div>
            </div>
            <div className="p-2 flex flex-col gap-2 min-h-[245px] overflow-visible">
                <div className="">
                    <div className="text-[12px] text-gray-500 ml-1 mt-2 px-2">
                        📸 사진촬영동의 · 🪪 신원인증 · ✔️ 인성검사완료
                    </div>
                    <WeeklyCalendarCard availability={{ startHour: 9, endHour: 22 }} />
                    <div className="flex flex-col text-[12px] items-start w-full px-2 my-2">
                        <span>✰ 수의간호 교원자격증 보유</span>
                        <span>✰ 애완동물관리 직무능력 인증서 보유</span>
                        <span>✰ 펫시터 전문가 교육 수료</span>
                        <span>✰ 고양이 반려경험 14년 인증</span>
                        <div className="border-t w-full border-[#e6e6e6] py-0.5 mt-0.5" />
                        <span className="text-gray-800">❀ 탁샤넬 버디의 한마디 -`♡´-</span>
                        <span className="ml-3 font-semibold">언제나 내 가족처럼 사랑할께요 ❣</span>
                    </div>
                </div>
                <button
                    onClick={() => setOpen(!open)}
                    className={`btn-card custom-card w-full rounded-lg py-2  text-[14px] cursor-pointer ${timeDate ? '' : '!bg-[#e6e6e6]'}`}
                >
                    {label}
                </button>
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
