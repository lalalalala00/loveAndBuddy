"use client";

import { useEffect, useState } from "react";
import BuddyConnect from "../buddy.connect";
import CommunityList from "../commu.list";
import WriteIndex from "../commu.write.index";
import Calendar from "./calendar";

import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";


const blocks = [
    "cal",
    "toki",
    "comm",
    "write",
  ]
const Index = () => {
  const [selectedClose, setSelectedClose] = useState<string[]>([]);
  const [calExtension, setCalExtension] = useState<number>(2)
  const [layout, setLayout] = useState([
  { i: "cal", x: 0, y: 0, w: 2, h: 2 },
  { i: "write", x: 2, y: 3, w: 1, h: 1 },
  { i: "comm", x: 2, y: 0, w: 1, h: 1 },
  { i: "toki", x: 0, y: 4, w: 1, h: 1 },
]);

useEffect(() => {
  setLayout((prev) =>
    prev.map((item) =>
      item.i === "cal" ? { ...item, w: calExtension } : item
    )
  );
}, [calExtension]);
console.log(calExtension)

  const toggleClose = (value: string) => {
    if (!value) return;
    setSelectedClose((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const componentMap: Record<string, React.ReactNode> = {
    cal: <Calendar setSelectedClose={toggleClose} setCalExtension={setCalExtension} />,
    toki: <BuddyConnect setSelectedClose={toggleClose} />,
    comm: <CommunityList setSelectedClose={toggleClose} />,
    write: <WriteIndex setSelectedClose={toggleClose} />,
  };

  return (
    <div className="mt-5">
      <div className="bg-amber-100 w-full h-8 mb-5 flex items-center px-5 rounded-t-xl">
        {closeTap
          .filter((item) => selectedClose.includes(item.value))
          .map((item) => (
            <button
              key={item.value}
              onClick={() => toggleClose(item.value)}
              className="flex justify-between items-center cursor-pointer mx-3 px-9 border border-amber-500 rounded-2xl text-amber-700 font-semibold hover:bg-amber-500 hover:text-white"
            >
              <span className="text-[12px]">{item.label}</span>
            </button>
          ))}
      </div>

      <GridLayout
  className="layout"
  layout={layout.filter(item => !selectedClose.includes(item.i))}
  cols={3}
  maxRows={6}
  rowHeight={180}
  width={1280}
  isDraggable
  isResizable={false}
  compactType={null}
  preventCollision
  draggableHandle=".drag-handle"
  onLayoutChange={(newLayout) => setLayout(newLayout)} 
>
  {blocks.map(
    (key) =>
      !selectedClose.includes(key) && (
        <div key={key} className=" bg-white">
        <div className="drag-handle cursor-move p-2 opacity-0 hover:opacity-100 transition-opacity duration-200 hover:bg-red-200 rounded-2xl">

  </div>
          {componentMap[key]}
        </div>
      )
  )}
</GridLayout>



      
    </div>
  );
};

const closeTap = [
  { label: "buddyToki", value: "toki" },
  { label: "calendar", value: "cal" },
  { label: "community", value: "comm" },
  { label: "write", value: "write" },
];

export default Index;
