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
