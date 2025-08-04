// "use client";

// import { Fragment, useState } from "react";
// import File from "./file";
// import FileNameBox from "./file.name.box";

// const FilePage = () => {
//   const [selectedMonth, setSelectedMonth] = useState<string>("");
//   const [randomNameBox, setRandomNameBox] = useState<number>(0);
//   const [selectedDay, setSelectedDay] = useState<number>(31);
//   const [selectedYear, setSelectedYear] = useState<number>(2025);
//   const [open, setOpen] = useState<boolean>(false);

//   const years = [2025, 2024, 2023, 2022];

//   const randomIndex = Math.floor(Math.random() * randomNameBox);
//   // const randomIndex = Math.floor(Math.random() * (imgs.length + 1));

//   return (
//     <div className="flex w-full">
//       <div className="w-[200px] h-[70%] rounded-2xl shadow overflow-hidden flex flex-col items-center py-3 bg-white/20">
//         <div className="relative w-[160px] mb-4">
//           <button
//             onClick={() => setOpen(!open)}
//             className="font-bold h-[38px] w-full rounded-xl bg-blue-100 hover:bg-blue-200 text-[14px] flex justify-center items-center shadow"
//           >
//             {selectedYear}
//           </button>

//           {open && (
//             <div className="absolute top-[42px] left-0 w-full bg-blue-100 rounded-xl shadow-md z-10 overflow-hidden">
//               {years.map((year) => (
//                 <button
//                   key={year}
//                   onClick={() => {
//                     setSelectedYear(year);
//                     setOpen(false);
//                   }}
//                   className={`w-full text-center py-2 hover:bg-blue-300 transition-all ${
//                     year === selectedYear ? "font-bold bg-blue-200" : ""
//                   }`}
//                 >
//                   {year}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>

//         <div className="overflow-y-auto no-scrollbar flex flex-col items-center gap-1 px-1">
//           {months.map((month, i) => (
//             <button key={i} onClick={() => setSelectedMonth(month)}>
//               <File key={month} comment={month} />
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="flex flex-col w-full pl-6 mt-6">
//         <div className="flex items-center">
//           <h4 className="text-[26px] lowercase font-bold mr-5 min-w-[230px] border-b-2">
//             ˚₊·{selectedMonth}—̳͟͞͞♡˚₊·
//           </h4>
//           <div className="flex w-full">
//             {[1, 4, 9, 12, 24, 29, 31].map((item, i) => (
//               <div key={i} className="">
//                 <button
//                   onClick={() => setSelectedDay(31)}
//                   className={`relative text-[18px] px-3 py-1 border-double border-7 mx-2 w-[60px] h-[60px] rounded-full ${
//                     item === selectedDay
//                       ? "bg-blue-100 border-blue-100 font-bold border-2"
//                       : "border-gray-200"
//                   } transition-all`}
//                   style={{
//                     backgroundImage: "url(/cha/1_3.png)",
//                     objectFit: "cover",
//                     backgroundSize: "60px",
//                   }}
//                 >
//                   <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[12px]">
//                     title
//                   </span>
//                   {/* {item} */}
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//         <div className="grid grid-cols-4 gap-1 py-6">
//           {imgs.slice(0, 7).map((item, i) => (
//             <Fragment key={i}>
//               {i === randomIndex && <FileNameBox bgImg="/cha/bg.png" textColor="" />}
//               <img src={item.url} className="w-full h-[260px] object-cover" />
//             </Fragment>
//           ))}

//           <div className="col-span-4 p-4">
//             <span className="text-[16px] leading-relaxed text-gray-700 whitespace-pre-line">
//               ✎ꪑ Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero id obcaecati, fuga
//               ex, nulla eligendi tempore ad tempora, cumque omnis minima laudantium. Excepturi
//               consequuntur omnis doloremque quis nam sint enim. Lorem ipsum dolor sit amet
//               consectetur adipisicing elit. Vero id obcaecati, fuga ex, nulla eligendi tempore ad
//               tempora, cumque omnis minima laudantium. Excepturi consequuntur omnis doloremque quis
//               nam sint enim. Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero id
//               obcaecati, fuga ex, nulla eligendi tempore ad tempora, cumque omnis minima laudantium.
//               Excepturi consequuntur omnis doloremque quis nam sint enim. 𖤐
//             </span>
//           </div>

