import NameTag, { NameTagInfoMinimal } from '@/common/name.tag';

const AsapBoxLove = ({ list }: { list: NameTagInfoMinimal }) => {
    const firstAnimal = list.animals?.[0] ?? {};

    return (
        <div className="relative border border-[#e3ecdc] bg-white/80 shadow p-3 rounded-2xl my-4">
            <NameTag love asap info={list} />
            <div className="border-t w-full border-[#e6e6e6] py-0.5 mt-0.5" />
            <div className="flex flex-col text-[13px] items-start w-full px-1 mt-2">
                <div className="flex justify-between w-full items-center">
                    <span>🕒 시간 </span>
                    <span className="font-medium">
                        {list.date}_{list?.start_time} ~ {list?.end_time}
                    </span>
                </div>

                <div className="flex justify-between w-full items-center">
                    <span>📍 동네</span>
                    <span className="font-medium">{list?.location}</span>
                </div>
                <div className="flex justify-between w-full items-center">
                    <span>🏠 장소</span>
                    <span className="font-medium">{list?.place}</span>
                </div>

                <div className="border-t w-full border-[#e6e6e6] py-0.5 mt-1" />
                <span className="text-gray-800">
                    🐾 {list?.animals && list?.animals.map((item) => item.name).join(', ')}의 한마디
                </span>
                <span className="ml-3 font-semibold">{firstAnimal?.comment} ❣</span>
            </div>

            <button className="mt-3 text-[12px] cursor-pointer custom-card custom-card-hover w-full px-4 py-1 rounded-2xl transition">
                대화하기
            </button>
        </div>
    );
};

export default AsapBoxLove;
