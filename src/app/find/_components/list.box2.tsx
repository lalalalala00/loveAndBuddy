import BuddyNameTag from "@/common/buddy.name.tag";

const ListBox2 = () => {
  const buddy = {
    nickname: "buddy",
    hearts: 2,
    mannerScore: 4,
    dearLove: 28,
    profileImg: "/project/buddy_sit_1.png",
    buddyId: "buddyId",
  };

  return (
    <div className="rounded-2xl w-full h-[370px] shadow">
      <div className="flex flex-col items-center p-2 bg-[rgb(246,246,246)] border-b border-[rgb(227,227,227)] rounded-t-2xl">
        <img
          src="/project/buddy_sit_1.png"
          alt=""
          className="w-[60px] h-[60px] object-cover rounded-full"
        />
        <div className="flex items-center px-3 py-1 ">
          <span className="px-1 inline-block text-[12px] font-semibold">nickname</span>
          <span className="text-gray-400 text-[12px]">&#62;</span>
        </div>
        <div className="flex items-center gap-1 text-[12px] text-[#666]">ꯁꯧ3 · 🍃4 · 🪪28</div>
      </div>
      <div className="p-2 flex flex-col justify-between h-[245px]">
        <div className="">
          <div className="text-[12px] text-gray-500 ml-1 mt-2">
            📸 사진촬영동의 · 🪪 신원인증 · ✔️ 인성검사완료
          </div>
          <span className="text-[12px] text-gray-600 flex justify-center my-2">
            8월 예약 일정 확인하기
          </span>
          <span className="text-[12px]">이번주만 보여주고 열면 전체 스케쥴 확인가능하게</span>
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
        <button className="btn-card custom-card w-full rounded-lg py-2 bg-[#e6e6e67d] text-[14px] cursor-pointer">
          대화하기
        </button>
      </div>
    </div>
  );
};

export default ListBox2;
