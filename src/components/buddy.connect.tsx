"use client";

import { useState } from "react";

const BuddyConnect = () => {
  const [buddyToki, setBuddyToki] = useState<boolean>(false);

  return (
    <div className="w-full border-2 rounded-2xl bg-amber-200 p-4">
      <div className="relative flex justify-between items-center">
        <h1>buddyToki buddyConnect</h1>
        <div className="flex items-center">
          <h1>stanley buddy</h1>
          <div className="rounded-full bg-red-600 w-3 h-3 ml-2" />
        </div>
      </div>
      <div className="pt-3 mt-2 border-t-2 w-full flex justify-end">
        <span>읽지 않은 메세지가 5개 있습니다.</span>
      </div>
    </div>
  );
};
export default BuddyConnect;
