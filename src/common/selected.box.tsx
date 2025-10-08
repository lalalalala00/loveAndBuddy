'use client';

import { useEffect, useRef, useState } from 'react';

export type Option = { code?: string; name: string };

type Props = {
    comment: string;
    list: Option[];
    value: string; // 선택된 name
    onChange: (name: string) => void;
    disabled?: boolean;
    className?: string; // ex) 'w-80'
};

export default function SelectedBox({ comment, list, value, onChange, disabled = false, className = 'w-80' }: Props) {
    const [open, setOpen] = useState(false);
    const wrapRef = useRef<HTMLDivElement>(null);

    const label = list.find((o) => o.name === value)?.name ?? comment;

    useEffect(() => {
        function onDocClick(e: MouseEvent) {
            if (!wrapRef.current) return;
            if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, []);

    return (
        <div ref={wrapRef} className={`relative ${className}`}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => !disabled && setOpen((o) => !o)}
                className={[
                    'w-full px-4 py-3 rounded-2xl text-left text-[14px] transition-all duration-150',
                    'outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/60',

                    'bg-[#f3f7ee]',
                    'shadow-[8px_8px_16px_rgba(163,177,138,0.25),_-8px_-8px_16px_rgba(255,255,255,0.9)]',

                    !disabled
                        ? 'hover:shadow-[6px_6px_12px_rgba(163,177,138,0.22),_-6px_-6px_12px_rgba(255,255,255,0.95)] active:shadow-inner'
                        : '',

                    disabled ? 'text-gray-400 cursor-not-allowed opacity-60' : 'text-[#374151] font-semibold',

                    'pr-9 relative',
                ].join(' ')}
            >
                <span className={label === comment ? 'text-gray-500' : ''}>{label}</span>

                {/* chevron icon */}
                <span
                    className={[
                        'pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 transition-transform',
                        open ? 'rotate-180' : 'rotate-0',
                    ].join(' ')}
                    aria-hidden
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M6 9l6 6 6-6"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
            </button>

            {open && (
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
                        <div className="px-3 py-3 text-sm text-gray-500">옵션이 없습니다</div>
                    ) : (
                        list.map((item) => {
                            const active = item.name === value;
                            return (
                                <button
                                    key={item.code + item.name}
                                    type="button"
                                    role="option"
                                    aria-selected={active}
                                    onClick={() => {
                                        onChange(item.name);
                                        setOpen(false);
                                    }}
                                    className={[
                                        'w-full text-left px-3 py-2 text-[14px] transition-colors',
                                        active
                                            ? 'bg-[#ebf0e8] text-[#334323] font-semibold'
                                            : 'text-[#374151] hover:bg-white/60',
                                    ].join(' ')}
                                >
                                    {item.name}
                                </button>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}
