"use client";

import { useState } from "react";

const Wireframe = () => {
  const [selectedMenu, setSelectedMenu] = useState<string>("home");

  return (
    <div>
      <h1>Wireframe</h1>
      <div>
        {menu.map((item, i) => (
          <button key={i} onClick={() => setSelectedMenu(item.value)}>
            {item.label}
          </button>
        ))}
      </div>

      <div className="py-5">
        <h3 className="mb-5">{selectedMenu}</h3>
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
          </div>
        )}
      </div>
    </div>
  );
};

const menu = [
  { label: "home", value: "home" },
  { label: "find ", value: "find" },
  { label: "Dear Love", value: "dear" },
  { label: "community", value: "commu" },
];

export default Wireframe;
