"use client";

import { useRouter } from "next/navigation";
import { useUserState } from "../context/useUserContext";

const Header = () => {
  const router = useRouter();
  const { userState, setUserState } = useUserState();

  const menu = userState === "lover" ? loveMenu : buddyMenu;

  return (
    <div className="flex mt-5 justify-between">
      <div className="flex">
        {menu.map((item, i) => (
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
        <button>love and buddy</button>
      </div>
    </div>
  );
};

const loveMenu = [
  { label: "home", url: "/" },
  { label: "buddy", url: "/buddy" },
  { label: "mySchedule", url: "/mySchedule" },
  { label: "community", url: "/community" },
];
const buddyMenu = [
  { label: "home", url: "/" },
  { label: "love", url: "/love" },
  { label: "mySchedule", url: "/mySchedule" },
  { label: "community", url: "/community" },
];

export default Header;
