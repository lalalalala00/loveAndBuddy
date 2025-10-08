import { Option } from '@/common/selected.box';
import { Dispatch, SetStateAction, useState } from 'react';
import ModalIos from './modal.ios';
import PlaceSelectedBox from '@/app/find/_components/place.selected.box';

const SelectedPlace = ({ setLocation }: { setLocation: Dispatch<SetStateAction<Option[]>> }) => {
    const [selectedAddr, setSelectedAddr] = useState<Option[]>([]);
    const [draftAddr, setDraftAddr] = useState<Option[]>([]);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

    const openChangeModal = () => {
        setDraftAddr([]);
        setIsLocationModalOpen(true);
    };

    const removeDong = (code: string) => setSelectedAddr((prev) => prev.filter((x) => x.code !== code));

    const confirmChange = () => {
        setSelectedAddr(draftAddr);
        setIsLocationModalOpen(false);
        setLocation(draftAddr);
    };

    return (
        <div>
            {selectedAddr.length >= 1 ? (
                <div className="flex">
                    {selectedAddr.map((item) => (
                        <button
                            key={item.code}
                            className="px-4 py-2 mr-3 rounded-full btn-card text-[13px] bg-white border-2 cursor-pointer"
                            onClick={() => removeDong(item.name)}
                        >
                            {item.name} <span className="text-[12px] font-semibold ml-2"> ✕</span>
                        </button>
                    ))}

                    <button onClick={openChangeModal}>
                        <span className="text-[12px]">동네 변경하기</span>
                    </button>
                </div>
            ) : (
                <button onClick={openChangeModal}>
                    <span className="text-[14px]">📍 동네가 설정되지 않았습니다.</span>
                    <span className="border-2 border-dashed border-gray-200 text-[14px] bg-white px-2 py-1 rounded-xl ml-2">
                        설정하기
                    </span>
                </button>
            )}

            <ModalIos
                isOpen={isLocationModalOpen}
                handleModalState={() => setIsLocationModalOpen(false)}
                title="어느 동네에서 버디를 찾으시나요?"
                width="400px"
                height="600px"
                leftComment="선택하기"
                leftAction={confirmChange}
            >
                <PlaceSelectedBox setSelectedAddr={setDraftAddr} />
            </ModalIos>
        </div>
    );
};

export default SelectedPlace;
