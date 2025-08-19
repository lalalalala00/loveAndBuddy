import LoveNameTag from '@/common/love.name.tag';
import NameTag from '@/common/name.tag';

const AsapBoxLove = () => {
    const love = {
        nickname: 'chanelu',
        level: 9,
        mannerScore: 10,
        dearLove: 24,
        profileImg: '/cha/8.jpg',
        loveId: 'chacha',
        ownerName: '탁은지',
        loveName: '샤넬',
        loveOld: 12,
    };
    return (
        <div className="relative custom-card-bg-white p-3 rounded-2xl my-4">
            <NameTag love asap />
            <div className="border-t w-full border-[#e6e6e6] py-0.5 mt-0.5" />
            <div className="flex flex-col text-[12px] items-start w-full px-1 mt-2">
                <div className="flex justify-between w-full items-center">
                    <span>🕒 시간 </span>
                    <span className="font-medium">25.08.05_16:00 ~ 20:00</span>
                </div>

                <div className="flex justify-between w-full items-center">
                    <span>📍 동네</span>
                    <span className="font-medium">유성구 원신흥동</span>
                </div>
                <div className="flex justify-between w-full items-center">
                    <span>🏠 장소</span>
                    <span className="font-medium">애견카페 [잘놀아]</span>
                </div>
                {/* 
                <div className="border-t w-full border-[#e6e6e6] py-0.5 mt-0.5" />
                <span className="text-gray-800">🐾 샤넬이의 한마디</span>
                <span className="ml-3 font-semibold">풀냄새 흙냄새 좋아해요. 뛰는 거 자신 있어요 ❣</span> */}
            </div>

            <button className="mt-3 text-[12px] cursor-pointer custom-card custom-card-hover w-full px-4 py-1 rounded-2xl transition">
                대화하기
            </button>
        </div>
    );
};

export default AsapBoxLove;
