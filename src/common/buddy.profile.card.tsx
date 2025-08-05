import { useState } from "react";
import { useRouter } from "next/navigation";
import BuddyNameTag from "./buddy.name.tag";

export interface BuddyProfileCardProps {
  nickname: string;
  hearts: number;
  mannerScore: number;
  dearLove: number;
  profileImg: string;
  buddyId: string;
}

const BuddyProfileCard = () => {
  const [buddyData, setBuddyData] = useState<BuddyProfileCardProps>({
    nickname: "buddy",
    hearts: 2,
    mannerScore: 4,
    dearLove: 28,
    profileImg: "/project/buddy_sit_1.png",
    buddyId: "buddyId",
  });
  const [buddySelected, setBuddySelected] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const [hearts, setHearts] = useState(buddyData.hearts);

  const hasLiked = hearts > buddyData.hearts;

  const handleDoubleClick = () => {
    if (!hasLiked) {
      setHearts((prev) => prev + 1);
    } else {
      setHearts((prev) => prev - 1);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="relative flex flex-col items-center group cursor-double ">
      <img
        src={buddyData.profileImg}
        onDoubleClick={handleDoubleClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="w-[100px] h-[100px] rounded-full object-cover border border-[#e6e6e6] shadow-sm"
      />
      {hasLiked && (
        <div className="absolute top-1 right-1 rotate-20">
          <span className="text-[20px] font-bold text-red-300 duration-150">ꯁꯧ</span>
        </div>
      )}

      {showTooltip && (
        <div
          className="fixed z-50 px-2 py-1 text-[11px] font-semibold text-white bg-black shadow pointer-events-none transition-opacity duration-150"
          style={{
            left: cursorPos.x + 15,
            top: cursorPos.y + 10,
          }}
        >
          Double Click =&#62; 💕
        </div>
      )}
      <BuddyNameTag hearts={hearts} buddyData={buddyData} />
    </div>
  );
};

export default BuddyProfileCard;
