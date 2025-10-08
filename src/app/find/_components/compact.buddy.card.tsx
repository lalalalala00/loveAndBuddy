import NameTag, { NameTagInfoMinimal } from '@/common/name.tag';
import { useState } from 'react';
import { CardOverviewRow } from './data/cards';
import BookingModal from './booking.modal';
import { Option } from '@/common/selected.box';
import { SelectedAnimals } from '@/utils/data';

type Props = { list: NameTagInfoMinimal; selectedAnimals: SelectedAnimals[]; location: Option[] };

const CompactBuddyCard = ({ list, selectedAnimals, location }: Props) => {
    const [checkModal, setCheckModal] = useState<boolean>(false);
    const [selectedDT, setSelectedDT] = useState<{ date: string; time: string }>({ date: '', time: '' });
    const [infoData, setInfoData] = useState(false);

    return (
        <div className="relative w-full max-w-[280px] max-md:w-[300px] border border-[#e3ecdc] bg-white/80 shadow px-2 py-2.5 rounded-2xl my-4 flex flex-col  text-[#444]">
            <NameTag imgCss="w-[64px] h-[64px]" find asap info={list} />
            <div className="absolute top-2 right-2 mt-1 text-[10px] text-green-700 bg-[#eaf2e0] px-2 py-[2px] rounded-full">
                ✔️ 인증 완료
            </div>
            <div className="border-t w-full border-[#e6e6e6] py-0.5 mt-0.5" />
            <div className="flex flex-col items-start w-full px-2 text-left text-[12px]">
                <span className="text-gray-800 ">❀ {list.name} 버디의 한마디 -`♡´-</span>
                <span className="ml-3 font-semibold text-black ">{list.user_comment}</span>
            </div>

            <button
                onClick={() => setCheckModal(!checkModal)}
                className="mt-2 text-[12px] cursor-pointer custom-card custom-card-hover w-full px-4 py-1 rounded-2xl transition"
            >
                📅 스케줄 확인하기
            </button>

            <BookingModal
                open={checkModal}
                onClose={() => {
                    setInfoData(false);
                    setCheckModal(false);
                }}
                infoData={infoData}
                setInfoData={setInfoData}
                list={list}
                selectedDT={selectedDT}
                selectedAnimals={selectedAnimals}
                location={location}
                modal
                setSelectedDT={setSelectedDT}
            />
        </div>
    );
};

export default CompactBuddyCard;
