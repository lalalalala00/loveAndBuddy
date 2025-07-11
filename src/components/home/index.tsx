"use client";

import { useState } from "react";
import BuddyConnect from "../buddy.connect";
import CommunityList from "../commu.list";
import WriteIndex from "../commu.write.index";
import Calendar from "./calendar";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

const Index = () => {
  const [selectedClose, setSelectedClose] = useState<string[]>([]);
  const [blocks, setBlocks] = useState<string[]>([
    "cal",
    "toki",
    "comm",
    "write",
  ]);

  const toggleClose = (value: string) => {
    if (!value) return;
    setSelectedClose((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const sizeMap: Record<string, { col: number; row: number }> = {
    cal: { col: 2, row: 2 },
    toki: { col: 1, row: 1 },
    comm: { col: 1, row: 1 },
    write: { col: 1, row: 1 },
  };

  const getGridSpanClass = (key: string) => {
    const size = sizeMap[key] || { col: 1, row: 1 };
    return `col-span-${size.col} row-span-${size.row}`;
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newOrder = Array.from(blocks);
    const [moved] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, moved);

    setBlocks(newOrder);
  };

  const componentMap: Record<string, React.ReactNode> = {
    cal: <Calendar setSelectedClose={toggleClose} />,
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

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="component-droppable" direction="horizontal">
          {(provided) => (
            <div
              className="w-full mx-auto flex flex-wrap justify-start gap-1"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {blocks.map((key, index) =>
                selectedClose.includes(key) ? null : (
                  <Draggable key={key} draggableId={key} index={index}>
                    {(provided) => (
                      <div
                        className=""
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {componentMap[key]}
                      </div>
                    )}
                  </Draggable>
                )
              )}
              {provided.placeholder}
            </div>
            // <div
            //   className="columns-3 row-3 gap-1 w-full"
            //   // style={{
            //   //   gridTemplateColumns: "repeat(3, 1fr)",
            //   //   // gridTemplateRows: "repeat(4, 1fr)",
            //   //   gridAutoFlow: "dense",
            //   //   gridAutoRows: "minmax(100px, auto)",
            //   // }}
            //   ref={provided.innerRef}
            //   {...provided.droppableProps}
            // >
            //   {blocks.map((key, index) =>
            //     selectedClose.includes(key) ? null : (
            //       <Draggable key={key} draggableId={key} index={index}>
            //         {(provided) => (
            //           <div
            //             className={`break-inside-avoid mb-2 min-h-[160px] border ${getGridSpanClass(
            //               key
            //             )}`}
            //             ref={provided.innerRef}
            //             {...provided.draggableProps}
            //             {...provided.dragHandleProps}
            //           >
            //             {componentMap[key]}
            //           </div>
            //         )}
            //       </Draggable>
            //     )
            //   )}
            //   {provided.placeholder}
            // </div>
            // <div
            //   className="grid gap-1 columns-3 row-4 w-full mx-auto"
            //   style={{
            //     gridTemplateColumns: "repeat(3, 1fr)",
            //     // gridTemplateRows: "repeat(1, 1fr)",
            //     gridAutoFlow: "dense",
            //     gridAutoRows: "minmax(100px, auto)",
            //   }}
            //   ref={provided.innerRef}
            //   {...provided.droppableProps}
            // >
            //   {blocks.map((key, index) =>
            //     selectedClose.includes(key) ? null : (
            //       <Draggable key={key} draggableId={key} index={index}>
            //         {(provided) => (
            //           <div
            //             className={`border break-inside-avoid ${getGridSpanClass(
            //               key
            //             )} `}
            //             ref={provided.innerRef}
            //             {...provided.draggableProps}
            //             {...provided.dragHandleProps}
            //           >
            //             {componentMap[key]}
            //           </div>
            //         )}
            //       </Draggable>
            //     )
            //   )}
            //   {provided.placeholder}
            // </div>
          )}
        </Droppable>
      </DragDropContext>
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
