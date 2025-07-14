

const FilePage = () => {
  return (
    <div className="relative w-full min-h-screen bg-[#d0cfa7] overflow-hidden font-mono">
      {/* 메인 인물 이미지 */}
      <img
        src="/cha/1.png"
        alt="main"
        className="absolute left-[30%] top-[20%] w-[300px] drop-shadow-xl z-10"
      />

      {/* 스티커: 텍스트 말풍선 */}
      <div className="absolute top-[14%] left-[25%] bg-pink-300 px-3 py-1 rounded-full text-xs font-bold text-white shadow">
        Sometimes, I’m a Girl
      </div>
      <div className="absolute top-[40%] left-[52%] bg-black px-4 py-1 rounded-full text-white text-xs shadow">
        Bunny
      </div>

      {/* 눈 스티커 */}
      <div className="absolute top-[15%] left-[48%] text-3xl">👀</div>

      {/* 폴더들 */}
      <div className="absolute top-[60%] left-[12%] flex flex-col space-y-4 items-center text-sm font-semibold text-gray-700">
        <div className="bg-pink-300 w-16 h-12 rounded shadow-md flex items-end justify-center">
          <span className="mb-1">life</span>
        </div>
        <div className="bg-yellow-300 w-16 h-12 rounded shadow-md flex items-end justify-center">
          <span className="mb-1">dear</span>
        </div>
      </div>

      {/* 말풍선 팝업 느낌 요소들 */}
      <div className="absolute bottom-[10%] right-[15%] text-xs font-medium text-[#333]">
        <p>Sometimes, I pretend to be a bunny 🐰</p>
        <p className="text-[10px] mt-1">...and I actually believe it.</p>
      </div>

      {/* 경고 아이콘들 */}
      <div className="absolute left-[60%] top-[60%] text-2xl">⚠️</div>
      <div className="absolute left-[40%] bottom-[20%] text-2xl">⚠️</div>
    </div>
  );
};

export default FilePage;
