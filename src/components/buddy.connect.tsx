"use client";

import { useState } from "react";
import BuddyMessageRoom from "./buddy.message.room";

const BuddyConnect = () => {
  const [buddyToki, setBuddyToki] = useState<boolean>(false);

  return (
    <div
      className={`w-full border-2 rounded-2xl bg-amber-200 pt-3 pb-4 px-4 ${
        buddyToki ? "h-[640px]" : ""
      }`}
    >
      <div className="w-full flex justify-end pb-2">
        <button
          onClick={() => setBuddyToki(!buddyToki)}
          className="w-[20px] h-[12px] rounded-2xl bg-amber-400 mr-3 cursor-pointer"
        ></button>
        <button className="w-[50px] h-[12px] rounded-2xl bg-white cursor-pointer"></button>
      </div>
      <div className="relative flex justify-between items-center">
        <h1>buddyToki buddyConnect</h1>
        <div className="flex items-center">
          {/* <h1>stanley buddy</h1> */}
          <div className="rounded-full bg-red-600 w-3 h-3 ml-2" />
        </div>
      </div>
      <div className="pt-3 mt-2 border-t-2 w-full flex justify-end cursor-pointer">
        {!buddyToki && <span>읽지 않은 메세지가 5개 있습니다.</span>}
        {buddyToki && (
          <BuddyMessageRoom
            chatRoomId="6e43ecea-3772-4926-983d-8688acc9fb8d"
            senderId="6dc3998b-b201-4c89-bb1e-6400d92c79a5"
          />
        )}
      </div>
    </div>
  );
};

export default BuddyConnect;
