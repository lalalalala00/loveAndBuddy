'use client';

import AnimalSelectedForm from '@/common/animal.select.form';

import ImportSchedule from './import.schedule';
import ImportPhoto from './import.photo';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserState } from '@/context/useUserContext';

const WriteLove = () => {
    const router = useRouter();
    const { getUser, animals } = useUserState();
    const [toastOpen, setToastOpen] = useState(false);

    useEffect(() => {
        if (!toastOpen) return;
        const t = setTimeout(() => router.push('/dearLove'), 1000);
        return () => clearTimeout(t);
    }, [toastOpen, router]);

    return (
        <div className="flex h-full justify-between items-center flex-col py-5 mt-5 mb-8 pb-10 rounded-2xl bg-[#fefefe] border-2 border-[#fafdf4] shadow-[4px_4px_10px_#f7f9f6,-4px_-4px_10px_#ffffff]">
            <div className="flex flex-col w-[55%] border border-gray-100 py-3 px-4 rounded-lg bg-[#fefefe] ">
                {getUser && getUser.type !== 'buddy' && <AnimalSelectedForm dear />}
                <ImportSchedule />
                <ImportPhoto />
                <div className="h-[96px] shadow rounded-xl p-3 mb-3 bg-[#f5f7ee81] border-[#e3ecdc] border flex flex-col">
                    <span>❀ 제목을 적어주세요.</span>
                    <input
                        className="w-full  bg-white rounded-xl shadow mt-2 border-0 resize-none p-2 focus:outline-0 px-3"
                        placeholder="예) 샤넬이와 첫 산책"
                    />
                </div>
                <div className="h-[220px] shadow rounded-xl p-3 mb-3 bg-[#f5f7ee81] border-[#e3ecdc] border flex flex-col">
                    <span>❀ 러브와의 하루를 적어주세요 -`♡´-</span>
                    <textarea className="w-full h-[200px] bg-white rounded-xl shadow mt-2 border-0 resize-none p-2 focus:outline-0 px-3" />
                </div>
                <button
                    onClick={() => setToastOpen(!toastOpen)}
                    className="custom-card w-full h-12 rounded-2xl custom-card-hover cursor-pointer mt-8"
                >
                    등록하기
                </button>
            </div>
            <CenterToast open={toastOpen} comment="기록은 dear.Love에서 확인할 수 있어요." />
        </div>
    );
};

export function CenterToast({ open, comment }: { open: boolean; comment: string }) {
    return (
        <div
            aria-live="polite"
            aria-atomic="true"
            className={[
                'pointer-events-none fixed inset-0 z-[60] flex items-start justify-center',
                'pt-[20vh] transition-opacity duration-200',
                open ? 'opacity-100' : 'opacity-0',
            ].join(' ')}
        >
            <div
                className={[
                    'px-8 py-5 rounded-xl shadow-lg border border-[#e3ecdc]',
                    'bg-white/95 backdrop-blur text-[14px] font-medium text-gray-800',
                    'animate-[toastPop_140ms_ease-out]',
                ].join(' ')}
            >
                <div className="flex flex-col items-center">
                    <div
                        className={[
                            'w-16 h-16 mb-3 rounded-full flex items-center justify-center',
                            'custom-card text-[#5b7f3e]',
                        ].join(' ')}
                        aria-hidden
                    >
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M20 7L9 18L4 13"
                                stroke="currentColor"
                                strokeWidth="2.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <span>등록이 완료되었어요!</span>
                    <span>{comment}</span>
                </div>
            </div>

            <style jsx>{`
                @keyframes toastPop {
                    0% {
                        transform: translateY(6px) scale(0.98);
                        opacity: 0;
                    }
                    100% {
                        transform: translateY(0) scale(1);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
}

export default WriteLove;
