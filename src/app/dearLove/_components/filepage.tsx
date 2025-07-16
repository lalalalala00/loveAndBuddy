"use client";

import { Fragment, useState } from "react";
import File from "./file";
import FileNameBox from "./file.name.box";

const FilePage = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [randomNameBox, setRandomNameBox] = useState<number>(0);
  const [selectedDay, setSelectedDay] = useState<number>(31);

  const randomIndex = Math.floor(Math.random() * randomNameBox);
  // const randomIndex = Math.floor(Math.random() * (imgs.length + 1));

  return (
    <div className="flex w-full">
      <div className="w-[200px] h-[70%] border-r border-black overflow-scroll flex flex-col items-center">
        {months.map((month, i) => (
          <button key={i} onClick={() => setSelectedMonth(month)}>
            <File key={month} comment={month} />
          </button>
        ))}
      </div>
      <div className="flex flex-col w-full px-6">
        <div className="flex items-center">
          <h1 className="text-[28px] lowercase font-bold mr-5">{selectedMonth}</h1>
          <div className="flex w-full">
            {[1, 4, 9, 12, 24, 29, 31].map((item, i) => (
              <div key={i} className="">
                <button
                  onClick={() => setSelectedDay(31)}
                  className={`relative text-[18px] px-3 py-1 border mx-2 w-[60px] rounded-full ${item === selectedDay ? "font-bold border-2" : ""}`}
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2">mon</span>
                  {item}
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
            <span className="text-[14px]">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero id obcaecati, fuga ex,
              nulla eligendi tempore ad tempora, cumque omnis minima laudantium. Excepturi
              consequuntur omnis doloremque quis nam sint enim. Lorem ipsum dolor sit amet
              consectetur adipisicing elit. Vero id obcaecati, fuga ex, nulla eligendi tempore ad
              tempora, cumque omnis minima laudantium. Excepturi consequuntur omnis doloremque quis
              nam sint enim. Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero id
              obcaecati, fuga ex, nulla eligendi tempore ad tempora, cumque omnis minima laudantium.
              Excepturi consequuntur omnis doloremque quis nam sint enim.
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
