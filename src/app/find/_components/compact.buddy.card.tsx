import ModalIos from '@/common/modal.ios';
import NameTag from '@/common/name.tag';
import { useState } from 'react';
import WeeklyCalendarCard from './weekly.calendar.card';

const CompactBuddyCard = () => {
    const [checkModal, setCheckModal] = useState<boolean>(false);

    return (
        <div className="relative w-full max-w-[280px] custom-card-bg-white px-2 py-1 rounded-2xl my-4 flex flex-col  text-[#444]">
            <NameTag imgCss="w-[64px] h-[64px]" find />
            <div className="absolute top-2 right-2 mt-1 text-[10px] text-green-700 bg-[#eaf2e0] px-2 py-[2px] rounded-full">
                ✔️ 인증 완료
            </div>
            <div className="border-t w-full border-[#e6e6e6] py-0.5 mt-0.5" />
            <div className="flex flex-col items-start w-full px-2 text-left text-[12px]">
                <span className="text-gray-800 ">❀ 탁샤넬 버디의 한마디 -`♡´-</span>
                <span className="ml-3 font-semibold ">언제나 내 가족처럼 사랑할께요 ❣</span>
            </div>

            <button
                onClick={() => setCheckModal(!checkModal)}
                className="mt-3 text-[12px] cursor-pointer custom-card custom-card-hover w-full px-4 py-1 rounded-2xl transition"
            >
                📅 스케줄 확인하기
            </button>
            <ModalIos
                isOpen={checkModal}
                handleModalState={() => setCheckModal(!checkModal)}
                title=""
                width="30%"
                height="40%"
            >
                <div className="flex items-center justify-center w-full h-full">
                    <WeeklyCalendarCard modal />
                </div>
            </ModalIos>
        </div>
    );
};

export default CompactBuddyCard;
