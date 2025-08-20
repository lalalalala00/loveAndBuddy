'use client';

import NameTag from '@/common/name.tag';
import SelectedPlace from '@/common/selected.place';
import { Filters } from '@/utils/date';
import { useState } from 'react';

function cx(...c: (string | false | null | undefined)[]) {
    return c.filter(Boolean).join(' ');
}

const WriteBuddy = () => {
    const [saveBase, setSaveBase] = useState<boolean>(false);
    const [buddyComment, setBuddyComment] = useState<string>('');
    const [species, setSpecies] = useState<Filters['species']>('all');

    return (
        <div className="flex h-full justify-between items-center flex-col mt-5 mb-8 pb-10 rounded-2xl bg-[#fefefe] border-2 border-[#fafdf4] shadow-[4px_4px_10px_#f7f9f6,-4px_-4px_10px_#ffffff]">
            <div className="flex items-center w-full rounded-t-2xl">
                <NameTag find asap small />
                <button>버디 정보 가져오기</button>
            </div>
            <div className="border-t w-full border-[#e6e6e6] py-0.5 mt-1" />
            <div className="flex flex-col items-center w-full justify-between mt-6 h-[600px]">
                <div className="flex flex-col w-1/2">
                    <div className="flex items-center shadow rounded-xl p-3 mb-3 bg-[#f5f7ee81] p-1">
                        {[
                            { k: 'all', n: '전체' },
                            { k: 'dog', n: '강아지' },
                            { k: 'cat', n: '고양이' },
                            { k: 'others', n: '다른 친구들' },
                        ].map((opt) => (
                            <button
                                key={opt.k}
                                className={cx(
                                    'px-3 py-1.5 rounded-full text-[14px] cursor-pointer',
                                    species === (opt.k as Filters['species'])
                                        ? 'bg-[#aec3991e] border-[#aec399] text-green-800'
                                        : 'text-gray-700',
                                )}
                                onClick={() => setSpecies(opt.k as Filters['species'])}
                                aria-pressed={species === opt.k}
                            >
                                {opt.n}
                            </button>
                        ))}
                    </div>

                    <div className="h-[60px] shadow rounded-xl p-3 mb-3 bg-[#f5f7ee81] flex items-center">
                        <SelectedPlace />
                    </div>
                    <div className="h-[130px] shadow rounded-xl p-3 mb-3 bg-[#f5f7ee81]">
                        <span>자격증 정보</span>
                        <div className="flex mt-2 px-1">
                            <div className="w-3/5 flex flex-col text-[14px]">
                                <span>✰ 수의간호 교원자격증 보유</span>
                                <span>✰ 애완동물관리 직무능력 인증서 보유</span>
                                <span>✰ 펫시터 전문가 교육 수료</span>
                            </div>
                            <div className="w-2/5 bg-white rounded-xl ml-2 p-2 flex items-center justify-center shadow cursor-pointer hover:border-2 hover:border-dashed hover:border-gray-200">
                                <button className="text-[13px]">+ 자격증 추가하기</button>
                            </div>
                        </div>
                    </div>
                    <div className="h-[130px] shadow rounded-xl p-3 mb-3 bg-[#f5f7ee81] flex flex-col">
                        <span>❀ 00 버디의 한마디 -`♡´-</span>
                        <textarea
                            className="w-full h-[100px] bg-white rounded-xl shadow mt-2 border-0 resize-none p-2 focus:outline-0 px-3"
                            onChange={(e) => setBuddyComment(e.target.value)}
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
                        버디 등록하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WriteBuddy;
