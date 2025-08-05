import { useRouter } from "next/navigation";
import { useState } from "react";
import { BuddyProfileCardProps } from "./buddy.profile.card";

const getMannerEmoji = (score: number) => {
  if (score >= 9) return "🌸";
  if (score >= 6) return "🍃";
  return "🌿";
};

const BuddyNameTag = ({
  hearts,
  buddyData,
  wFull,
}: {
  hearts: number;
  buddyData: BuddyProfileCardProps;
  wFull?: boolean | undefined;
}) => {
  const router = useRouter();
  const mannerEmoji = getMannerEmoji(4);

  const [buddySelected, setBuddySelected] = useState(false);
  const hasLiked = hearts > buddyData.hearts;
  console.log(wFull);
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
        <div className="absolute top-[155px] left-1/2 -translate-x-1/2 z-20 w-[200px] bg-white rounded-xl px-2 py-3 btn-card animate-fadeIn">
          {/* <p className="text-[13px] text-gray-800 font-semibold mb-1">{buddyData.nickname}</p> */}
          <div className="px-2">
            <p className="text-[12px] text-gray-600 mb-1">
              ꯁꯧ 마음: <span className="font-medium">{buddyData.hearts}</span>
            </p>
            <p className="text-[12px] text-gray-600">
              {mannerEmoji} 매너 점수:{" "}
              <span className="font-medium">{buddyData.mannerScore} 점</span>
            </p>
            <p className="text-[12px] text-gray-600">
              ✎ꪑ 디얼 러브: <span className="font-medium">{buddyData.dearLove} 장</span>
            </p>
          </div>

          <button
            onClick={() => router.push(`/buddy/${buddyData.buddyId}`)}
            className="cursor-pointer w-full mt-2 custom-card-hover custom-card rounded-lg"
          >
            <span className="text-[14px]"> {buddyData.nickname} 버디룸 보러가기</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default BuddyNameTag;
