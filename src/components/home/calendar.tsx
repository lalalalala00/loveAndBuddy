'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { PanelRightOpen, PanelRightClose, Maximize2, Minimize2 } from 'lucide-react';
import NameTag from '@/common/name.tag';

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

interface Reservation {
    buddy: Buddy;
    date: number;
    love: Love;
}

interface SelectedDay {
    day: string;
    reservation: Array<Reservation>;
}

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
        const clickedDateStr = date.format('YYYY-MM-DD');
        console.log(clickedDateStr, 'date');

        const dayReservations = reservations.filter(
            (r) => dayjs(r.date).utcOffset(9).format('YYYY-MM-DD') === clickedDateStr,
        );

        setSelectedDay({ day: clickedDateStr, reservation: dayReservations });
        setDay(dayjs(clickedDateStr).format('ddd'));
        console.log(dayReservations.length, 'dayReservations');
        if (dayReservations.length > 0) {
            setDayContents(true);
        }

        console.log(`[${clickedDateStr}] 예약 목록: `, dayReservations);
    };

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
            className={`mx-auto flex  ${!calSize ? 'p-2' : 'px-4'} ${!calSize && !dayContents && 'w-[400px]'}`}
            style={{
                height: !calSize ? '530px' : '730px',
                // width: !calSize ? "400px" : "780px",
            }}
        >
            <div
                style={{
                    width: !calSize ? '400px' : '790px',
                    // height: calSize ? "504px" : "700px",
                }}
            >
                <div className="flex justify-between items-center">
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
                <div className="relative flex justify-center  mb-6">
                    <div className="w-1/2 flex justify-between ">
                        <button
                            onClick={prevMonth}
                            className="px-2 py-1 rounded-lg hover:bg-[#f8fbf4] border border-transparent hover:border-[#e3ecdc]"
                            aria-label="이전 달"
                        >
                            ‹
                        </button>
                        <h3 className="text-lg sm:text-xl font-semibold">{currentDate.format('YYYY년 MM월')}</h3>
                        <button
                            onClick={nextMonth}
                            className="px-2 py-1 rounded-lg hover:bg-[#f8fbf4] border border-transparent hover:border-[#e3ecdc]"
                            aria-label="다음 달"
                        >
                            ›
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 text-center text-sm text-gray-500">
                    {daysOfWeek.map((day) => (
                        <div key={day} className="first:text-red-500">
                            <p>{day}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 text-center mt-2">
                    {generateCalendar().map((date, i) => {
                        const clickedDateStr = date && date.format('YYYY-MM-DD');

                        const dayReservations = reservations.filter(
                            (r) => dayjs(r.date).utcOffset(9).format('YYYY-MM-DD') === clickedDateStr,
                        );

                        return (
                            <div
                                key={i}
                                className={`w-full h-full flex justify-start cursor-pointer p-1 flex-col m-1 border border-[#f7f9f6]
        ${date?.isSame(today, 'day') ? 'bg-[#c8d9b5b4] text-white font-bold hover:text-[#9dbb80]' : ''}
        ${!date ? '' : 'hover:bg-[#f7f9f6]'}
      `}
                                style={{
                                    minWidth: !calSize ? '' : '',
                                    minHeight: !calSize ? '60px' : '90px',
                                }}
                                onClick={() => date && handleDateClick(date)}
                            >
                                <div className="text-left relative">
                                    <span className={`${calSize ? 'text-[16px]' : 'text-[14px]'} `}>
                                        {date?.date()}
                                    </span>
                                    {dayReservations.length > 0 && (
                                        <div className="w-9 h-5 bg-[#e8f0e1] absolute -top-0 -left-2 -z-1" />
                                    )}
                                </div>

                                <div className="flex flex-col items-start">
                                    {dayReservations.length > 0 &&
                                        dayReservations.map((item, i) => (
                                            <div className="flex" key={i}>
                                                <span className="text-[12px] text-nowrap">{item.buddy.name} buddy</span>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {dayContents && (
                <div
                    className={`${dayContents && calSize ? 'min-w-[400px] ml-6' : 'min-w-[385px] ml-4'}  h-[95%] p-4 border border-[#e3ecdc] ml-4 rounded-2xl`}
                >
                    <div className="flex justify-between items-center border-b-2 border-[#e3ecdc] pb-2 mb-1 text-[14px]">
                        <span className="text-[#9dbb80]">date.</span>
                        <span className="text-[#2d3f1e] font-sembold">{selectedDay?.day}</span>
                        <span className="text-[#9dbb80]">{day}</span>
                    </div>

                    {selectedDay?.reservation.map((item, i) => (
                        <div key={i}>
                            <div className="flex flex-col">
                                <span className="text-[14px] text-center mt-2">
                                    -`♥´- dear.Love_〘 {item.love.name} 〙 -`♥´-
                                </span>
                                <span className="text-[13px] text-end">with {item.buddy.name} 💚 buddy</span>
                            </div>
                            <div
                                className={`border border-gray-200 rounded-xl text-[13px] line-2 p-2 ${dayContents && calSize ? 'w-[375px]' : 'w-[360px]'}`}
                            >
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi harum a voluptatum.
                                Quibusdam, dignissimos! Quia inventore obcaecati, mollitia earum voluptatem doloribus
                                unde asperiores maxime quasi rem eum, error tenetur numquam!
                            </div>

                            <div>
                                <img src="/cha/1_5.png" alt="" className="w-20 h-20 object-cover" />
                                <img src="/cha/1_5.png" alt="" className="w-20 h-20 object-cover" />
                                <img src="/cha/1_5.png" alt="" className="w-20 h-20 object-cover" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* {reservationModal && selectedDay && (
        <div className="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2  w-full h-full flex justify-center items-center bg-black/30">
          <div className=" flex-col w-1/3 h-1/4 border p-4 rounded-2xl bg-white">
            <span>{selectedDay?.day}</span>
            {selectedDay?.reservation.map((item, i) => (
              <div key={i}>
                <span>
                  {item.love.name} love 🩵{item.buddy.name} buddy
                </span>
                <span>img</span>
              </div>
            ))}
          </div>
        </div>
      )} */}
        </div>
    );
};

const reservations: Reservation[] = [
    {
        buddy: { name: '코코', code: 'B001', profileImg: '' },
        love: { name: '루비', code: 'B002', profileImg: '' },
        date: 1754265600000, // ✅ 2025-08-04
    },
    {
        buddy: { name: '루비', code: 'B002', profileImg: '' },
        love: { name: '루비', code: 'B002', profileImg: '' },
        date: 1754265600000, // ✅ 2025-08-04
    },
    {
        buddy: { name: '몽이', code: 'B003', profileImg: '' },
        love: { name: '루비', code: 'B002', profileImg: '' },
        date: 1754784000000, // ✅ 2025-08-10
    },
    {
        buddy: { name: '초코', code: 'B004', profileImg: '' },
        love: { name: '루비', code: 'B002', profileImg: '' },
        date: 1755475200000, // ✅ 2025-08-18
    },
    {
        buddy: { name: '하니', code: 'B005', profileImg: '' },
        love: { name: '루비', code: 'B002', profileImg: '' },
        date: 1755475200000, // ✅ 2025-08-18
    },
    {
        buddy: { name: '보리', code: 'B006', profileImg: '' },
        love: { name: '루비', code: 'B002', profileImg: '' },
        date: 1756080000000, // ✅ 2025-08-25
    },
];

export default Calendar;
