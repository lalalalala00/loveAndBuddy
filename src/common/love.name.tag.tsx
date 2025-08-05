import { useRouter } from "next/navigation";
import { useState } from "react";

const getMannerEmoji = (score: number) => {
  if (score >= 9) return "🌸";
  if (score >= 6) return "🍃";
  return "🌿";
};

export interface LoveProfileCardProps {
  nickname: string;
  level: number;
  mannerScore: number;
  dearLove: number;
  profileImg: string;
  loveId: string;
  ownerName: string;
  loveName: string;
  loveOld: number;
}

const LoveNameTag = ({
  loveData,
  wFull,
}: {
  loveData: LoveProfileCardProps;
  wFull?: boolean | undefined;
}) => {
  const router = useRouter();
  const mannerEmoji = getMannerEmoji(4);

  const [buddySelected, setBuddySelected] = useState(false);

  return (
    <div className="w-full">
      <div
        className="relative mt-1 text-center cursor-pointer flex h-full items-start p-1 rounded-lg bg-white btn-card"
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
        <div className={`${wFull ? "flex flex-col items-center w-full mr-3" : ""}`}>
          <div className="text-gray-800 font-semibold text-[13px] leading-tight">
            {loveData.loveName}
          </div>
          <div className="flex justify-center gap-2 mt-0.5 text-[11px] text-[#666]">
            <span className={`flex items-center gap-1 `}>
              <span className={`relative inline-block `}>ᵔᴥᵔ</span>

              <span className="font-medium">{loveData.level}</span>
            </span>

            <span className="flex items-center gap-1">
              {mannerEmoji} <span className="font-medium">{loveData.mannerScore}</span>
            </span>
            <span className="flex items-center gap-1">
              🐾 <span className="font-medium">{loveData.loveOld}</span>
            </span>
          </div>
        </div>
      </div>

      {buddySelected && (
        <div className="absolute top-[155px] left-1/2 -translate-x-1/2 z-20 w-[200px] bg-white rounded-xl px-2 py-3 btn-card animate-fadeIn">
          <div className="px-2">
            <p className="text-[12px] text-gray-600 mb-1">
              ᵔᴥᵔ 난이도: <span className="font-medium">{loveData.level}</span>
            </p>
            <p className="text-[12px] text-gray-600">
              {mannerEmoji} 매너 점수:{" "}
              <span className="font-medium">{loveData.mannerScore} 점</span>
            </p>
            <p className="text-[12px] text-gray-600">
              🐾 러브 나이: <span className="font-medium">{loveData.loveOld} 살</span>
            </p>
          </div>

          <button
            onClick={() => router.push(`/daerLove/${loveData.loveId}`)}
            className="cursor-pointer w-full mt-2 custom-card-hover custom-card rounded-lg"
          >
            <span className="text-[14px]"> {loveData.nickname} 러브룸 보러가기</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default LoveNameTag;
