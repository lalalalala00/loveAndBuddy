import BuddyNameTag from "@/common/buddy.name.tag";

const AsapBoxBuddy2 = () => {
  const buddy = {
    nickname: "buddy",
    hearts: 2,
    mannerScore: 4,
    dearLove: 28,
    profileImg: "/project/buddy_sit_1.png",
    buddyId: "buddyId",
  };
  return (
    <div className="relative custom-card-bg-white p-3 rounded-2xl my-4">
      <div className="absolute -top-2 -left-1 p-1 rounded-full custom-card w-9 z-1">
        <img src="/buddy/buddy_back_none.png" className="w-7 h-7" />
      </div>

      <div className="relative flex flex-col items-start">
        <div className="flex items-center">
          <img
            src="/project/buddy_sit_1.png"
            className="w-38 h-20 rounded-lg object-cover mb-1 shadow-2xl"
          />
          <div className=" flex flex-col text-[14px] ml-2">
            <span>ꤶ 사진촬영동의</span>
            <span>ꤶ 신원인증</span>
            <span>ꤶ 인성검사완료</span>

            {/* <span>📸 사진촬영동의</span>
            <span>🪪 신원인증</span>
            <span>✔️ 인성검사완료</span> */}
          </div>
        </div>

        <BuddyNameTag hearts={3} buddyData={buddy} wFull />

        <div className="flex flex-col text-[12px] items-start w-full px-1 my-2">
          <span>✰ 수의간호 교원자격증 보유</span>
          <span>✰ 애완동물관리 직무능력 인증서 보유</span>
          <span>✰ 펫시터 전문가 교육 수료</span>
          <span>✰ 고양이 반려경험 14년 인증</span>
          <div className="border-t w-full border-[#e6e6e6] py-0.5 mt-0.5" />
          <span className="text-gray-800">❀ 탁샤넬 버디의 한마디 -`♡´-</span>
          <span className="ml-3 font-semibold">언제나 내 가족처럼 사랑할께요 ❣</span>
        </div>
      </div>
      <button className="btn-card custom-card-hover w-full rounded-lg py-2 bg-[#e6e6e67d] text-[14px] cursor-pointer">
        대화하기
      </button>
    </div>
  );
};

export default AsapBoxBuddy2;
