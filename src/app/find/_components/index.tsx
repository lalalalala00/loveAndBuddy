'use client';

import { useEffect, useState } from 'react';

import AsapBoxBuddy from './asap.box.buddy';
import AsapBoxLove from './asap.box.love';
import ListBox2 from './list.box2';
import AsapBoxBuddy2 from './asap.box.buddy2';
import CompactBuddyCard from './compact.buddy.card';
import PlaceSelectedBox from './place.selected.box';
import ModalIos from '@/common/modal.ios';
import { Option } from '@/common/selected.box';

const Index = () => {
    const [selectedType, setSelectedType] = useState<number>(1);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [selectedAddr, setSelectedAddr] = useState<Option[]>([]);

    useEffect(() => {
        if (isLocationModalOpen) {
            setSelectedAddr([]);
        }
    }, [isLocationModalOpen]);

    return (
        <div className="flex flex-col mt-5 mb-8 pb-10 rounded-2xl bg-[#fefefe] border-2 border-[#fafdf4] shadow-[4px_4px_10px_#f7f9f6,-4px_-4px_10px_#ffffff]">
            <div className="flex justify-center items-center text-center px-6 py-4 border-b border-gray-200 text-[15px] mb-16 font-semibold text-gray-700">
                -`♥´- find.MyDearDay_〘
                <div className="px-2 flex items-center">
                    {type.map((item, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedType(item.value)}
                            className={`${item.value === selectedType ? 'custom-card' : 'custom-card-bg-white'} px-7 py-1 rounded-xl mr-3 last:mr-0`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
                〙 -`♥´-
            </div>
            <div className="flex  justify-end items-center px-5 mb-3">
                <div className="flex items-center justify-between w-[920px]">
                    {selectedAddr.length >= 1 ? (
                        <div className="flex">
                            {selectedAddr.map((item, i) => (
                                <button
                                    className="px-4 py-2 mr-3 rounded-full  
                                btn-card text-[13px]"
                                >
                                    {item.name}
                                </button>
                            ))}
                            <button onClick={() => setIsLocationModalOpen(!isLocationModalOpen)}>
                                <span className="text-[12px]">동네 변경하기</span>
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setIsLocationModalOpen(!isLocationModalOpen)}>
                            <span>📍 동네가 설정되지 않았습니다. [설정하기]</span>
                        </button>
                    )}
                    <button className="text-[14px]"> 하트수 | 디얼러브 | 매너점수 | 신뢰도 | 여성 | 남성</button>
                </div>
            </div>
            <div className="flex px-5">
                <div className="w-1/4 mr-5 rounded-2xl shadow-md bg-[#f3f7ee] p-4 min-w-[306px]">
                    <div className="relative mb-3 px-1 py-2 rounded-xl bg-gradient-to-br from-[#e3ecdc]/90 to-[#f3f7ee]/80 border border-[#d5e2c8] text-[#3c5732] text-center font-semibold text-[14px] tracking-tight shadow-[inset_2px_2px_5px_#ffffff,-2px_-2px_5px_#d5e2c8]">
                        {selectedType === 0 ? (
                            <span className="inline-flex items-center">
                                <div className="text-[18px] animate-pulse mr-2">📍</div>
                                급하게
                                <span className="decoration-[#9dbb80] ml-2">»-buddy→</span>를 찾고 있어요!
                            </span>
                        ) : (
                            <span className="inline-flex items-center text-nowrap">
                                <div className="text-[18px] animate-pulse mr-0.5">🍀</div>
                                신뢰도가 높은
                                <span className="decoration-[#9dbb80] ml-2">buddy</span>를 소개해드릴께요.
                            </span>
                        )}
                    </div>
                    {selectedType === 1 && (
                        <span className=" text-[12px] flex justify-center">
                            <span
                                className="font-bold text-[#333] cursor-pointer mr-1 underline decoration-dotted"
                                title="하트 20개 이상, 디얼러브 20장 이상, 매너점수 8점 이상, 수의 관련 자격증, 펫시터 교육 수료, 반려동물 경험 인증"
                            >
                                6가지 조건을 모두 만족한
                            </span>
                            믿을 수 있는 buddy예요.
                        </span>
                    )}

                    <div className="h-[800px] overflow-y-scroll no-scrollbar">
                        {selectedType === 0 ? (
                            <>
                                <AsapBoxLove />
                            </>
                        ) : (
                            <>
                                <CompactBuddyCard />

                                <AsapBoxBuddy />
                                <AsapBoxBuddy2 />
                                <AsapBoxBuddy />
                            </>
                        )}
                    </div>
                </div>
                <div className="w-3/4 grid grid-cols-3 gap-2">
                    {/* <ListBox /> */}
                    <ListBox2 />
                    <ListBox2 />
                    <ListBox2 />
                </div>
            </div>
            <ModalIos
                isOpen={isLocationModalOpen}
                handleModalState={() => setIsLocationModalOpen(!isLocationModalOpen)}
                title="어느 동네에서 버디를 찾으시나요?"
                width="50%"
                height="50%"
                leftComment="선택하기"
                leftAction={() => setIsLocationModalOpen(!isLocationModalOpen)}
            >
                <PlaceSelectedBox setSelectedAddr={setSelectedAddr} />
            </ModalIos>
        </div>
    );
};

const type = [
    { label: 'buddy', value: 1 },
    { label: 'love', value: 0 },
    // { label: "lovuddy", value: 2 },
];
export default Index;
