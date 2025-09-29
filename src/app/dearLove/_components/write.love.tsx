'use client';

import AnimalSelectedForm from '@/common/animal.select.form';

import ImportSchedule from './import.schedule';
import ImportPhoto from './import.photo';
import { useState } from 'react';

const WriteLove = () => {
    const [comment, setComment] = useState<string>('');
    return (
        <div className="flex h-full justify-between items-center flex-col py-5 mt-5 mb-8 pb-10 rounded-2xl bg-[#fefefe] border-2 border-[#fafdf4] shadow-[4px_4px_10px_#f7f9f6,-4px_-4px_10px_#ffffff]">
            <div className="flex flex-col w-[55%] border border-gray-200 py-3 px-4 rounded-lg shadow bg-[#fefefe] ">
                <AnimalSelectedForm dear />
                <ImportSchedule />
                <ImportPhoto />
                <div className="h-[96px] shadow rounded-xl p-3 mb-3 bg-[#f5f7ee81] border-[#e3ecdc] border flex flex-col">
                    <span>❀ 제목을 적어주세요.</span>
                    <input
                        className="w-full  bg-white rounded-xl shadow mt-2 border-0 resize-none p-2 focus:outline-0 px-3"
                        onChange={(e) => setComment(e.target.value)}
                    />
                </div>
                <div className="h-[220px] shadow rounded-xl p-3 mb-3 bg-[#f5f7ee81] border-[#e3ecdc] border flex flex-col">
                    <span>❀ 러브와의 하루를 적어주세요 -`♡´-</span>
                    <textarea
                        className="w-full h-[200px] bg-white rounded-xl shadow mt-2 border-0 resize-none p-2 focus:outline-0 px-3"
                        onChange={(e) => setComment(e.target.value)}
                    />
                </div>
                <button className="custom-card w-full h-12 rounded-2xl custom-card-hover cursor-pointer mt-8">
                    등록하기
                </button>
            </div>
        </div>
    );
};

export default WriteLove;
