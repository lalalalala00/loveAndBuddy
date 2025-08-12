import { at0, getThisWeekRange } from '@/utils/date';
import { useState } from 'react';

export default function WeeklyCalendarCard({ modal }: { modal?: boolean }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const today = new Date();

    const getWeekDays = (date: Date) => {
        const day = date.getDay();
        const monday = new Date(date);
        monday.setDate(date.getDate() - ((day + 6) % 7));

        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            return d;
        });
    };

    const handleDate = (d: Date) => {
        const isPast = at0(d) < t;
        if (isPast) {
            setSelectedDay(null);
        } else {
            setSelectedDay(d.getDate());
        }
    };

    const weekDays = getWeekDays(today);

    const fullMonth = Array.from({ length: 31 }, (_, i) => i + 1);

    const t = at0(today);
    console.log(selectedDay);
    return (
        <div className={`${modal ? 'w-full' : ''} relative bg-[#f7f9f6ee] rounded-t-lg shadow`}>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center pt-1 mt-2 pb-2">
                <div />
                <span className={`justify-self-center  text-gray-600 ${modal ? 'text-[16px] py-2' : 'text-[13px]'}`}>
                    {t.getMonth() + 1}월 일정 확인하기
                </span>
                <button
                    className={`justify-self-end text-gray-500 text-[12px] px-2 rounded-md shadow bg-gray-50 ${modal ? 'mr-3' : ''}`}
                    onClick={() => setIsExpanded((prev) => !prev)}
                >
                    {isExpanded ? '이번주 보기' : '전체 보기'}
                </button>
            </div>

            <div className={` ${isExpanded ? ' ' : ''}`}>
                {!isExpanded ? (
                    <div
                        className={`grid grid-cols-7 text-[12px] border border-[#f3f6f0] rounded-lg
                    divide-x divide-[#f3f6f0] ${modal ? 'h-18' : 'h-8'}`}
                    >
                        {weekDays.map((d, i) => {
                            const isToday = d.toDateString() === today.toDateString();
                            const isSunday = d.getDay() === 0;
                            const selectDay = d.getDate() === selectedDay;

                            return (
                                <div
                                    key={i}
                                    onClick={() => handleDate(d)}
                                    className={[
                                        'cursor-pointer flex flex-col items-center',
                                        at0(d) < t ? 'cursor-not-allowed' : '',
                                        isToday ? 'bg-[#fff]' : '',
                                        selectDay ? 'border border-black rounded-sm' : '',
                                        modal ? 'justify-between' : 'justify-end',
                                    ].join(' ')}
                                >
                                    <span
                                        className={[
                                            'flex items-center justify-center pb-0.5',

                                            at0(d) < t ? 'text-gray-600' : isSunday ? 'text-red-500' : '',
                                            isToday ? 'font-bold' : '',
                                            modal ? 'h-[90%]' : '',
                                        ].join(' ')}
                                    >
                                        {d.getDate()}
                                    </span>
                                    <div
                                        className={[
                                            'h-2 w-[90%] rounded-t-sm',
                                            at0(d) < t ? 'bg-gray-200' : 'bg-[#b2d2a4d8]',
                                        ].join(' ')}
                                    />
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div
                        className="grid grid-cols-7 text-[12px] text-center rounded-b-lg border border-[#fff] bg-white py-2
                  divide-x divide-[#f3f6f0]"
                    >
                        {(() => {
                            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                            const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

                            const startOffset = (firstDay.getDay() + 6) % 7;
                            const totalDays = lastDay.getDate();

                            const daysArray = [
                                ...Array(startOffset).fill(null),
                                ...Array.from({ length: totalDays }, (_, i) => i + 1),
                            ];

                            return daysArray.map((day, idx) => {
                                if (!day) return <div key={`empty-${idx}`} className="h-8" />;

                                const dateObj = new Date(today.getFullYear(), today.getMonth(), day);
                                const isPast = at0(dateObj) < t;
                                const isToday = day === today.getDate();
                                const isSunday = dateObj.getDay() === 0;
                                const isSelected = selectedDay === day;

                                return (
                                    <div
                                        key={day}
                                        onClick={() => {
                                            if (isPast) setSelectedDay(null);
                                            else setSelectedDay(day);
                                        }}
                                        className={[
                                            'cursor-pointer flex justify-end flex-col items-center h-8',
                                            isPast ? 'cursor-not-allowed ' : '',
                                            isToday ? 'bg-[#f3f6f0]' : '',
                                            isSelected ? 'border border-black rounded-sm' : '',
                                        ].join(' ')}
                                        aria-disabled={isPast}
                                        role="button"
                                        tabIndex={isPast ? -1 : 0}
                                    >
                                        <span
                                            className={[
                                                'flex items-center justify-center pb-0.5',
                                                isPast ? 'text-gray-600' : isSunday ? 'text-red-500' : '',
                                                isToday ? 'font-bold' : '',
                                            ].join(' ')}
                                        >
                                            {day}
                                        </span>
                                        <div
                                            className={[
                                                'h-2 w-[90%] rounded-t-sm',
                                                isPast ? 'bg-gray-200' : 'bg-[#b2d2a4]',
                                            ].join(' ')}
                                        />
                                    </div>
                                );
                            });
                        })()}
                    </div>
                )}
            </div>
            {selectedDay !== null && (
                <div className="px-2 py-1">
                    <span className={`${modal ? 'text-[14px] p-2 inline-flex justify-start w-full' : 'text-[13px]'} `}>
                        {selectedDay}일 - 모든 시간 예약 가능
                    </span>
                </div>
            )}
        </div>
    );
}
