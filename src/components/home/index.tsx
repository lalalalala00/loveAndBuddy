'use client';

import { useEffect, useState } from 'react';
import BuddyConnect from '../buddy.connect';

import Calendar from './calendar';

import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const blocks = ['cal', 'toki', 'comm', 'write'];
const Index = () => {
    const [selectedClose, setSelectedClose] = useState<string[]>([]);
    const [calExtension, setCalExtension] = useState<number>(2);
    const [layout, setLayout] = useState([
        { i: 'cal', x: 0, y: 0, w: 2, h: 3 },
        { i: 'write', x: 2, y: 3, w: 1, h: 1 },
        { i: 'comm', x: 2, y: 0, w: 1, h: 1 },
        { i: 'toki', x: 2, y: 0, w: 1, h: 2 },
        // { i: 'cal', x: 0, y: 0, w: 2, h: 2 },
        // { i: 'write', x: 2, y: 3, w: 1, h: 1 },
        // { i: 'comm', x: 2, y: 0, w: 1, h: 1 },
        // { i: 'toki', x: 0, y: 4, w: 1, h: 1 },
    ]);

    useEffect(() => {
        setLayout((prev) => prev.map((item) => (item.i === 'cal' ? { ...item, w: calExtension } : item)));
    }, [calExtension, selectedClose]);
    console.log(calExtension);

    const toggleClose = (value: string) => {
        if (!value) return;
        setSelectedClose((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
    };

    const componentMap: Record<string, React.ReactNode> = {
        cal: <Calendar setSelectedClose={toggleClose} setCalExtension={setCalExtension} />,
        toki: <BuddyConnect setSelectedClose={toggleClose} />,
        // comm: <CommunityList setSelectedClose={toggleClose} />,
        // write: <WriteIndex setSelectedClose={toggleClose} />,
    };

    return (
        <div className="mt-5 shadow-[4px_4px_10px_#f3f7ee,-4px_-4px_10px_#ffffff] rounded-b-2xl">
            <div className="bg-[#f9fbf6] w-full h-10 flex items-center px-5 rounded-t-xl border border-white/20 shadow-[4px_4px_10px_#f3f7ee,-4px_-4px_10px_#ffffff]">
                {closeTap
                    .filter((item) => selectedClose.includes(item.value))
                    .map((item) => (
                        <button
                            key={item.value}
                            onClick={() => toggleClose(item.value)}
                            className="flex justify-between items-center cursor-pointer py-0.5 mx-3 px-8 bg-white/80 border border-white/20 rounded-2xl shadow-[inset_4px_8px_10px_#f3f7ee,-4px_-4px_10px_#ffffff] font-semibold"
                        >
                            <div className="bg-[#9dbb80] w-[22px] h-[8px] mr-2 rounded-2xl" />
                            <span className="text-[12px]">{item.label}</span>
                        </button>
                    ))}
            </div>

            <GridLayout
                className="layout bg-[#fefefe] pt-4 rounded-b-2xl h-[100vh]"
                // style={{ backgroundImage: "url(/cha/1_11.png)", backgroundSize: "cover" }}
                layout={layout.filter((item) => !selectedClose.includes(item.i))}
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
                            <div
                                key={key}
                                className="bg-white backdrop-blur-3xl border-2 border-[#fafdf4] shadow-[4px_4px_10px_#f7f9f6,-4px_-4px_10px_#ffffff] rounded-2xl"
                                // className="p-2 rounded-2xl shadow-[4px_4px_10px_#f8faf5,-4px_-4px_10px_#ffffff] h-full"
                            >
                                <div className="drag-handle react-grid-item cursor-move p-2 opacity-0 hover:opacity-100 transition-opacity duration-200  custom-card rounded-2xl mb-1"></div>
                                {componentMap[key]}
                            </div>
                        ),
                )}
            </GridLayout>
        </div>
    );
};

const closeTap = [
    { label: 'buddyToki', value: 'toki' },
    { label: 'calendar', value: 'cal' },
    { label: 'community', value: 'comm' },
    { label: 'write', value: 'write' },
];

export default Index;
