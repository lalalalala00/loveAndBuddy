import { useEffect, useState } from "react";

const MAX_PREVIEW_LENGTH = 200;

const DiaryMessage = ({ text }: { text: string }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded((prev) => !prev);
  const shouldTruncate = text.length > MAX_PREVIEW_LENGTH;
  //   const displayedText = expanded ? text : text.slice(0, MAX_PREVIEW_LENGTH);

  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      if (!text || i >= text.length) {
        clearInterval(typing);
        return;
      }
      setDisplayedText((prev) => prev + text[i]);
      i++;
    }, 20);

    return () => clearInterval(typing);
  }, [text]);

  return (
    <div className="w-full my-3 relative">
      <div className="relative bg-white border border-[#e7e7e7]  rounded-2xl px-4 py-3 shadow-inner max-w-full bubble">
        <p className="text-[16px] text-gray-700 font-sans whitespace-pre-wrap">
          ✎ꪑ
          {/* {displayedText} */}
          {text}
          {/* {shouldTruncate && (
            <button
              className="text-[#9dbb80] font-bold ml-2 underline underline-offset-2"
              onClick={toggleExpanded}
            >
              {expanded ? "접기" : "더보기"}
            </button>
          )} */}
          𖤐
          <span className="animate-blink text-[#9dbb80] font-bold ml-1">|</span>
        </p>
      </div>
    </div>
  );
};

export default DiaryMessage;
