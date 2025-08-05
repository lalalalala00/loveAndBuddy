"use client";

import { useState } from "react";

import ListBox from "./list.box";
import AsapBoxBuddy from "./asap.box.buddy";

const Index = () => {
  const [selectedType, setSelectedType] = useState<number>(1);

  return (
    <div className="flex flex-col mt-5 mb-8 pb-10 rounded-2xl bg-[#fefefe] border-2 border-[#fafdf4] shadow-[4px_4px_10px_#f7f9f6,-4px_-4px_10px_#ffffff]">
      <div className="flex justify-center items-center text-center px-6 py-4 border-b border-gray-200 text-[15px] mb-16 font-semibold text-gray-700">
        -`♥´- find.MyDearDay_〘
        <div className="px-2 flex items-center">
          {type.map((item, i) => (
            <button
              key={i}
              onClick={() => setSelectedType(item.value)}
              className={`${item.value === selectedType ? "custom-card" : "custom-card-bg-white"} px-7 py-1 rounded-xl mr-3 last:mr-0`}
            >
              {item.label}
            </button>
          ))}
        </div>
        〙 -`♥´-
      </div>
      <div className="flex px-5">
        <div className="w-1/4 mr-5 rounded-2xl shadow-md bg-[#f3f7ee] p-4">
          <div className="relative mb-3 px-4 py-2 rounded-xl bg-gradient-to-br from-[#e3ecdc]/90 to-[#f3f7ee]/80 border border-[#d5e2c8] text-[#3c5732] text-center font-semibold text-[14px] tracking-tight shadow-[inset_2px_2px_5px_#ffffff,-2px_-2px_5px_#d5e2c8]">
            {selectedType === 0 ? (
              <span className="inline-flex items-center">
                <div className="text-[18px] animate-pulse mr-2">📍</div>
                급하게
                <span className="decoration-[#9dbb80] ml-2">»-buddy→</span>를 찾고 있어요!
              </span>
            ) : (
              <span className="inline-flex items-center text-nowrap">
                <div className="text-[18px] animate-pulse mr-1">🍀</div>
                인기가 좋은
                <span className="decoration-[#9dbb80] ml-2">buddy</span>를 소개해드릴께요.
              </span>
            )}
          </div>

          <div className="h-[800px] overflow-y-scroll no-scrollbar">
            {selectedType === 0 ? (
              <div>love list</div>
            ) : (
              <>
                <AsapBoxBuddy />
                <AsapBoxBuddy />
                <AsapBoxBuddy />
              </>
            )}
          </div>
        </div>
        <div className="w-3/4">
          <ListBox />
        </div>
      </div>
    </div>
  );
};

const type = [
  { label: "buddy", value: 1 },
  { label: "love", value: 0 },
  // { label: "lovuddy", value: 2 },
];
export default Index;
