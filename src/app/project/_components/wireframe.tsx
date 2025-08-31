'use client';

import { useState } from 'react';

const Wireframe = () => {
    const [selectedMenu, setSelectedMenu] = useState<string>('home');

    return (
        <div>
            <h1>Wireframe</h1>
            <div>
                {menu.map((item, i) => (
                    <button
                        key={i}
                        onClick={() => setSelectedMenu(item.value)}
                        className={`${item.value === selectedMenu ? 'border-2 border-amber-500 bg-transparent text-amber-500 font-semibold' : ''} px-4 py-2 mr-4 rounded-xl bg-amber-50`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            <div className="py-5">
                {/* <h3 className="mb-5">{menu.find((v) => v.value === selectedMenu)?.label}</h3> */}
                {selectedMenu === 'home' && (
                    <div className="flex flex-col">
                        <div className="mb-3 flex">
                            <img src="/wireframe/home.png" alt={`wireframe-${selectedMenu}`} />
                            <span className="ml-2 p-2 text-gray-700 text-[15px] leading-relaxed max-w-sm">
                                ⦿ 캘린더(calendar), 커뮤니티 리스트(community list), 메시지 알림(message card) 영역은
                                각각 마우스 오버 시 인터랙션이 드러납니다. <br />
                                ⦿ 모든 박스는 드래그 앤 드롭으로 위치를 조정할 수 있으며, <br />⦿ 닫기 버튼 클릭 시 상단
                                고정 영역으로 자동 이동됩니다.
                            </span>
                        </div>
                        <div className="mb-3">
                            <img src="/wireframe/home_1.png" alt={`wireframe-${selectedMenu}`} />
                        </div>

                        <h3>calender</h3>

                        <div className="mb-3 flex">
                            <img
                                src="/wireframe/calendar_all.png"
                                alt={`wireframe-${selectedMenu}`}
                                className="w-[685px]"
                            />
                            <span className="ml-2 p-2 text-gray-700 text-[15px] leading-relaxed max-w-sm">
                                ⦿ 캘린더는 기본적으로 와이드 형태로 제공됩니다. <br />
                                ⦿ 상단 하늘색 버튼 클릭 시, 캘린더 크기가 축소됩니다. <br />
                                ⦿ 버디와의 예약 일정은 이미지와 함께 표시되며, <br />
                                과거 예약의 경우, 산책일지에서 이미지를 가져와 표시합니다.
                            </span>
                        </div>

                        <div className="mb-3 flex">
                            <img
                                src="/wireframe/calendar_all_op.png"
                                alt={`wireframe-${selectedMenu}`}
                                className="w-[685px]"
                            />
                            <span className="ml-2 p-2 text-gray-700 text-[15px] leading-relaxed max-w-sm">
                                ⦿ 주황색 버튼 클릭 시, 선택한 예약의 상세 정보가 오른쪽에 표시됩니다. <br />⦿ 선택된
                                날짜와 시간, 러브/버디 정보가 함께 나타나며, 산책일지로 이동할 수 있는 링크도
                                포함됩니다.
                            </span>
                        </div>
                        <div className="mb-3 flex">
                            <img
                                src="/wireframe/buddytoki.png"
                                alt={`wireframe-${selectedMenu}`}
                                className="w-[685px]"
                            />
                            <span className="ml-2 p-2 text-gray-700 text-[15px] leading-relaxed max-w-sm">⦿ bi</span>
                        </div>
                    </div>
                )}
                {selectedMenu === 'find' && (
                    //buddy
                    <div className="flex flex-col">
                        <div className="mb-3 flex">
                            <img
                                src="/wireframe/find_buddy_page.png"
                                alt={`wireframe-${selectedMenu}`}
                                className="w-[685px] h-[434px]"
                            />
                            <span className="ml-2 p-2 text-gray-700 text-[15px] leading-relaxed max-w-sm">
                                ⦿ 러브 시점
                                <br />
                                <br />⦿ 첫 입장 시: 러브 → 버디 찾기 / 버디 → 러브 찾기 카드 리스트가 표시됩니다.
                                <br />⦿ 설정된 동네가 자동 선택되며, 데이터가 없을 경우 전체 동네 리스트가 표시됩니다.
                                (모달 - 최대 3개 선택 가능)
                                <br />⦿ 조건 선택 가능: 날짜, 반려동물 종류, 버디 성별, 하트 수, 매너 점수, 디얼러브
                                작성 수, 신뢰도 입니다.
                                <br />⦿ [신뢰도가 높은 버디 추천] 영역: 일정·자격증 세부 내역은 제외, 기본
                                인증/성별/선호 반려동물 등 핵심 정보만 표시됩니다.
                                <br />⦿ 신뢰도 높은 버디 기준:
                                <br /> 하트 20개 이상 　· 디얼러브 20장 이상 　· 매너 점수 8점 이상 　· 수의 관련 자격증
                                / 펫시터 교육 수료 / 반려동물 경험 인증
                            </span>
                        </div>
                        <div className="mb-3">
                            <img src="/wireframe/find_buddy_place.png" alt={`wireframe-${selectedMenu}`} />
                        </div>
                        <div className="mb-3 flex">
                            <img
                                src="/wireframe/find_buddy_card.png"
                                alt={`wireframe-${selectedMenu}`}
                                className="w-[685px] h-[434px]"
                            />
                            <span className="ml-2 p-2 text-gray-700 text-[15px] leading-relaxed max-w-sm">
                                ⦿ 캘린더 기본은 이번 주만 표시, 펼쳐보기 선택 시 한 달 단위 표시. 이후 일정은 버디룸에서
                                예약 가능합니다.
                                <br />
                                ⦿ 기본 버튼은 대화하기이며 클릭 시 동네·장소·시간을 제외한 반려동물 정보로만 대화
                                시작합니다. <br />⦿ 예약하기는 날짜·시간을 설정한 후 활성화되며, 선택된 예약 정보가
                                전송됩니다.
                                <br />⦿ 버디가 예약 정보 수신 후 버디토키 대화 가능합니다.
                            </span>
                        </div>
                        <div className="mb-3 flex">
                            <img
                                src="/wireframe/find_buddy_ok.png"
                                alt={`wireframe-${selectedMenu}`}
                                className="w-[685px] h-[434px]"
                            />
                            <span className="ml-2 p-2 text-gray-700 text-[15px] leading-relaxed max-w-sm">
                                <br />⦿ 버디가 러브에게 예약 정보를 받고 예약 확정 후 러브에게 보내는 메세지입니다.
                            </span>
                        </div>

                        {/* love */}
                        <div className="mb-3 flex">
                            <img
                                src="/wireframe/find_love_page.png"
                                alt={`wireframe-${selectedMenu}`}
                                className="w-[685px]"
                            />
                            <span className="ml-2 p-2 text-gray-700 text-[15px] leading-relaxed max-w-sm">
                                ⦿ 버디 시점
                                <br />
                                <br />
                                ⦿ 러브(펫시터를 구하는 사용자)를 위한 페이지 입니다. <br />⦿ 필터 리스트는 버디와
                                동일하고 신뢰도부분이 난이도로 변경됩니다.
                            </span>
                        </div>

                        <div className="mb-3 flex">
                            <img
                                src="/wireframe/find_love_buddy_ok.png"
                                alt={`wireframe-${selectedMenu}`}
                                className="w-[685px]"
                            />
                            <span className="ml-2 p-2 text-gray-700 text-[15px] leading-relaxed max-w-sm">
                                ⦿ 러브가 올린 예약 요청(날짜·시간·장소 등)에 대해 버디가 대화를 걸어 예약을 제안하는
                                흐름을 보여줍니다. <br />⦿ 버디는 러브가 등록한 조건을 확인한 뒤, 추가 요청이나 확정을
                                위해 대화를 시작할 수 있습니다. <br />⦿ 대화창에서는 예약 관련 세부사항을 조율하고, 합의
                                후 예약이 확정됩니다.
                            </span>
                        </div>

                        <div className="mb-3 flex">
                            <img
                                src="/wireframe/find_booking.png"
                                alt={`wireframe-${selectedMenu}`}
                                className="w-[685px]"
                            />
                            <span className="ml-2 p-2 text-gray-700 text-[15px] leading-relaxed max-w-sm">
                                ⦿ 버디 채팅창에서는 입력창 옆의 ‘+’ 버튼을 눌러 예약 확정 인터페이스를 열고, <br />
                                선택한 일정 정보를 추가하여 확정할 수 있습니다.
                            </span>
                        </div>
                        <div className="mb-3 flex">
                            <img
                                src="/wireframe/find_post_love.png"
                                alt={`wireframe-${selectedMenu}`}
                                className="w-[685px]"
                            />
                            <span className="ml-2 p-2 text-gray-700 text-[15px] leading-relaxed max-w-sm">
                                최초 등록 시 인증 - 성별, 휴대폰 번호, 실명 확인 등 ⦿ 러브가 버디를 찾기 위해 정보를
                                등록하는 화면입니다. <br />
                                ⦿ 이전에 등록된 반려동물 정보가 자동으로 불러와집니다. <br />⦿ 반려동물이 두 마리 이상
                                등록되어 있는 경우, 기본으로 대표가 먼저 보여지고 추가 선택 가능한 리스트가 노출됩니다.
                            </span>
                        </div>
                        <div className="mb-3">
                            <img src="/wireframe/find_love_selected.png" alt={`wireframe-${selectedMenu}`} />
                        </div>
                        <div className="mb-3 flex">
                            <img
                                src="/wireframe/find_post_buddy.png"
                                alt={`wireframe-${selectedMenu}`}
                                className="w-[685px]"
                            />
                            <span className="ml-2 p-2 text-gray-700 text-[15px] leading-relaxed max-w-sm">
                                ⦿ 버디가 러브를 찾기 위해 정보를 등록하는 화면입니다. <br />
                                ⦿ 등록된 버디 정보가 자동으로 불러와집니다.(위치가 2개 이상일 경우 첫번째 인덱스)
                                <br />⦿ 위치는 최대 3개까지 등록할 수 있으며, 위치가 3개인 경우 선택 가능한 리스트가
                                보여집니다.
                            </span>
                        </div>
                        <div className="mb-3">
                            <img src="/wireframe/find_buddy_selected.png" alt={`wireframe-${selectedMenu}`} />
                        </div>
                    </div>
                )}
                {selectedMenu === 'dear' && (
                    <div className="flex flex-col">
                        <div className="mb-3 flex">
                            <img
                                src="/wireframe/dear_front.png"
                                alt={`wireframe-${selectedMenu}`}
                                className="w-[685px]"
                            />
                            <span className="ml-2 p-2 text-gray-700 text-[15px] leading-relaxed max-w-sm">
                                ⦿ 왼쪽 사이드 메뉴에서 연도와 월을 선택할 수 있습니다. <br />
                                ⦿ 상단 박스에는 날짜, 시간, 버디, 제목 등의 정보가 요약되어 표시됩니다. <br />⦿ 사진
                                박스를 클릭하면 전체 보기 모달이 열리며, 큰 이미지로 확인 가능합니다.
                            </span>
                        </div>
                        <div className="mb-3">
                            <img src="/wireframe/dear_front_img.png" alt={`wireframe-${selectedMenu}`} />
                        </div>
                        <div className="mb-3 flex">
                            <img
                                src="/wireframe/dear_buddy.png"
                                alt={`wireframe-${selectedMenu}`}
                                className="w-[685px]"
                            />
                            <span className="ml-2 p-2 text-gray-700 text-[15px] leading-relaxed max-w-sm">
                                ⦿ 버디와 러브가 함께 산책한 내용을 일지 형태로 등록할 수 있는 페이지입니다. <br />
                                ⦿ 캘린더에 등록한 일정을 가져와서 보여줄 수 있고 <br />
                                ⦿ 러브는 별도 일정 없이도 자신의 반려동물 일지를 작성할 수 있습니다. <br />⦿ 사진 등록
                                후 미리보기가 가능하며, 드래그 앤 드롭으로 순서를 조정할 수 있습니다. <br />⦿ 사진 등록
                                후 첫 번째 보더 박스를 선택하면, 해당 박스에 배경 이미지가 적용되어 상단 요약
                                정보(날짜,시간, 제목 등..)와 함께 표시됩니다.
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const menu = [
    { label: 'home', value: 'home' },
    { label: 'Find Love & Buddy', value: 'find' },
    { label: 'Dear Love', value: 'dear' },
    { label: 'community', value: 'commu' },
];

export default Wireframe;
