import BuddyNameTag from "@/common/buddy.name.tag";

const AsapBoxBuddy = () => {
  const buddy = {
    nickname: "buddy",
    hearts: 2,
    mannerScore: 4,
    dearLove: 28,
    profileImg: "/project/buddy_sit_1.png",
    buddyId: "buddyId",
  };
  return (
    <div className="relative flex w-full bg-white rounded-xl shadow p-2 flex-col custom-card-bg-white mb-3">
      {/* <div className="absolute -top-2 -left-3 p-1 rounded-full custom-card w-9 z-1">
        <img src="/buddy/buddy_back_none.png" className="w-7 h-7" />
      </div> */}
      <div className="flex mb-1">
        <img
          src="/project/buddy_sit_1.png"
          className="w-[60px] h-[60px] min-w-[60px] rounded-full object-cover mr-2"
        />
        <div className="flex flex-col justify-between w-2/3">
          <div className="text-[11px] text-gray-500 ml-2 ">📸 · 🪪 · ✔️</div>
          <BuddyNameTag hearts={3} buddyData={buddy} />
        </div>
      </div>
      <div className="flex flex-col text-[12px] items-start w-full px-1 my-2">
        <span>✰ 수의간호 교원자격증 보유</span>
        <span>✰ 애완동물관리 직무능력 인증서 보유</span>
        <span>✰ 펫시터 전문가 교육 수료</span>
        <span>✰ 고양이 반려경험 14년 인증</span>
        <div className="border-t w-full border-[#e6e6e6] py-0.5 mt-0.5" />

        <span className="text-gray-800">❀ 탁샤넬 버디의 한마디 -`♡´-</span>
        <span className="ml-3 font-semibold">언제나 내 가족처럼 사랑할께요 ❣</span>
      </div>

      <button className="btn-card custom-card-hover w-full mt-1 text-[12px] py-1 rounded-md">
        대화하기
      </button>
    </div>
  );
};

export default AsapBoxBuddy;
