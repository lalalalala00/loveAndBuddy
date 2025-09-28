'use client';

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { PanelRightOpen, PanelRightClose, Maximize2, Minimize2 } from 'lucide-react';

import CalendarSideContent from '../calendar.side';
import { formatDateLongEn } from '@/utils/date';
import { useUserState } from '@/context/useUserContext';
import { getUserById } from '@/common/get.user.by.id';
import { useDearLoveIndex } from '@/hooks/useDearLove';
import { DearLove } from '@/utils/data';

interface Buddy {
    name: string;
    code: string;
    profileImg: string;
}
interface Love {
    name: string;
    code: string;
    profileImg: string;
}

export interface Reservation {
    buddy: Buddy;
    date: number;
    love: Love;
}

export interface SelectedDay {
    day: string;
    reservation: DearLove[];
}

type ReservationVM = { buddyName: string; loveName?: string; date: number };

const daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

const Calendar = ({
    setSelectedClose,
    setCalExtension,
}: {
    setSelectedClose: (value: string) => void;
    setCalExtension: Dispatch<SetStateAction<number>>;
}) => {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.tz.setDefault('Asia/Seoul');

    const { dearLoves = [] } = useUserState();

    const { state, actions } = useDearLoveIndex(dearLoves, getUserById);
    const { sortedDearLoves, dearLove, currentBuddy, currentBuddyId, buddyCache } = state;

    const [calSize, setCalSize] = useState<boolean>(true);
    const [selectedDay, setSelectedDay] = useState<SelectedDay>();
    const [day, setDay] = useState<string>('');
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [dayContents, setDayContents] = useState<boolean>(false);

    const [reservationModal, setReservationModal] = useState<boolean>(false);

    const startOfMonth = currentDate.startOf('month');
    const endOfMonth = currentDate.endOf('month');

    const daysInMonth = endOfMonth.date();
    const startDay = startOfMonth.day();

    const prevMonth = () => setCurrentDate(currentDate.subtract(1, 'month'));
    const nextMonth = () => setCurrentDate(currentDate.add(1, 'month'));

    const today = dayjs();

    const dearMapByDay = useMemo(() => {
        const map: Record<string, DearLove[]> = {};
        for (const d of sortedDearLoves) {
            if (!d?.date_at) continue;
            const key = dayjs(d.date_at).tz().format('YYYY-MM-DD');
            (map[key] ||= []).push(d);
        }
        return map;
    }, [sortedDearLoves]);

    const resolveBuddyName = (id?: string | null) => (id && buddyCache[id]?.name) || (id ? 'Buddy' : '');

    const generateCalendar = () => {
        const calendar: (dayjs.Dayjs | null)[] = [];

        for (let i = 0; i < startDay; i++) {
            calendar.push(null);
        }

        for (let d = 1; d <= daysInMonth; d++) {
            calendar.push(dayjs(new Date(currentDate.year(), currentDate.month(), d)));
        }

        return calendar;
    };

    const handleDateClick = (date: dayjs.Dayjs) => {
        const key = date.tz().format('YYYY-MM-DD');
        const dayReservations = dearMapByDay[key] ?? [];

        setSelectedDay({ day: key, reservation: dayReservations });
        setDay(date.format('ddd'));
        // setDayContents(dayReservations.length > 0);

        if (dayReservations.length > 0) {
            setDayContents(true);
        }
    };

    const toVM = (arr: DearLove[]): ReservationVM[] =>
        arr.map((d) => ({
            buddyName: resolveBuddyName(d.buddy_user_id),
            date: d.date_at ? dayjs(d.date_at).valueOf() : 0,
        }));

    useEffect(() => {
        let width = 1;
        if (calSize && !dayContents) width = 2;
        else if (calSize && dayContents) width = 3;
        else if (!calSize && dayContents) width = 2;
        else if (!calSize && !dayContents) width = 1;

        setCalExtension(width);
    }, [calSize, dayContents]);

    return (
        <div
            className={`mx-auto flex  ${!calSize ? 'px-2' : 'px-4'} ${!calSize && !dayContents && 'w-[400px]'} ${!calSize && dayContents && 'w-[830px]'}`}
            style={{
                height: !calSize ? '530px' : '730px',
                // width: !calSize ? "400px" : "780px",
            }}
        >
            <div className={`${!calSize ? 'w-full min-w-0' : 'w-[790px] min-w-[790px]'}`}>
                <div className="flex justify-between items-center w-full">
                    <button
                        onClick={() => setSelectedClose('cal')}
                        className="h-[14px] w-[14px] rounded-full bg-red-500 flex justify-center items-center cursor-pointer"
                    ></button>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentDate(dayjs())}
                            className="text-[13px] gap-1 h-[33px] px-3 border border-[#e3ecdc] rounded-xl custom-card  custom-card-hover shadow"
                        >
                            오늘
                        </button>
                        <button
                            onClick={() => setCalSize((v) => !v)}
                            title={calSize ? '작게 보기' : '크게 보기'}
                            aria-label={calSize ? '작게 보기' : '크게 보기'}
                            className={[
                                'flex items-center justify-center gap-1 h-8 px-3 rounded-xl',
                                'bg-white border border-[#e3ecdc] hover:bg-[#f8fbf4] shadow',
                                'text-[#51683b] transition',
                            ].join(' ')}
                        >
                            {calSize ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                        </button>
                        <button
                            onClick={() => setDayContents((v) => !v)}
                            title={dayContents ? '상세 패널 닫기' : '상세 패널 열기'}
                            aria-label={dayContents ? '상세 패널 닫기' : '상세 패널 열기'}
                            className={[
                                'flex items-center justify-center gap-1 h-8 px-3 rounded-xl',
                                'bg-white border border-[#e3ecdc] hover:bg-[#f8fbf4] shadow',
                                'text-[#51683b] transition',
                            ].join(' ')}
                        >
                            {dayContents ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
                        </button>
                    </div>
                </div>
                <div className={`relative flex justify-center ${calSize ? 'mb-6' : 'mb-4 mt-1.5'} `}>
                    <div className="w-1/2 flex justify-between items-center">
                        <button
                            onClick={prevMonth}
                            className="px-3 py-1 rounded-lg hover:bg-[#f8fbf4] border border-[#e3ecdc]"
                            aria-label="이전 달"
                        >
                            ‹
                        </button>
                        <h3 className={`${calSize ? 'text-lg' : 'text-[15px] mt-1'} font-semibold`}>
                            {currentDate.format('YYYY년 MM월')}
                        </h3>
                        <button
                            onClick={nextMonth}
                            className="px-3 py-1 rounded-lg hover:bg-[#f8fbf4] border border-[#e3ecdc]"
                            aria-label="다음 달"
                        >
                            ›
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 text-center text-sm text-gray-500 w-full bg-[#f9efd34c] py-2 rounded-t-lg mb-1">
                    {daysOfWeek.map((day) => (
                        <div key={day} className="first:text-red-500 font-semibold">
                            <p>{day}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 text-center  w-full">
                    {generateCalendar().map((date, i) => {
                        const key = date?.tz().format('YYYY-MM-DD');
                        const dayReservations = key ? (dearMapByDay[key] ?? []) : [];
                        const bg = dayReservations.map((item) => item.representative_img);

                        return (
                            <div
                                key={i}
                                className={`w-full h-full flex justify-start cursor-pointer p-1 flex-col border border-[#f7f9f6]
        ${date?.isSame(today, 'day') ? 'bg-[#c8d9b5b4] text-white font-bold hover:text-[#9dbb80]' : ''}
        ${!date ? '' : 'hover:bg-[#f7f9f6]'}
        ${bg.length > 0 ? 'hover:opacity-90' : ''}
     
      `}
                                style={{
                                    minHeight: !calSize ? '65px' : '98px',
                                    height: !calSize ? '65px' : '98px',
                                    backgroundImage: `url(${bg})`,
                                    backgroundSize: 'cover',
                                }}
                                onClick={() => date && handleDateClick(date)}
                            >
                                <div className="text-left relative">
                                    <span
                                        className={`${calSize ? 'text-[16px]' : 'text-[14px]'} z-[6] relative ${dayReservations.length > 0 ? 'text-white font-bold text-[18px]' : ''}`}
                                    >
                                        {date?.date()}
                                    </span>

                                    {/* {dayReservations.length > 0 && (
                                        <>
                                            <div className="w-10 h-10 bg-white rounded-full absolute -top-[8px] -left-[15px] z-[5]" />
                                            <div className="absolute -top-[8px] -left-[15px] z-[5] text-[50px] text-amber-400">
                                                ⛧
                                            </div>
                                        </>
                                    )} */}
                                    {/* {dayReservations.length > 0 && (
                                        <div
                                            className="w-full h-full absolute inset-0 bg-gradient-to-b from-white/70 via-white/45 to-white/75"
                                            style={{
                                                minHeight: !calSize ? '65px' : '89px',
                                                height: !calSize ? '65px' : '89px',
                                                filter: 'blur(2px)',
                                            }}
                                        />
                                    )} */}
                                </div>

                                {/* <div className="flex flex-col items-end  px-1">
                                    {dayReservations.map((dl, idx) => (
                                        <div className="flex" key={idx}>
                                            <span className="text-[11px] leading-none px-1.5 py-0.5 rounded-sm text-gray-800 bg-white/60 backdrop-blur border border-[#e3ecdc]">
                                                {resolveBuddyName(dl.buddy_user_id)}
                                            </span>
                                        </div>
                                    ))}
                                </div> */}
                            </div>
                        );
                    })}
                </div>
            </div>
            {dayContents && (
                <div
                    className={`${dayContents && calSize ? 'min-w-[400px] ml-6' : 'min-w-[385px] ml-4'}  h-[95%] border border-[#e3ecdc] ml-4 rounded-2xl`}
                >
                    <div className="flex justify-between items-center border-b-2 border-[#e3ecdc]  px-4 py-3 text-[14px]">
                        <span className="text-[#9dbb80]">date.</span>
                        <span className="font-sembold"> {formatDateLongEn(selectedDay?.day)}</span>
                        <span className="text-[#9dbb80] lowercase">{day}</span>
                    </div>
                    <div
                        className={`${selectedDay && selectedDay?.reservation.length >= 1 ? '' : 'bg-[#f3f7ee]'} h-[calc(100%-47px)] rounded-b-2xl`}
                    >
                        <CalendarSideContent
                            item={selectedDay}
                            dayContents={dayContents}
                            calSize={calSize}
                            resolveBuddyName={(id) => (id && buddyCache[id]?.name) || (id ? 'Buddy' : '')}
                            buddyAvatar={
                                buddyCache[selectedDay?.reservation?.[0]?.buddy_user_id]?.avatar_url?.trim() ||
                                '/buddy/buddy_1.png'
                            }
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;
