"use client";

import { useState } from "react";

const Wireframe = () => {
  const [selectedMenu, setSelectedMenu] = useState<string>("home");

  return (
    <div>
      <h1>Wireframe</h1>
      <div>
        {menu.map((item, i) => (
          <button
            key={i}
            onClick={() => setSelectedMenu(item.value)}
            className={`${item.value === selectedMenu ? "border-2 border-amber-500 bg-transparent text-amber-500 font-semibold" : ""} px-4 py-2 mr-4 rounded-xl bg-amber-50`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="py-5">
        {/* <h3 className="mb-5">{menu.find((v) => v.value === selectedMenu)?.label}</h3> */}
        {selectedMenu === "home" && (
          <div className="flex flex-col">
            <div className="mb-3 flex">
              <img src="/wireframe/home.png" alt={`wireframe-${selectedMenu}`} />
              <span className="ml-4 p-2 text-gray-700 text-[15px] leading-relaxed max-w-sm">
                ⦿ 캘린더(calendar), 커뮤니티 리스트(community list), 메시지 알림(message card)
                영역은 각각 마우스 오버 시 인터랙션이 드러납니다. <br />
                ⦿ 모든 박스는 드래그 앤 드롭으로 위치를 조정할 수 있으며, <br />⦿ 닫기 버튼 클릭 시
                상단 고정 영역으로 자동 이동됩니다.
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
              <span className="ml-4 p-2 text-gray-700 text-[15px] leading-relaxed max-w-sm">
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
              <span className="ml-4 p-2 text-gray-700 text-[15px] leading-relaxed max-w-sm">
                ⦿ 주황색 버튼 클릭 시, 선택한 예약의 상세 정보가 오른쪽에 표시됩니다. <br />⦿ 선택된
                날짜와 시간, 러브/버디 정보가 함께 나타나며, 산책일지로 이동할 수 있는 링크도
                포함됩니다.
              </span>
            </div>
          </div>
        )}
        {selectedMenu === "find" && (
          <div className="flex flex-col">
            <div className="mb-3 flex">
              <img
                src="/wireframe/find.png"
                alt={`wireframe-${selectedMenu}`}
                className="w-[685px]"
              />
              <span className="ml-4 p-2 text-gray-700 text-[15px] leading-relaxed max-w-sm">
                ⦿ 내 타입이 러브인 경우에는 버디 찾기, 버디인 경우에는 러브 찾기, 러버디인 경우에는
                두 유형 모두 보여집니다. <br />
                ⦿ 왼쪽 박스는 긴급하게 버디 또는 러브를 찾고자 할 때 노출되는 공간입니다. <br />⦿
                기본 정보는 간단하게 요약되며, ‘대화하기’ 버튼을 누르면 버디토키로 연결되어 실시간
                대화가 가능합니다.
              </span>
            </div>
            <div className="mb-3">
              <img src="/wireframe/find_talk.png" alt={`wireframe-${selectedMenu}`} />
            </div>
            <div className="mb-3 flex">
              <img
                src="/wireframe/find_talk_buddy.png"
                alt={`wireframe-${selectedMenu}`}
                className="w-[685px]"
              />
              <span className="ml-4 p-2 text-gray-700 text-[15px] leading-relaxed max-w-sm">
                ⦿ 버디가 러브와 실시간으로 대화하는 화면입니다. <br />
                ⦿ 입력창 옆의 ‘+’ 버튼을 누르면 예약 확정 인터페이스가 열리며, <br />
                선택한 일정 정보를 추가하여 확정할 수 있습니다.
              </span>
            </div>
            <div className="mb-3 flex">
              <img
                src="/wireframe/find_post_love.png"
                alt={`wireframe-${selectedMenu}`}
                className="w-[685px]"
              />
              <span className="ml-4 p-2 text-gray-700 text-[15px] leading-relaxed max-w-sm">
                ⦿ 러브가 버디를 찾기 위해 정보를 등록하는 화면입니다. <br />
                ⦿ 이전에 등록된 반려동물 정보가 자동으로 불러와집니다. <br />⦿ 반려동물이 두 마리
                이상 등록되어 있는 경우, 선택 가능한 리스트가 노출됩니다.
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
              <span className="ml-4 p-2 text-gray-700 text-[15px] leading-relaxed max-w-sm">
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
        {selectedMenu === "dear" && (
          <div className="flex flex-col">
            <div className="mb-3 flex">
              <img
                src="/wireframe/dear_front.png"
                alt={`wireframe-${selectedMenu}`}
                className="w-[685px]"
              />
              <span className="ml-4 p-2 text-gray-700 text-[15px] leading-relaxed max-w-sm">
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
              <span className="ml-4 p-2 text-gray-700 text-[15px] leading-relaxed max-w-sm">
                ⦿ 버디와 러브가 함께 산책한 내용을 일지 형태로 등록할 수 있는 페이지입니다. <br />
                ⦿ 캘린더에 등록한 일정을 가져와서 보여줄 수 있고 <br />
                ⦿ 러브는 별도 일정 없이도 자신의 반려동물 일지를 작성할 수 있습니다. <br />⦿ 사진
                등록 후 미리보기가 가능하며, 드래그 앤 드롭으로 순서를 조정할 수 있습니다. <br />⦿
                사진 등록 후 첫 번째 보더 박스를 선택하면, 해당 박스에 배경 이미지가 적용되어 상단
                요약 정보(날짜,시간, 제목 등..)와 함께 표시됩니다.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const menu = [
  { label: "home", value: "home" },
  { label: "Find Love & Buddy", value: "find" },
  { label: "Dear Love", value: "dear" },
  { label: "community", value: "commu" },
];

export default Wireframe;
