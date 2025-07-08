"use client";

import { useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

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

const daysOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const Calendar = () => {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const [selectedDay, setSelectedDay] = useState<SelectedDay>();
  const [currentDate, setCurrentDate] = useState(dayjs());

  const [reservationModal, setReservationModal] = useState<boolean>(false);

  const startOfMonth = currentDate.startOf("month");
  const endOfMonth = currentDate.endOf("month");

  const daysInMonth = endOfMonth.date();
  const startDay = startOfMonth.day();

  const prevMonth = () => setCurrentDate(currentDate.subtract(1, "month"));
  const nextMonth = () => setCurrentDate(currentDate.add(1, "month"));

  const today = dayjs();

  const generateCalendar = () => {
    const calendar: (dayjs.Dayjs | null)[] = [];

    for (let i = 0; i < startDay; i++) {
      calendar.push(null);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      calendar.push(
        dayjs(new Date(currentDate.year(), currentDate.month(), d))
      );
    }

    return calendar;
  };

  const handleDateClick = (date: dayjs.Dayjs) => {
    const clickedDateStr = date.format("YYYY-MM-DD");
    console.log(clickedDateStr, "date");

    const dayReservations = reservations.filter(
      (r) => dayjs(r.date).utcOffset(9).format("YYYY-MM-DD") === clickedDateStr
    );

    setSelectedDay({ day: clickedDateStr, reservation: dayReservations });
    console.log(dayReservations.length, "dayReservations");
    if (dayReservations.length > 0) {
      setReservationModal(true);
    } else {
      setReservationModal(false);
    }

    console.log(`[${clickedDateStr}] 예약 목록: `, dayReservations);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 border">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth}>&#60;</button>
        <h2 className="text-lg font-semibold">
          {currentDate.format("YYYY년 MM월")}
        </h2>
        <button onClick={nextMonth}> &#62;</button>
      </div>
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setCurrentDate(dayjs())}
          className="text-sm px-2 py-1 border rounded hover:bg-gray-100"
        >
          오늘
        </button>
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
          const clickedDateStr = date && date.format("YYYY-MM-DD");

          const dayReservations = reservations.filter(
            (r) =>
              dayjs(r.date).utcOffset(9).format("YYYY-MM-DD") === clickedDateStr
          );

          return (
            <div
              key={i}
              className={`h-[60px] w-[60px] flex justify-start cursor-pointer p-1 flex-col m-1
        ${date?.isSame(today, "day") ? "bg-blue-100 text-white font-bold" : ""}
        ${!date ? "" : "hover:bg-gray-200"}
      `}
              onClick={() => date && handleDateClick(date)}
            >
              <div className="text-center relative">
                <span>{date?.date()}</span>
                {dayReservations.length > 0 && (
                  <div className="w-2 h-2 mt-1 rounded-full bg-[#46FFFF] absolute -top-1 left-0" />
                )}
              </div>

              <div className="flex flex-col items-start">
                {dayReservations.length > 0 &&
                  dayReservations.map((item, i) => (
                    <div className="flex">
                      <span className="text-[12px] text-nowrap">
                        {item.buddy.name} buddy
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
      {reservationModal && selectedDay && (
        <div className="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2  w-full h-full flex justify-center items-center bg-black/30">
          <div className=" flex-col w-1/3 h-1/4 border p-4 rounded-2xl bg-white">
            <span>{selectedDay?.day}</span>
            {selectedDay?.reservation.map((item, i) => (
              <div>
                <span>
                  {item.love.name} love 🩵{item.buddy.name} buddy
                </span>
                <span>img</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const reservations: Reservation[] = [
  {
    buddy: { name: "코코", code: "B001", profileImg: "" },
    love: { name: "루비", code: "B002", profileImg: "" },
    date: 1751587200000, // ✅ 2025-07-04
  },
  {
    buddy: { name: "루비", code: "B002", profileImg: "" },
    love: { name: "루비", code: "B002", profileImg: "" },
    date: 1751587200000, // ✅ 2025-07-04
  },
  {
    buddy: { name: "몽이", code: "B003", profileImg: "" },
    love: { name: "루비", code: "B002", profileImg: "" },
    date: 1752124800000, // ✅ 2025-07-10
  },
  {
    buddy: { name: "초코", code: "B004", profileImg: "" },
    love: { name: "루비", code: "B002", profileImg: "" },
    date: 1752825600000, // ✅ 2025-07-18
  },
  {
    buddy: { name: "하니", code: "B005", profileImg: "" },
    love: { name: "루비", code: "B002", profileImg: "" },
    date: 1752825600000, // ✅ 2025-07-18
  },
  {
    buddy: { name: "보리", code: "B006", profileImg: "" },
    love: { name: "루비", code: "B002", profileImg: "" },
    date: 1753344000000, // ✅ 2025-07-25
  },
];

export default Calendar;
