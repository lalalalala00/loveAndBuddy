import ModalIos from '@/common/modal.ios';
import NameTag from '@/common/name.tag';

const LoveList = () => {
    return (
        <div className="rounded-2xl w-full h-auto shadow">
            <div className="flex flex-col items-center bg-[rgb(246,246,246)] border-b border-[rgb(227,227,227)] rounded-t-2xl">
                <NameTag imgCss="w-[60px] h-[60px]" love />
            </div>
            <div className="p-2 flex flex-col gap-2 min-h-[120px] overflow-visible">
                <div className="flex flex-col text-[13px] items-start w-full px-1 mt-2">
                    <div className="flex justify-between w-full items-center">
                        <span>🕒 시간 </span>
                        <span className="font-medium">25.08.05_16:00 ~ 20:00</span>
                    </div>

                    <div className="flex justify-between w-full items-center">
                        <span>📍 동네</span>
                        <span className="font-medium">유성구 원신흥동</span>
                    </div>
                    <div className="flex justify-between w-full items-center">
                        <span>🏠 장소</span>
                        <span className="font-medium">애견카페 [잘놀아]</span>
                    </div>

                    <div className="border-t w-full border-[#e6e6e6] py-0.5 mt-1" />
                    <span className="text-gray-800">🐾 샤넬이의 한마디</span>
                    <span className="ml-3 font-semibold">풀냄새 흙냄새 좋아해요. 뛰는 거 자신 있어요 ❣</span>
                </div>

                <button className={`btn-card custom-card w-full rounded-lg py-2  text-[14px] cursor-pointer`}>
                    대화하기
                </button>
            </div>

            {/* <ModalIos
            isOpen={open}
            handleModalState={handleClose}
            title={timeDate ? '예약 요청 보내기' : '대화하기'}
            leftComment={!infoData ? (timeDate ? '예약 요청 보내기' : '대화하기') : undefined}
            leftAction={
                !infoData
                    ? () => {
                          if (timeDate) {
                          }
                          setInfoData(true);
                      }
                    : undefined
            }
            width="330px"
            height="500px"
        >
            {infoData ? (
                <div className="flex flex-col justify-center items-center h-[370px] text-[14px]">
                    <span>예약 요청 보내기 완료!</span>
                    <span>
                        답장이 오면 <b>버디토키</b>에서 알려드릴게요!
                    </span>
                </div>
            ) : (
                <div className="flex flex-col justify-between items-start p-3 h-full">
                    <div className="h-full">
                        <h3 className="text-[15px] font-semibold mb-2">예약 정보 확인</h3>
                        <ul className="text-[14px] text-gray-700 space-y-1 mb-3 flex flex-col justify-start items-start">
                            <li>버디: {state.draft.buddy?.name ?? '-'}</li>
                            <li>반려동물: {state.draft.pet?.name ?? '-'}</li>
                            <li>동네: {state.draft.pet?.name ?? '-'}</li>
                            <li>장소: {state.draft.pet?.name ?? '-'}</li>
                            <li>
                                일시: {state.draft.date ?? '-'} {state.draft.time ?? ''}
                            </li>
                        </ul>
                    </div>

                    <div className="mt-2 text-[12px] text-right">
                        {!timeDate && (
                            <span className="text-gray-500">날짜/시간을 선택하면 예약하기로 전환돼요</span>
                        )}
                    </div>
                </div>
            )}
        </ModalIos> */}
        </div>
    );
};

export default LoveList;