//           {imgs.slice(8).map((item, i) => (
//             <img key={i} src={item.url} className="w-full h-[260px] object-cover" />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// const imgs = [
//   { url: "/cha/1_1.png" },
//   // { url: "/cha/1_2.png" },
//   { url: "/cha/1_3.png" },
//   { url: "/cha/1_4.png" },
//   { url: "/cha/1_5.png" },
//   { url: "/cha/1_6.png" },
//   { url: "/cha/1_7.png" },
//   { url: "/cha/1_8.png" },
//   { url: "/cha/1_9.png" },
//   { url: "/cha/1_10.png" },
//   { url: "/cha/1_11.png" },
//   { url: "/cha/1_12.png" },
//   { url: "/cha/1_13.png" },
// ];

// const months = [
//   "January",
//   "February",
//   "March",
//   "April",
//   "May",
//   "June",
//   "July",
//   "August",
//   "September",
//   "October",
//   "November",
//   "December",
// ];

// export default FilePage;

"use client";

import { Fragment, useEffect, useState } from "react";
import FileNameBox from "./file.name.box";

import PhotoModal from "./modal.photo";

import ModalIos from "@/common/modal.ios";
import DiaryMessage from "./diary.message";
import BuddyProfileCard from "@/common/buddy.profile.card";

