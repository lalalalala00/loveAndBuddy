'use client';

import { useEffect, useMemo, useState } from 'react';
import GridLayout from 'react-grid-layout';

import BuddyConnect from '../buddy.connect';
import Calendar from './calendar';
import CommunityList from '../commu.list';
import WriteIndex from '../commu.write.index';

type RGLItem = { i: string; x: number; y: number; w: number; h: number; static?: boolean };

const STORAGE_KEY = 'rgl:home:layout';
const STORAGE_HIDE_KEY = 'rgl:home:hidden';
const blocks = ['cal', 'toki', 'comm', 'write'] as const;

const BASE_LAYOUT: RGLItem[] = [
    { i: 'cal', x: 0, y: 0, w: 2, h: 4 },
    { i: 'toki', x: 2, y: 0, w: 1, h: 1 },
    { i: 'comm', x: 2, y: 3, w: 1, h: 1 },
    { i: 'write', x: 2, y: 4, w: 1, h: 1 },
];

function ensureLayout(next?: Partial<RGLItem>[] | null): RGLItem[] {
    const map = new Map<string, RGLItem>(BASE_LAYOUT.map((it) => [it.i, { ...it }]));
    (next ?? []).forEach((it) => {
        if (!it || typeof it.i !== 'string') return;
        const base = map.get(it.i) ?? { i: it.i, x: 0, y: 0, w: 1, h: 1 };
        map.set(it.i, { ...base, ...it } as RGLItem);
    });
    return Array.from(map.values()).filter(
        (it) =>
            it &&
            typeof it.i === 'string' &&
            Number.isFinite(it.x) &&
            Number.isFinite(it.y) &&
            Number.isFinite(it.w) &&
            Number.isFinite(it.h),
    );
}

export default function Index() {
    const [layout, setLayout] = useState<RGLItem[]>(() => {
        if (typeof window !== 'undefined') {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (raw) return ensureLayout(JSON.parse(raw));
            } catch {}
        }
        return ensureLayout(BASE_LAYOUT);
    });

    const [selectedClose, setSelectedClose] = useState<string[]>(() => {
        if (typeof window !== 'undefined') {
            try {
                const raw = localStorage.getItem(STORAGE_HIDE_KEY);
                if (raw) return JSON.parse(raw);
            } catch {}
        }
        return ['comm', 'write'];
    });

    const [calExtension, setCalExtension] = useState<number>(() => {
        if (typeof window !== 'undefined') {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (raw) {
                    const saved: RGLItem[] = JSON.parse(raw);
                    const cal = saved.find((it) => it?.i === 'cal');
                    if (cal?.w) return cal.w;
                }
            } catch {}
        }
        return 2;
    });

    useEffect(() => {
        setLayout((prev) => {
            const safe = ensureLayout(prev);
            const cal = safe.find((it) => it.i === 'cal');
            if (cal && cal.w === calExtension) return safe;
            return safe.map((it) => (it.i === 'cal' ? { ...it, w: calExtension } : it));
        });
    }, [calExtension]);

    const visibleLayout = useMemo(
        () => (layout ?? []).filter((it) => it && !selectedClose.includes(it.i)),
        [layout, selectedClose],
    );

    const handleLayoutChange = (newVisible: RGLItem[]) => {
        const full = ensureLayout(layout);
        const visMap = new Map(newVisible.filter(Boolean).map((it) => [it.i, it]));
        const merged = full.map((it) => (visMap.has(it.i) ? { ...it, ...visMap.get(it.i)! } : it));
        setLayout(merged);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        } catch {}
    };

    const toggleClose = (value: string) => {
        if (!value) return;
        setSelectedClose((prev) => {
            const next = prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value];
            try {
                localStorage.setItem(STORAGE_HIDE_KEY, JSON.stringify(next));
            } catch {}
            return next;
        });
    };

    const componentMap: Record<string, React.ReactNode> = {
        cal: <Calendar setSelectedClose={toggleClose} setCalExtension={setCalExtension} />,
        toki: <BuddyConnect setSelectedClose={toggleClose} />,
        comm: <CommunityList setSelectedClose={toggleClose} />,
        write: <WriteIndex setSelectedClose={toggleClose} />,
    };

    return (
        <div className="mt-5 shadow-[4px_4px_10px_#f3f7ee,-4px_-4px_10px_#ffffff] rounded-b-2xl max-md:mt-0 max-md:h-[100vh] max-md:mb-20">
            <div className="max-md:hidden bg-[#f9fbf6] w-full h-10 flex items-center px-5 rounded-t-xl border border-white/20 shadow-[4px_4px_10px_#f3f7ee,-4px_-4px_10px_#ffffff]">
                {closeTap
                    .filter((item) => selectedClose.includes(item.value))
                    .map((item) => (
                        <button
                            key={item.value}
                            onClick={() => toggleClose(item.value)}
                            disabled={item.value === 'comm' || item.value === 'write'}
                            className="flex justify-between items-center cursor-pointer py-0.5 mx-3 px-8 bg-white/80 border border-white/20 rounded-2xl shadow-[inset_4px_8px_10px_#f3f7ee,-4px_-4px_10px_#ffffff] font-semibold"
                        >
                            <div className="bg-[#9dbb80] w-[22px] h-[8px] mr-2 rounded-2xl" />
                            <span className="text-[12px]">{item.label}</span>
                        </button>
                    ))}
            </div>

            <GridLayout
                className="layout bg-[#fefefe] pt-4 rounded-b-2xl h-[100vh] max-md:h-full! max-md:bg-none max-md:flex max-md:justify-center"
                layout={visibleLayout}
                cols={3}
                maxRows={6}
                rowHeight={180}
                width={1280}
                isDraggable
                isResizable={false}
                draggableHandle=".drag-handle"
                compactType="vertical"
                preventCollision={false}
                onLayoutChange={handleLayoutChange}
                onDragStop={handleLayoutChange}
                onResizeStop={handleLayoutChange}
            >
                {blocks.map(
                    (key) =>
                        !selectedClose.includes(key) && (
                            <div
                                key={key}
                                className="bg-white backdrop-blur-3xl border-2 border-[#fafdf4] shadow-[4px_4px_10px_#f7f9f6,-4px_-4px_10px_#ffffff] rounded-2xl"
                            >
                                <div className="drag-handle react-grid-item cursor-move p-2 opacity-0 hover:opacity-100 transition-opacity duration-200 custom-card rounded-2xl mb-1" />
                                {componentMap[key]}
                            </div>
                        ),
                )}
            </GridLayout>
        </div>
    );
}

const closeTap = [
    { label: 'buddyToki', value: 'toki' },
    { label: 'calendar', value: 'cal' },
    { label: 'community', value: 'comm' },
    { label: 'write', value: 'write' },
];
