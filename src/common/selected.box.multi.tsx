'use client';

import { useEffect, useRef, useState } from 'react';
import type { Option } from './selected.box';

type Props = {
    comment: string;
    list: Option[];
    onPick: (opt: Option) => void;
    disabled?: boolean;
    className?: string;
};

export default function SelectedBoxMulti({ comment, list, onPick, disabled = false, className = 'w-64' }: Props) {
    const [open, setOpen] = useState(false);
    const wrapRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={wrapRef} className={`relative ${className}`}>
            <div
                className={[
                    'absolute top-full left-0 mt-2 z-20 w-full rounded-2xl overflow-scroll',
                    'bg-[#f3f7ee]',
                    'shadow-[10px_10px_20px_rgba(163,177,138,0.25),_-10px_-10px_20px_rgba(255,255,255,0.9)]',
                    'border border-white/40',
                    'max-h-56 overflow-auto',
                ].join(' ')}
                role="listbox"
            >
                {list.length === 0 ? (
                    <div className="px-3 py-3 text-sm text-gray-500">추가할 동이 없습니다</div>
                ) : (
                    list.map((item) => (
                        <button
                            key={item.code}
                            type="button"
                            role="option"
                            onClick={() => {
                                onPick(item);
                                setOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 text-[14px] text-[#374151] hover:bg-white/60 transition-colors"
                        >
                            {item.name}
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}