const FilePage = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>("August");
  const [randomNameBox, setRandomNameBox] = useState<number>(0);
  const [selectedDay, setSelectedDay] = useState<number>(31);
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [open, setOpen] = useState<boolean>(false);

  const [selectedPhoto, setSelectedPhoto] = useState<boolean>(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const years = [2025, 2024, 2023, 2022];

  const randomIndex = Math.floor(Math.random() * randomNameBox);
  // const randomIndex = Math.floor(Math.random() * (imgs.length + 1));

  const handlePhotoClick = (i: number) => {
    setSelectedPhoto(!selectedPhoto);
    setSelectedPhotoIndex(i);
  };

  const fullText = ` Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero id obcaecati, fuga ex, nulla eligendi tempore...`;

  return (
    <div className="flex w-full flex-col">
      <div className="text-center px-6 py-4 border-b border-gray-200 text-[15px] mb-16 font-semibold text-gray-700">
        -`♥´- dear.Love_〘 chanelu 〙 -`♥´-
      </div>

      <div className="flex px-5">
        <div className="min-w-[220px] rounded-2xl shadow-md bg-[#f3f7ee] h-[550px] px-4 py-5 flex flex-col items-center">
          <div className="relative w-full mb-6">
            <button
              onClick={() => setOpen(!open)}
              className="font-bold text-[16px] h-[40px] cursor-pointer w-full hover:bg-white/80 bg-[#e3ecdc] flex justify-center items-center border border-white/20 rounded-2xl shadow-[inset_4px_8px_10px_#f3f7ee,-4px_-4px_10px_#ffffff]"
              // className="font-bold h-[40px] w-full rounded-xl bg-white hover:bg-[#e3ecdc] text-[14px] flex justify-center items-center shadow-sm"
            >
              {selectedYear}
            </button>
            {open && (
              <div className="absolute top-[44px] p-2 left-0 w-full bg-white border border-white/20 rounded-2xl shadow-[inset_4px_8px_10px_#f3f7ee,-4px_-4px_10px_#ffffff]  z-10 overflow-hidden">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => {
                      setSelectedYear(year);
                      setOpen(false);
                    }}
                    className={`w-full text-center py-2 mb-1 hover:bg-[#dce9cd] rounded-xl hover:border hover:border-white/20  hover:shadow-[inset_4px_8px_10px_#f3f7ee,-4px_-4px_10px_#ffffff] ${year === selectedYear ? "font-bold bg-[#e3ecdc]  border border-white/20 rounded-2xl shadow-[inset_4px_8px_10px_#f3f7ee,-4px_-4px_10px_#ffffff]" : ""}`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1 overflow-y-auto no-scrollbar w-full">
            {months.map((month, i) => (
              <button
                key={i}
                onClick={() => setSelectedMonth(month)}
                className={`text-sm lowercase tracking-tight rounded-md px-2 py-1 w-full text-left hover:bg-[#e3ecdc] hover:border hover:border-white/20  hover:shadow-[inset_4px_8px_10px_#f3f7ee,-4px_-4px_10px_#ffffff] ${selectedMonth === month ? "bg-white font-semibold text-[#5b7551]" : ""}`}
              >
                {month}_[3].zip
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col pl-8">
          <div className="mt-2 mb-4">
            <h4 className="text-[28px] font-bold lowercase text-[#5b7551]">
              ˚₊· {selectedMonth} —̳͟͞͞♡ ˚₊·
            </h4>
          </div>

          <div className="flex flex-col w-full">
            <div className="flex gap-4 mb-4">
              {[1, 4, 9, 12, 24, 29, 31].map((item) => (
                <button
                  key={item}
                  onClick={() => setSelectedDay(item)}
                  className={`relative text-[16px] px-2 py-1 rounded-full h-[60px]  w-[60px] border border-[#e6e6e67d] shadow-[inset_4px_8px_10px_#f3f7ee,-4px_-4px_10px_#ffffff] ${
                    item === selectedDay ? "font-bold  bg-[#e3ecdc] ]" : " bg-[#e7e7e7]"
                  } transition-all shadow-sm`}
                >
                  <img
                    src="/cha/1_3.png"
                    className={`${item === selectedDay ? "" : ""} rounded-full w-[50px] h-[50px]  absolute top-1/2 left-1/2 object-cover -translate-x-1/2 -translate-y-1/2`}
                  />
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[12px] text-gray-700 flex text-nowrap">
                    {item}일
                  </span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-1 py-6 mb-8">
              {imgs.slice(0, 3).map((item, i) => {
                const actualIndex = i;
                return (
                  <Fragment key={i}>
                    {i === randomIndex && <FileNameBox bgImg="/cha/bg.png" textColor="" />}
                    <img
                      src={item.url}
                      className="w-full h-[260px] object-cover cursor-pointer shadow-xl"
                      onClick={() => handlePhotoClick(actualIndex)}
                    />
                  </Fragment>
                );
              })}

              <div className="col-span-4 flex w-full flex-col items-center mt-4 min-h-[200px]">
                <span className="text-[12px] text-[#8f8f8f] text-shadow-2xs">
                  8월 1일 (금) 오전 9:35
                </span>
                <div className="flex items-start w-full">
                  <div className="w-[14%] mt-2 flex flex-col items-center mr-3">
                    <BuddyProfileCard />
                  </div>

                  <div className="w-[88%]">
                    <DiaryMessage
                      text={
                        `Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero id obcaecati, fuga ex, nulla eligendi tempore ad tempora, cumque omnis minima laudantium. Excepturi consequuntur omnis doloremque quis nam sint enim. Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero id obcaecati, fuga ex, nulla eligendi tempore ad tempora, cumque omnis minima laudantium. Excepturi consequuntur omnis doloremque quis nam sint enim.` ??
                        ""
                      }
                    />
                  </div>
                </div>
              </div>

              {/* <div className="col-span-4 p-4 border border-[#e3ecdc] bg-white rounded-xl">
              <p className="text-[16px] leading-relaxed text-gray-700 whitespace-pre-wrap font-sans">
                ✎ꪑ{displayedText} 𖤐
                <span className="animate-blink text-[#9dbb80] font-bold ml-1">|</span>
              </p>
            </div> */}

              {imgs.slice(3).map((item, i) => {
                const actualIndex = i + 8;
                return (
                  <img
                    key={actualIndex}
                    src={item.url}
                    className="w-full h-[260px] object-cover cursor-pointer shadow-xl"
                    onClick={() => handlePhotoClick(actualIndex)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <ModalIos
        isOpen={selectedPhoto}
        handleModalState={() => setSelectedPhoto(!selectedPhoto)}
        width="50%"
        height="800px"
        title={"title"}
        leftComment="*⁀➷♥ Heart ⌁❤︎⌁﻿"
      >
        <PhotoModal
          handleModalState={() => setSelectedPhoto(!selectedPhoto)}
          images={imgs}
          selectedIndex={selectedPhotoIndex}
        />
      </ModalIos>
    </div>
  );
};

const imgs = [
  { url: "/cha/1_1.png" },
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
