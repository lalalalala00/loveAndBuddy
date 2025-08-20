'use client';

import NameTag from '@/common/name.tag';
import SelectedPlace from '@/common/selected.place';
import { Filters } from '@/utils/date';
import { useState } from 'react';

function cx(...c: (string | false | null | undefined)[]) {
    return c.filter(Boolean).join(' ');
}

const WriteLove = () => {
    const [saveBase, setSaveBase] = useState<boolean>(false);
    const [loveComment, setLoveComment] = useState<string>('');
    const [location, setLocation] = useState<boolean>(false);

    return (
        <div className="flex h-full justify-between items-center flex-col mt-5 mb-8 pb-10 rounded-2xl bg-[#fefefe] border-2 border-[#fafdf4] shadow-[4px_4px_10px_#f7f9f6,-4px_-4px_10px_#ffffff]">
            <div className="flex items-center w-full rounded-t-2xl">
                <NameTag love asap small />
                <button>러브 정보 가져오기</button>
            </div>
            <div className="border-t w-full border-[#e6e6e6] py-0.5 mt-1" />
            <div className="flex flex-col items-center w-full justify-between mt-6 h-[600px]">
                <div className="flex flex-col w-1/2">
                    <div className="flex items-center shadow rounded-xl p-3 mb-2 bg-[#f5f7ee81] p-2">
                        <span>[대표] 샤넬 --- 정보</span>
                    </div>
                    <button className="flex items-center border-2 border-dashed border-gray-200 rounded-xl p-3 mb-3  p-1">
                        <span>+ 반려동물 추가하기</span>
                    </button>

                    <div className="h-[60px] shadow rounded-xl p-3 mb-3 bg-[#f5f7ee81] flex items-center">
                        <SelectedPlace />
                    </div>
                    <div className="h-[110px] shadow rounded-xl p-3 mb-3 bg-[#f5f7ee81] flex flex-col">
                        <span>❀ 장소</span>
                        <div className="flex mt-3 px-2">
                            <button className="flex flex-col border p-2 flex justify-center items-center">집</button>
                            <button className="flex flex-col">
                                그 외 <span className="text-[12px]">ex) 애견카페, 공원 등</span>
                            </button>
                        </div>
                    </div>
                    <div className="h-[130px] shadow rounded-xl p-3 mb-3 bg-[#f5f7ee81] flex flex-col">
                        <span>❀ 00의 한마디 -`♡´-</span>
                        <textarea
                            className="w-full h-[100px] bg-white rounded-xl shadow mt-2 border-0 resize-none p-2 focus:outline-0 px-3"
                            onChange={(e) => setLoveComment(e.target.value)}
                        />
                    </div>
                </div>

                <div className="w-1/2">
                    <button
                        onClick={() => setSaveBase(!saveBase)}
                        className="mb-2 flex justify-end items-center w-full cursor-pointer"
                    >
                        <div className={`w-3 h-3 border rounded-sm mr-1 mb-0.5 ${saveBase ? 'bg-gray-400' : ''}`}></div>
                        <span className="text-[14px]">기본 정보로 저장하기</span>
                    </button>
                    <button className="custom-card w-full h-12 rounded-2xl custom-card-hover cursor-pointer">
                        등록하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WriteLove;
