"use client";

import { useState } from "react";
import Wireframe from "./wireframe";
import Db from "./database";
import Features from "./features";
import Env from "./env";
import Intro from "./intro";
import Concept from "./concept";

const Index = () => {
  const [selectedMenu, setSelectedMenu] = useState<string>("intro");

  const switchMenu = () => {
    switch (selectedMenu) {
      case "intro":
        return <Intro />;

      case "concept":
        return <Concept />;

      case "wire":
        return <Wireframe />;

      case "db":
        return <Db />;

      case "features":
        return <Features />;

      case "env":
        return <Env />;

      default:
        return;
    }
  };

  return (
    <div className="min-h-screen px-6 py-12 flex flex-col items-center">
      <div className="flex justify-center mb-12 gap-4 flex-wrap">
        {menu.map((item, i) => (
          <button
            key={i}
            onClick={() => setSelectedMenu(item.value)}
            className={`px-6 py-3 rounded-xl text-sm font-medium neumorph-card ${
              selectedMenu === item.value ? "selected-neumorph" : ""
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="neumorph-box w-full max-w-5xl p-10 rounded-[30px]">{switchMenu()}</div>
    </div>
  );
};

const menu = [
  { label: "기획 의도", value: "intro" },
  { label: "컨셉", value: "concept" },
  { label: "UX 흐름 / 와이어프레임", value: "wire" },
  { label: "DB 설계", value: "db" },
  { label: "핵심 기능", value: "features" },
  { label: "개발 환경", value: "env" },
  { label: "문제 해결 포인트", value: "issues" },
  { label: "향후 개선 방향", value: "future" },
];

export default Index;
