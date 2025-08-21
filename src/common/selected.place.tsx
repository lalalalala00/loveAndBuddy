import { Option } from '@/common/selected.box';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import ModalIos from './modal.ios';
import PlaceSelectedBox from '@/app/find/_components/place.selected.box';

const SelectedPlace = () => {
    const [selectedAddr, setSelectedAddr] = useState<Option[]>([]);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

    const removeDong = (code: string) => setSelectedAddr((prev) => prev.filter((x) => x.code !== code));

    return (
        <div>
            {selectedAddr.length >= 1 ? (
                <div className="flex">
                    {selectedAddr.map((item, i) => (
                        <button
                            key={i}
                            className="px-4 py-2 mr-3 rounded-full  
                                btn-card text-[13px] bg-white border-2 cursor-pointer"
                            onClick={() => removeDong(item.code)}
                        >
                            {item.name} <span className="text-[12px] font-semibold ml-2"> ✕</span>
                        </button>
                    ))}
                    <button onClick={() => setIsLocationModalOpen(!isLocationModalOpen)}>
                        <span className="text-[12px]">동네 변경하기</span>
                    </button>
                </div>
            ) : (
                <button onClick={() => setIsLocationModalOpen(!isLocationModalOpen)}>
                    <span className="text-[14px]">📍 동네가 설정되지 않았습니다.</span>
                    <span className="border-2 border-dashed border-gray-200 text-[14px] px-2 py-1 rounded-xl ml-2">
                        설정하기
                    </span>
                </button>
            )}

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

export default SelectedPlace;
