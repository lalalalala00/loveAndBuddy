'use client';

import { Animal } from '@/utils/sign';
import React from 'react';

export default function EmptyMonthState({ animals, selectedDate }: { animals: Animal[]; selectedDate: string }) {
    const imgs = animals.map((a) => a.img).filter(Boolean) as string[];

    const emptyMessage = (selectedDate: string) => {
        const today = new Date();
        const [y, m] = selectedDate.split('-').map(Number);

        const selected = new Date(y, m - 1, 1);

        const diff = selected.getTime() - new Date(today.getFullYear(), today.getMonth(), 1).getTime();

        if (diff > 0) {
            return '이 달의 이야기는 아직 시작되지 않았어요. 곧 새로운 디얼러브로 채워질 거예요 ✿';
        } else if (diff < 0) {
            return '그 달의 디얼러브는 기록되지 않았지만, 마음속에 소중히 남아있을 거예요 ♡';
        } else {
            return '이 달의 이야기는 아직 남겨지지 않았어요. 지금 이 순간을 기록해보는 건 어떨까요?';
        }
    };

    return (
        <section className="mx-auto max-w-[980px] px-4 mt-8">
            <div className=" flex items-center justify-center">
                <div className="">
                    <p className="text-center text-[14px] md:text-[15px] text-[#5b7551] font-medium">
                        {emptyMessage(selectedDate)}
                    </p>
                </div>
            </div>

            <div className=" shadow-[6px_8px_24px_#eef6e6,inset_-6px_-8px_24px_#ffffff]">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1 p-2">
                    {imgs.length > 0 ? (
                        imgs.map((src, i) => (
                            <div key={i} className="relative aspect-square rounded-2xl overflow-hidden">
                                <img
                                    src={src}
                                    alt=""
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-cover scale-[1.02]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full flex items-center justify-center p-10">
                            <div className="w-28 h-28 rounded-full bg-white/80 border border-[#e3ecdc] shadow-inner flex items-center justify-center">
                                <span className="text-[#5b7551] font-bold text-2xl">
                                    {(animals[0]?.name ?? 'Love').slice(0, 2)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 flex justify-center">
                <div className="px-4 py-2 rounded-xl border border-[#e3ecdc] bg-white shadow-sm text-[13px] text-gray-700">
                    오늘 {animals.map((a) => a.name).join(', ')}와 함께한 기록해 보세요. 사진을 업로드하면 이 달의
                    디얼러브가 채워져요 ✦
                </div>
            </div>
        </section>
    );
}
