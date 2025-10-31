'use client';

import { useUserState } from '@/context/useUserContext';

const Index = () => {
    const { getUser, animals } = useUserState();
    return (
        <div className="flex flex-col mt-5 mb-8 rounded-2xl bg-[#fefefe] border-2 border-[#fafdf4] shadow-[4px_4px_10px_#f7f9f6,-4px_-4px_10px_#ffffff]">
            <div className="flex justify-center items-center text-center px-6 py-4 border-b border-gray-200 text-[15px] mb-16 font-semibold text-gray-700">
                -`♥´- our.dailyMoments_〘 {getUser ? animals.map((a) => a.name).join(', ') : '???'} 〙 -`♥´-
            </div>

            <div className="h-[500px] flex justify-center items-center">
                <h5 className="text-sm mb-10">
                    서비스 준비 중이에요 💫 곧, 러브와 버디들의 이야기가 이곳에 피어날 거예요 🌼
                </h5>
            </div>
        </div>
    );
};
export default Index;
