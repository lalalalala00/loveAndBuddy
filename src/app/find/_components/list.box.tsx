import BuddyNameTag from "@/common/buddy.name.tag";
import NameTag from "@/common/name.tag";

const ListBox = () => {
  const buddy = {
    nickname: "buddy",
    hearts: 2,
    mannerScore: 4,
    dearLove: 28,
    profileImg: "/project/buddy_sit_1.png",
    buddyId: "buddyId",
  };

  return (
    <div className="rounded-2xl w-full h-[465px]  shadow">
      <span className="px-3 py-1 inline-block text-[12px]">
        ꤶ 사진촬영동의 ꤶ 신원인증 ꤶ 인성검사완료
      </span>
      <img src="/project/buddy_sit_1.png" alt="" className="w-full h-[200px] object-cover" />
      <NameTag imgCss="hidden" />
      <div className="p-2">
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

        <button className="btn-card custom-card w-full rounded-lg py-2 bg-[#e6e6e67d] text-[14px] cursor-pointer">
          대화하기
        </button>
      </div>
    </div>
  );
};

export default ListBox;
