'use client';

import ModalIos from '@/common/modal.ios';

import { useEffect, useRef, useState } from 'react';
import { ScheduleImportModal } from './import.schedule.modal';

import { TimePickerField } from './time.picker';

export function getTodayYYYYMMDDSeoul() {
    const nowSeoul = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
    const y = nowSeoul.getFullYear();
    const m = String(nowSeoul.getMonth() + 1).padStart(2, '0');
    const d = String(nowSeoul.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function toSeoulDate(input: string | number | Date): Date | null {
    if (input instanceof Date || typeof input === 'number') {
        const d = new Date(input);
        return Number.isNaN(d.getTime()) ? null : d;
    }

    const s = String(input).trim();
    const hasTZ = /([zZ])|([+-]\d{2}:\d{2})$/.test(s);

    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
        return new Date(`${s}T00:00:00+09:00`);
    }

    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(s) && !hasTZ) {
        return new Date(`${s}+09:00`);
    }

    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? null : d;
}

function formatWeekdayUnderscorePrettyDate(ts?: string | number | Date) {
    if (!ts) return '';
    const d = toSeoulDate(ts);
    if (!d) return '';

    const weekday = new Intl.DateTimeFormat('ko-KR', {
        weekday: 'long',
        timeZone: 'Asia/Seoul',
    }).format(d);

    const month = new Intl.DateTimeFormat('ko-KR', {
        month: 'short',
        timeZone: 'Asia/Seoul',
    }).format(d);

    const day = new Intl.DateTimeFormat('ko-KR', {
        day: 'numeric',
        timeZone: 'Asia/Seoul',
    }).format(d);

    const year = new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        timeZone: 'Asia/Seoul',
    }).format(d);

    return `[ ${weekday} ]  ${month} ${day}, ${year}`;
}

const ImportSchedule = () => {
    const [scheduleModal, setScheduleModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>(getTodayYYYYMMDDSeoul());
    const [time, setTime] = useState('');
    const [place, setPlace] = useState('');
    const [neighborhood, setNeighborhood] = useState<string>('');
    const [timeStart, setTimeStart] = useState<string>('');
    const [timeEnd, setTimeEnd] = useState<string>('');

    const [pickerOpen, setPickerOpen] = useState(false);
    const popRef = useRef<HTMLDivElement | null>(null);

    function toKTime(hhmm?: string) {
        if (!hhmm) return '';
        const [h, m] = hhmm.split(':');
        return m === '00' ? `${Number(h)}시` : `${Number(h)}시 ${m}분`;
    }

    useEffect(() => {
        if (!pickerOpen) return;
        const onDown = (e: MouseEvent) => {
            if (popRef.current && !popRef.current.contains(e.target as Node)) {
                setPickerOpen(false);
            }
        };
        document.addEventListener('mousedown', onDown);
        return () => document.removeEventListener('mousedown', onDown);
    }, [pickerOpen]);

    const displayISO = `${selectedDate}${time ? `T${time}:00` : ''}`;

    const handleImport = (v: {
        date?: string;
        timeStart?: string;
        timeEnd?: string;
        place?: string;
        neighborhood?: string;
    }) => {
        if (v.date) setSelectedDate(v.date);
        if (v.timeStart) setTimeStart(v.timeStart);
        if (v.timeEnd) setTimeEnd(v.timeEnd);
        if (typeof v.place === 'string') setPlace(v.place);
        if (typeof v.neighborhood === 'string') setNeighborhood(v.neighborhood);
        setScheduleModal(false);
    };
    return (
        <div className="flex w-full flex-col bg-[#f5f7ee81] border-[#e3ecdc] border rounded-xl mb-3 shadow p-2">
            <div className="flex w-full h-16 mb-3 relative">
                <button
                    type="button"
                    onClick={() => setPickerOpen((v) => !v)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setPickerOpen((v) => !v)}
                    className=" w-full h-full rounded-xl p-3 mb-3 border-[#e3ecdc] border text-left hover:bg-[#eef3e5] bg-white transition "
                    aria-label="날짜 선택 열기"
                >
                    <span className="text-[15px] font-medium text-[#475a43]">
                        {formatWeekdayUnderscorePrettyDate(displayISO)}
                    </span>
                </button>
                <button
                    type="button"
                    onClick={() => setScheduleModal(!scheduleModal)}
                    className="flex items-center justify-center  bg-white border-2 border-dashed border-gray-200 rounded-xl p-3 mb-3 p-1 h-full text-[14px] w-1/3 ml-3"
                    aria-label="날짜 선택 열기"
                >
                    <span>+ 일정 가져오기</span>
                </button>

                {pickerOpen && (
                    <div
                        ref={popRef}
                        className="absolute z-20 top-[54px] left-0 w-[260px] rounded-xl border border-gray-200 bg-white shadow-md p-3"
                    >
                        <label className="block text-xs text-gray-500 mb-1">날짜</label>
                        <input
                            autoFocus
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 p-2 mb-3 text-sm"
                        />

                        <label className="block text-xs text-gray-500 mb-1">시간</label>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 p-2 text-sm"
                        />

                        <div className="flex justify-end gap-2 mt-3">
                            <button
                                type="button"
                                className="text-xs text-gray-500 hover:text-gray-700"
                                onClick={() => {
                                    setSelectedDate(getTodayYYYYMMDDSeoul());
                                    setTime('');
                                }}
                            >
                                오늘로
                            </button>
                            <button
                                type="button"
                                className="text-xs px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                onClick={() => setPickerOpen(false)}
                            >
                                적용
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="w-full  bg-white p-2 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
                    <label className="block">
                        <span className="block text-xs text-gray-500 mb-1">장소</span>
                        <input
                            type="text"
                            value={place}
                            onChange={(e) => setPlace(e.target.value)}
                            className="w-full rounded-xl border border-[#e3ecdc] px-3 py-2 text-sm"
                            placeholder="예: 서울숲"
                        />
                    </label>

                    <label className="block">
                        <span className="block text-xs text-gray-500 mb-1">동네</span>
                        <input
                            type="text"
                            value={neighborhood}
                            onChange={(e) => setNeighborhood(e.target.value)}
                            className="w-full rounded-xl border border-[#e3ecdc] px-3 py-2 text-sm"
                            placeholder="예: 성수동"
                        />
                    </label>
                    <label className="block ">
                        <span className="block text-xs text-gray-500 mb-1">시간 (시작–종료)</span>
                        <div className="flex items-center rounded-xl  gap-2 bg-white h-[38px]">
                            <TimePickerField value={timeStart} onChange={setTimeStart} />
                            <span className="text-gray-400 shrink-0">–</span>
                            <TimePickerField value={timeEnd} onChange={setTimeEnd} min={timeStart} />
                        </div>
                    </label>
                </div>
            </div>

            <ModalIos
                isOpen={scheduleModal}
                handleModalState={() => setScheduleModal(false)}
                title="일정 가져오기"
                width="400px"
                height="605px"
                leftAction={() => console.log('schedule')}
                leftComment="일정 추가하기"
            >
                <ScheduleImportModal items={picks} onImport={handleImport} />
            </ModalIos>
        </div>
    );
};

const picks = [
    {
        id: 'p1',
        animals: [{ id: 'a1', name: '샤넬', img: '/cha/1_2.png' }],
        buddyName: '원썬한태양',
        neighborhood: '성수동',
        place: '서울숲',
        date: '2025-10-06',
        timeStart: '14:00',
        timeEnd: '16:00',
    },
];

export default ImportSchedule;
