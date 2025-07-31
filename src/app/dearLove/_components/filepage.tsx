"use client";

import { Fragment, useState } from "react";
import File from "./file";
import FileNameBox from "./file.name.box";

const FilePage = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [randomNameBox, setRandomNameBox] = useState<number>(0);
  const [selectedDay, setSelectedDay] = useState<number>(31);
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [open, setOpen] = useState<boolean>(false);

  const years = [2025, 2024, 2023, 2022];

  const randomIndex = Math.floor(Math.random() * randomNameBox);
  // const randomIndex = Math.floor(Math.random() * (imgs.length + 1));

  return (
    <div className="flex w-full">
      <div className="w-[200px] h-[70%] rounded-2xl shadow overflow-hidden flex flex-col items-center py-3 bg-white/20">
        <div className="relative w-[160px] mb-4">
          <button
            onClick={() => setOpen(!open)}
            className="font-bold h-[38px] w-full rounded-xl bg-blue-100 hover:bg-blue-200 text-[14px] flex justify-center items-center shadow"
          >
            {selectedYear}
          </button>

          {open && (
            <div className="absolute top-[42px] left-0 w-full bg-blue-100 rounded-xl shadow-md z-10 overflow-hidden">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => {
                    setSelectedYear(year);
                    setOpen(false);
                  }}
                  className={`w-full text-center py-2 hover:bg-blue-300 transition-all ${
                    year === selectedYear ? "font-bold bg-blue-200" : ""
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="overflow-y-auto no-scrollbar flex flex-col items-center gap-1 px-1">
          {months.map((month, i) => (
            <button key={i} onClick={() => setSelectedMonth(month)}>
              <File key={month} comment={month} />
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col w-full pl-6 mt-6">
        <div className="flex items-center">
          <h4 className="text-[26px] lowercase font-bold mr-5 min-w-[230px] border-b-2">
            ˚₊·{selectedMonth}—̳͟͞͞♡˚₊·
          </h4>
          <div className="flex w-full">
            {[1, 4, 9, 12, 24, 29, 31].map((item, i) => (
              <div key={i} className="">
                <button
                  onClick={() => setSelectedDay(31)}
                  className={`relative text-[18px] px-3 py-1 border-double border-7 mx-2 w-[60px] h-[60px] rounded-full ${
                    item === selectedDay
                      ? "bg-blue-100 border-blue-100 font-bold border-2"
                      : "border-gray-200"
                  } transition-all`}
                  style={{
                    backgroundImage: "url(/cha/1_3.png)",
                    objectFit: "cover",
                    backgroundSize: "60px",
                  }}
                >
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[12px]">
                    title
                  </span>
                  {/* {item} */}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-1 py-6">
          {imgs.slice(0, 7).map((item, i) => (
            <Fragment key={i}>
              {i === randomIndex && <FileNameBox bgImg="/cha/bg.png" textColor="" />}
              <img src={item.url} className="w-full h-[260px] object-cover" />
            </Fragment>
          ))}

          <div className="col-span-4 p-4">
            <span className="text-[16px] leading-relaxed text-gray-700 whitespace-pre-line">
              ✎ꪑ Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero id obcaecati, fuga
              ex, nulla eligendi tempore ad tempora, cumque omnis minima laudantium. Excepturi
              consequuntur omnis doloremque quis nam sint enim. Lorem ipsum dolor sit amet
              consectetur adipisicing elit. Vero id obcaecati, fuga ex, nulla eligendi tempore ad
              tempora, cumque omnis minima laudantium. Excepturi consequuntur omnis doloremque quis
              nam sint enim. Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero id
              obcaecati, fuga ex, nulla eligendi tempore ad tempora, cumque omnis minima laudantium.
              Excepturi consequuntur omnis doloremque quis nam sint enim. 𖤐
            </span>
          </div>

          {imgs.slice(8).map((item, i) => (
            <img key={i} src={item.url} className="w-full h-[260px] object-cover" />
          ))}
        </div>
      </div>
    </div>
  );
};

const imgs = [
  { url: "/cha/1_1.png" },
  // { url: "/cha/1_2.png" },
  { url: "/cha/1_3.png" },
  { url: "/cha/1_4.png" },
  { url: "/cha/1_5.png" },
  { url: "/cha/1_6.png" },
  { url: "/cha/1_7.png" },
  { url: "/cha/1_8.png" },
  { url: "/cha/1_9.png" },
  { url: "/cha/1_10.png" },
  { url: "/cha/1_11.png" },
  { url: "/cha/1_12.png" },
  { url: "/cha/1_13.png" },
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default FilePage;
