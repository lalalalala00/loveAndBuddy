"use client";

import { useRouter } from "next/navigation";
import { UserStateType, useUserState } from "../context/useUserContext";
import { useTypedRouter } from "@/hooks/userTypeRouter";
import { useEffect, useState } from "react";

const Header = () => {
  const router = useRouter();
  const { userState, setUserState } = useUserState();
  const { push } = useTypedRouter();

  const [pendingType, setPendingType] = useState<UserStateType | null>(null);

  const currentUser = userType.find((u) => u.label === userState);

  const typeMenu = [
    { label: "home", url: "/" },
    { label: currentUser?.label, url: "/lovuddy" },
    { label: "mySchedule", url: "/mySchedule" },
    { label: "community", url: "/community" },
  ];

  const handleTabClick = (type: UserStateType) => {
    setUserState(type);
    setPendingType(type);
  };

  useEffect(() => {
    if (pendingType) {
      router.push(`/?type=${pendingType}`);
      setPendingType(null);
    }
  }, [userState]);

  return (
    <div className="flex mt-5 justify-between items-center">
      <div className="flex">
        {typeMenu.map((item, i) => (
          <button
            key={i}
            onClick={() => router.push(item.url)}
            className="w-[200px] rounded-md border border-black flex justify-center items-center text-[14px] h-[30px] mx-3"
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="h-[30px] w-[200px]">
        {userType.map((item, i) => (
          <button
            key={i}
            onClick={() => handleTabClick(item.label)}
            className={` border-black border-r last:border-r-0 px-2 ${
              userState === item.label ? "bg-blue-200" : ""
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const userType: { label: UserStateType; type: number }[] = [
  { label: "love", type: 0 },
  { label: "lovuddy", type: 2 },
  { label: "buddy", type: 1 },
];

export default Header;
