import { useState } from 'react';
import { getTodayYYYYMMDDSeoul } from './import.schedule';
import { Animal } from '@/utils/sign';

export type SchedulePick = {
    id: string;
    animals?: Animal[];
    buddyName?: string; // 상단 라벨 등
    neighborhood?: string; // 동네
    place?: string; // 장소
    date?: string; // 'yyyy-mm-dd'
    timeStart?: string; // 'HH:MM'
    timeEnd?: string; // 'HH:MM'
};

export function ScheduleImportModal({
    items, // 여러 후보
    onImport, // 카드 클릭 시 부모로 값 전달
}: {
    items?: SchedulePick[];
    onImport: (v: {
        date?: string;
        timeStart?: string;
        timeEnd?: string;
        place?: string;
        neighborhood?: string;
    }) => void;
}) {
    return (
        <div className="p-2  bg-[#f5f7ee81] h-[490px] overflow-y-scroll">
            {items?.map((it) => (
                <button
                    key={it.id}
                    type="button"
                    onClick={() =>
                        onImport({
                            date: it.date,
                            timeStart: it.timeStart,
                            timeEnd: it.timeEnd,
                            place: it.place,
                            neighborhood: it.neighborhood,
                        })
                    }
                    className="p-3 border border-[#e3ecdc] bg-white/80 rounded-2xl shadow-sm hover:shadow-md transition w-full"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center">
                            <div className="flex -space-x-2">
                                <img
                                    src="/placeholder/avatar.png"
                                    className={`rounded-full w-9 h-9`}
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                        </div>
                        <div className="min-w-0">
                            <div className="text-[15px] font-semibold text-[#475a43] truncate">샤넬</div>
                        </div>
                    </div>
                    <div className="min-w-0">
                        <div className="text-[15px] text-left font-semibold truncate mb-1 mx-1">
                            {it.buddyName} buddy
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-[#f5f7ee81] border border-[#e3ecdc] rounded-xl px-3 py-2">
                            <div className="text-[11px] text-gray-500 mb-0.5">동네</div>
                            <div className="text-sm text-gray-800 truncate">{it.neighborhood || '-'}</div>
                        </div>
                        <div className="bg-[#f5f7ee81] border border-[#e3ecdc] rounded-xl px-3 py-2">
                            <div className="text-[11px] text-gray-500 mb-0.5">장소</div>
                            <div className="text-sm text-gray-800 truncate">{it.place || '-'}</div>
                        </div>
                        <div className="bg-[#f5f7ee81] border border-[#e3ecdc] rounded-xl px-3 py-2">
                            <div className="text-[11px] text-gray-500 mb-0.5">날짜 · 시간</div>
                            <div className="text-sm text-gray-800">
                                {/* {formatCardDate(it.date, it.timeStart, it.timeEnd)} */}
                            </div>
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );
}
