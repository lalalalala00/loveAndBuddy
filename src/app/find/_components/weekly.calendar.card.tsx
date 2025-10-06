import { at0, weekdayKo } from '@/utils/date';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';

export type Availability = { startHour: number; endHour: number };

const toKSTDateStr = (d: Date) =>
    new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(d);

export default function WeeklyCalendarCard({
    modal,
    availability = { startHour: 9, endHour: 22 },
    setSelectedDT,
    infoData,
}: {
    modal?: boolean;
    availability?: Availability;
    setSelectedDT?: Dispatch<SetStateAction<{ date: string; time: string }>>;
    infoData?: boolean;
}) {
    const [soldOut, setSoldOut] = useState<Record<string, Set<number>>>({});

    const [coloredLevel, setColoredLevel] = useState<Record<string, number>>({});

    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [range, setRange] = useState<{ start: number | null; end: number | null }>({
        start: null,
        end: null,
    });
    const today = new Date();
    const t = at0(today);

    const selectedDateObj = selectedDay !== null ? new Date(today.getFullYear(), today.getMonth(), selectedDay) : null;
    const selectedDateKey = selectedDateObj ? toKSTDateStr(selectedDateObj) : '';

    const getWeekDays = (date: Date) => {
        const day = date.getDay();
        const _day = new Date(date);
        _day.setDate(date.getDate() - ((day + 6) % 7));

        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(_day);
            d.setDate(_day.getDate() + i);
            return d;
        });
    };

    const handleDate = (d: Date) => {
        const isPast = at0(d) < t;
        if (isPast) {
            setSelectedDay(null);
            setRange({ start: null, end: null });
            return;
        }
        setSelectedDay(d.getDate());
        setRange({ start: null, end: null });
    };

    const timeSlots = useMemo(() => {
        const arr: number[] = [];
        for (let h = availability.startHour; h <= availability.endHour; h++) arr.push(h);
        return arr;
    }, [availability]);

    const fmtHour = (h: number) => `${String(h).padStart(2, '0')}:00`;

    const onSelectTime = (h: number) => {
        if (disabledHour(h)) return;
        if (range.start === null || range.end === null) {
            setRange({ start: h, end: h });

            return;
        }

        let start = range.start;
        let end = range.end;

        if (h < start - 1) {
            start = h;
        } else if (h === start - 1) {
            start = h;
        } else if (h >= start && h <= end) {
            start = h;
            end = h;
        } else if (h === end + 1) {
            end = h;
        } else if (h > end + 1) {
            end = h;
        }

        setRange({ start, end });
    };

    const isActive = (h: number) => range.start !== null && range.end !== null && h >= range.start && h <= range.end;

    const selectionLabel =
        selectedDay === null || range.start === null || range.end === null
            ? '-'
            : range.start === range.end
              ? `${fmtHour(range.start)} (1시간)`
              : `${fmtHour(range.start)} ~ ${fmtHour(range.end + 1)} (${range.end - range.start + 1}시간)`;

    const weekDays = getWeekDays(today);

    useEffect(() => {
        const dateStr = selectedDateObj ? toKSTDateStr(selectedDateObj) : '';
        setSelectedDT?.({ date: dateStr, time: selectionLabel });
    }, [selectedDay, range]);

    useEffect(() => {
        if (!infoData) return;

        if (!selectedDateKey || range.start === null || range.end === null) return;

        setSoldOut((prev) => {
            const set = new Set(prev[selectedDateKey] ?? []);
            for (let h = range.start!; h <= range.end!; h++) set.add(h);
            return { ...prev, [selectedDateKey]: set };
        });
    }, [infoData, selectedDateKey, range.start, range.end]);

    const disabledHour = (hour: number) => {
        if (selectedDay === null) return true;

        const selected = new Date(today.getFullYear(), today.getMonth(), selectedDay);
        const isToday = selected.toDateString() === today.toDateString();
        if (isToday && hour <= today.getHours()) return true;

        if (selectedDateKey && soldOut[selectedDateKey]?.has(hour)) return true;

        return false;
    };

    useEffect(() => {
        if (!infoData) return;
        if (!selectedDateKey || range.start === null || range.end === null) return;

        setSoldOut((prev) => {
            const set = new Set(prev[selectedDateKey] ?? []);
            for (let h = range.start!; h <= range.end!; h++) set.add(h);
            return { ...prev, [selectedDateKey]: set };
        });

        const level = timeSlots.length - (range.end - range.start + 1);
        setColoredLevel((prev) => ({ ...prev, [selectedDateKey]: level }));
    }, [infoData, selectedDateKey, range.start, range.end, timeSlots.length]);

    const GREEN = { r: 0xb2, g: 0xd2, b: 0xa4 };
    const ORANGE = { r: 0xf5, g: 0x9e, b: 0x0b };
    const RED = { r: 0xef, g: 0x44, b: 0x44 };
    const ALPHA = 0xd8 / 255;

    const mix = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);

    function triGradientColor(value: number, max = 14) {
        const t = 1 - Math.max(0, Math.min(value, max)) / max;
        let r: number, g: number, b: number;

        if (t <= 0.5) {
            const k = t / 0.5; // 0~1
            r = mix(GREEN.r, ORANGE.r, k);
            g = mix(GREEN.g, ORANGE.g, k);
            b = mix(GREEN.b, ORANGE.b, k);
        } else {
            const k = (t - 0.5) / 0.5; // 0~1
            r = mix(ORANGE.r, RED.r, k);
            g = mix(ORANGE.g, RED.g, k);
            b = mix(ORANGE.b, RED.b, k);
        }
        return `rgba(${r}, ${g}, ${b}, ${ALPHA})`;
    }

    return (
        <div className={`${modal ? 'w-full' : ''}  bg-[#f7f9f6ee] rounded-t-lg shadow`}>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center pt-1 mt-2 pb-2">
                <div />
                <span className={`justify-self-center text-gray-600 ${modal ? 'text-[16px] py-2' : 'text-[13px]'}`}>
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
                    divide-x divide-[#f3f6f0] ${modal ? 'h-14' : 'h-8'}`}
                    >
                        {weekDays.map((d, i) => {
                            const isToday = d.toDateString() === today.toDateString();
                            const isSunday = d.getDay() === 0;
                            const selectDay = d.getDate() === selectedDay;
                            const dayKey = toKSTDateStr(d);
                            const levelForDay = coloredLevel[dayKey];

                            return (
                                <div
                                    key={i}
                                    onClick={() => handleDate(d)}
                                    className={[
                                        'cursor-pointer flex flex-col items-center',
                                        at0(d) < t ? 'cursor-not-allowed' : '',
                                        isToday ? 'bg-[#fff]' : '',
                                        selectDay ? 'border border-[#6ab91f] rounded-sm' : '',
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
                                            // at0(d) < t ? 'bg-gray-200' : 'bg-[#b2d2a4d8]',
                                        ].join(' ')}
                                        style={{
                                            backgroundColor:
                                                at0(d) < t
                                                    ? '#e5e7eb'
                                                    : levelForDay === undefined
                                                      ? '#b2d2a4d8'
                                                      : triGradientColor(levelForDay, 14),
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div
                        className={`grid grid-cols-7 text-[12px] text-center rounded-b-lg border border-[#fff] bg-white py-2
                  divide-x divide-[#f3f6f0] `}
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
                                            `cursor-pointer flex justify-end flex-col items-center ${modal ? 'h-12' : 'h-8'}`,
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
                <div className="px-2 py-2">
                    <div className="flex flex-wrap gap-1">
                        {timeSlots.map((h) => {
                            const disabled = disabledHour(h);
                            const active = isActive(h);
                            const isSold = !!selectedDateKey && !!soldOut[selectedDateKey]?.has(h);

                            return (
                                <button
                                    key={h}
                                    onClick={() => onSelectTime(h)}
                                    disabled={disabled}
                                    className={[
                                        'px-2 py-1 rounded-md text-[12px] border',
                                        disabled
                                            ? isSold
                                                ? 'cursor-not-allowed text-gray-400 border-gray-200 bg-gray-50'
                                                : 'cursor-not-allowed text-gray-400 border-gray-200 bg-gray-50'
                                            : active
                                              ? 'border-[#9dbb80] bg-[#f9efd34c] font-semibold'
                                              : 'border-gray-200 bg-white hover:border-emerald-600',
                                    ].join(' ')}
                                >
                                    {fmtHour(h)}
                                </button>
                            );
                        })}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        {range.start !== null && (
                            <button
                                className=" text-[11px] text-gray-500 underline"
                                onClick={() => {
                                    setRange({ start: null, end: null });
                                }}
                            >
                                선택 해제
                            </button>
                        )}

                        {modal && (
                            <button
                                onClick={() => setSelectedDay(null)}
                                className="text-[11px] text-gray-500 underline"
                            >
                                접어두기
                            </button>
                        )}
                    </div>
                </div>
            )}
            {selectedDay !== null && !modal && (
                <div className="px-2 py-1 flex justify-between">
                    <span className={`${modal ? 'text-[14px] p-2 inline-flex justify-start w-full' : 'text-[13px]'} `}>
                        {selectedDay}일 ({weekdayKo(selectedDateObj!, 'short')}) {selectionLabel}
                    </span>

                    <button onClick={() => setSelectedDay(null)} className="text-[11px] text-gray-500 underline">
                        접어두기
                    </button>
                </div>
            )}
        </div>
    );
}
