"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import BuddyMessageRoom from "./buddy.message.room";
import { supabase } from "@/lib/supabaseClient";

const BuddyConnect = ({ setSelectedClose }: { setSelectedClose: (value: string) => void }) => {
  const [buddyToki, setBuddyToki] = useState<boolean>(false);
  const [buddySelected, setBuddySelected] = useState<boolean>(false);

  const userId = "6dc3998b-b201-4c89-bb1e-6400d92c79a5";

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.rpc("get_chat_list_for_user", {
        uid: userId,
      });

      if (error) {
        console.error("err:", error);
      } else {
        console.log(data);
      }
    })();
  }, []);

  const handleReSize = () => {
    if (buddySelected) {
      return;
    } else {
      setBuddyToki(!buddyToki);
    }
  };

  const handelBdSelected = () => {
    setBuddySelected(!buddySelected);
    setBuddyToki(true);
  };

  return (
    <div
      className={`relative rounded-2xl border border-gray-300 pb-4   ${buddyToki ? "h-[520px] w-[400px]" : "h-[200px] w-[400px]"}`}
    >
      <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-red-500 flex justify-center items-center text-white font-semibold text-[14px]">
        5
      </div>
      <div className="w-full flex items-center p-2">
        <div className="flex-1 flex justify-start">
          <button
            onClick={() => setSelectedClose("toki")}
            className="h-[14px] w-[14px] rounded-full bg-red-500 mr-2"
          ></button>
        </div>

        <div className="flex-1 flex justify-center">
          <span className="text-[12px] font-bold text-center px-2 py-1">buddyToki</span>
        </div>

        <div className="flex-1 flex justify-end">
          <button
            onClick={handleReSize}
            className={`w-[50px] h-[12px] rounded-2xl bg-amber-400 ${buddySelected ? "cursor-not-allowed" : ""}`}
          ></button>
        </div>
      </div>

      {buddySelected ? (
        <div>
          <div className="flex justify-between px-2 py-1 border-y border-gray-300">
            <button className="flex-1 flex justify-start" onClick={() => setBuddySelected(false)}>
              &#60;
            </button>
            <span className="flex-1 flex justify-center">name</span>
            <button className="flex-1 flex justify-end">!</button>
          </div>
          <div className="p-2 mt-1">
            <BuddyMessageRoom
              chatRoomId="6e43ecea-3772-4926-983d-8688acc9fb8d"
              senderId="6dc3998b-b201-4c89-bb1e-6400d92c79a5"
            />
          </div>
        </div>
      ) : (
        <div className={` border-t border-gray-300 w-full flex cursor-pointer px-1 py-2 `}>
          <div
            className={`no-scrollbar flex flex-col items-start w-full overflow-y-scroll ${buddyToki ? "h-[460px]" : "h-[140px]"}`}
          >
            <button className="flex w-full p-1 items-center" onClick={handelBdSelected}>
              <img
                src="/cha/1_12.png"
                alt=""
                className="w-12 h-12 min-w-12 rounded-full object-full"
              />
              <div className="flex flex-col ml-2 w-full border-b border-gray-300 pb-2">
                <div className="flex justify-between w-full">
                  <span className="text-[12px]">cheerrry_</span>
                  <span className="text-[12px]">어제</span>
                </div>
                <div className="flex justify-between w-full">
                  <span className="text-[13px]">comment~~~~@@@@!!!!!</span>
                  <span className="text-[12px] w-4 h-4 flex justify-center items-center rounded-full bg-red-500 text-white">
                    3
                  </span>
                </div>
              </div>
            </button>
            <div className="flex w-full p-1 items-center">
              <img
                src="/cha/1_11.png"
                alt=""
                className="w-12 h-12 min-w-12 rounded-full object-full"
              />
              <div className="flex flex-col ml-2 w-full border-b border-gray-300 pb-2">
                <div className="flex justify-between w-full">
                  <span className="text-[12px]">cheerrry_</span>
                  <span className="text-[12px]">어제</span>
                </div>
                <div className="flex justify-between w-full">
                  <span className="text-[13px]">comment~~~~</span>
                  <span className="text-[12px] w-4 h-4 flex justify-center items-center rounded-full bg-red-500 text-white">
                    3
                  </span>
                </div>
              </div>
            </div>
            <div className="flex w-full p-1 items-center">
              <img
                src="/cha/1_10.png"
                alt=""
                className="w-12 h-12 min-w-12 rounded-full object-full"
              />
              <div className="flex flex-col ml-2 w-full border-b border-gray-300 pb-2">
                <div className="flex justify-between w-full">
                  <span className="text-[12px]">cheerrry_</span>
                  <span className="text-[12px]">어제</span>
                </div>
                <div className="flex justify-between w-full">
                  <span className="text-[13px]">comment~~~~</span>
                  <span className="text-[12px] w-4 h-4 flex justify-center items-center rounded-full bg-red-500 text-white">
                    3
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuddyConnect;
