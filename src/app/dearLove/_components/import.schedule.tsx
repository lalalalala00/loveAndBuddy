'use client';

import ModalIos from '@/common/modal.ios';

import { useState } from 'react';

const ImportSchedule = () => {
    const [scheduleModal, setScheduleModal] = useState<boolean>(false);
    return (
        <div className="flex w-full">
            <div className="h-[50px] w-full shadow rounded-xl p-3 mb-3 bg-[#f5f7ee81]">
                <span>일정</span>
            </div>
            <button
                onClick={() => setScheduleModal(!scheduleModal)}
                className="flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-3 mb-3 h-full text-[14px] w-1/3 ml-3"
            >
                <span>+ 일정 가져오기</span>
            </button>
            <ModalIos
                isOpen={scheduleModal}
                handleModalState={() => setScheduleModal(false)}
                title="일정 가져오기"
                width="400px"
                height="60%"
                leftAction={() => console.log('schedule')}
                leftComment="일정 추가하기"
            >
                <div className="p-2">love, date, time, place</div>
            </ModalIos>
        </div>
    );
};

export default ImportSchedule;
