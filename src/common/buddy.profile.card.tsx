import { useState } from "react";
import { useRouter } from "next/navigation";

interface BuddyProfileCardProps {
  nickname: string;
  hearts: number;
  mannerScore: number;
  dearLove: number;
  profileImg: string;
  buddyId: string;
}

const getMannerEmoji = (score: number) => {
  if (score >= 9) return "🌸";
  if (score >= 6) return "🍃";
  return "🌿";
};

const BuddyProfileCard = () => {
  const router = useRouter();
  const mannerEmoji = getMannerEmoji(4);

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
  const [floatingHearts, setFloatingHearts] = useState<number[]>([]);

  const hasLiked = hearts > buddyData.hearts;

  const handleDoubleClick = () => {
    if (!hasLiked) {
      setHearts((prev) => prev + 1);
      const id = Date.now();
      setFloatingHearts((prev) => [...prev, id]);

      setTimeout(() => {
        setFloatingHearts((prev) => prev.filter((item) => item !== id));
      }, 1000);
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
        <div className="absolute -top-1 -right-1 rotate-20">
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

      <div
        className="relative mt-1 text-center cursor-pointer flex h-full items-start p-1 rounded-lg bg-white border border-[#e6e6e66a] shadow-[inset_4px_8px_10px_#f3f7ee,-4px_-4px_10px_#ffffff]"
        onClick={() => setBuddySelected(!buddySelected)}
      >
        <div className="flex flex-col items-center justify-center w-3 bg-[#e6e6e6] border border-white/20 shadow-[inset_4px_8px_10px_#f3f7ee,-4px_-4px_10px_#ffffff] mr-2 rounded-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="35"
            fill="#fff"
            viewBox="0 0 16 16"
          >
            <path d="M9 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM9 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM9 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
          </svg>
        </div>
        <div>
          <div className="text-gray-800 font-semibold text-[13px] leading-tight">
            {buddyData.nickname}꒰⍢꒱ ༘*
          </div>
          <div className="flex justify-center gap-2 mt-0.5 text-[11px] text-[#666]">
            <span className={`flex items-center gap-1 `}>
              <span
                className={`relative inline-block  ${hasLiked ? "text-red-500" : "text-gray-600"}`}
              >
                ꯁꯧ
                {hasLiked && (
                  <span className="absolute text-red-400 text-[22px] heart-float top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    ꯁꯧ🌸
                  </span>
                )}
              </span>

              <span className="font-medium">{hearts}</span>
            </span>

            <span className="flex items-center gap-1">
              {mannerEmoji} <span className="font-medium">{buddyData.mannerScore}</span>
            </span>
            <span className="flex items-center gap-1">
              ✎ꪑ <span className="font-medium">{buddyData.dearLove}</span>
            </span>
          </div>
        </div>
      </div>

      {buddySelected && (
        <div className="absolute  top-[155px] z-20 w-[200px] bg-white rounded-xl px-2 py-3 border border-[#e6e6e66a] shadow-[inset_4px_8px_10px_#f6f8f4,-4px_-4px_10px_#ffffff] animate-fadeIn">
          {/* <p className="text-[13px] text-gray-800 font-semibold mb-1">{buddyData.nickname}</p> */}
          <div className="px-2">
            <p className="text-[12px] text-gray-600 mb-1">
              ꯁꯧ 마음: <span className="font-medium">{buddyData.hearts}</span>
            </p>
            <p className="text-[12px] text-gray-600">
              {mannerEmoji} 매너 점수: <span className="font-medium">{buddyData.mannerScore}</span>
            </p>
            <p className="text-[12px] text-gray-600">
              ✎ꪑ 디얼 러브: <span className="font-medium">{buddyData.dearLove}</span>
            </p>
          </div>

          <button
            onClick={() => router.push(`/buddy/${buddyData.buddyId}`)}
            className="cursor-pointer w-full mt-2 border hover:shadow-[inset_4px_8px_10px_#f3f7ee,-4px_-4px_10px_#ffffff] hover:border-[#e6e6e677] bg-[#dce9cd] hover:bg-white rounded-md  border-white/20  shadow-[inset_4px_8px_10px_#f3f7ee,-4px_-4px_10px_#ffffff] "
          >
            <span className="text-[14px]"> {buddyData.nickname} 버디룸 보러가기</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default BuddyProfileCard;
