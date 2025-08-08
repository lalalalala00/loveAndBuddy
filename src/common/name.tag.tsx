const NameTag = ({
  imgCss,
  tagCss,
  find,
}: {
  imgCss?: string;
  tagCss?: string;
  find?: boolean;
}) => {
  return (
    <div className="flex flex-col items-center p-2 rounded-2xl">
      <img
        src="/project/buddy_sit_1.png"
        alt=""
        className={` object-cover rounded-full ${imgCss ? imgCss : "w-[60px] h-[60px]"}`}
      />
      <div className={`${tagCss} flex items-center px-3 py-1`}>
        <span className="px-1 inline-block text-[12px] font-semibold">nickname</span>
        <span className="text-gray-400 text-[12px]">&#62;</span>
      </div>
      <div className={`${find ? "flex" : ""} ${tagCss}`}>
        <div className="flex items-center gap-1 text-[12px] text-[#666]">ꯁꯧ3 · 🍃4 · 🪪28</div>
        {find && (
          <div className="flex items-center gap-1 text-[12px] text-[#666] ml-2">
            | 여성 · 30대 · 강아지
          </div>
        )}
      </div>
    </div>
  );
};

export default NameTag;
