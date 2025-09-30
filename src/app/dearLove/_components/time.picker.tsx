// TimePickerField.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

function toMin(t?: string) {
    if (!t) return null;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
}
function fromMin(n: number) {
    const h = String(Math.floor(n / 60)).padStart(2, '0');
    const m = String(n % 60).padStart(2, '0');
    return `${h}:${m}`;
}
function ceilTo30(n: number) {
    return Math.ceil(n / 30) * 30;
}
const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = ['00', '30'];

export function TimePickerField({
    value,
    onChange,
    min,
    placeholder = '--:--',
    className = '',
}: {
    value?: string; // 'HH:MM'
    onChange: (v: string) => void;
    min?: string; // 'HH:MM' (종료시간에 시작시간 제약)
    placeholder?: string;
    className?: string;
}) {
    const [open, setOpen] = useState(false);
    const btnRef = useRef<HTMLButtonElement | null>(null);
    const popRef = useRef<HTMLDivElement | null>(null);

    // 외부 클릭으로 닫기
    useEffect(() => {
        if (!open) return;
        const onDown = (e: MouseEvent) => {
            const t = e.target as Node;
            if (popRef.current && !popRef.current.contains(t) && btnRef.current && !btnRef.current.contains(t)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', onDown);
        return () => document.removeEventListener('mousedown', onDown);
    }, [open]);

    // min이 있으면 30분 올림으로 보정한 유효 최소치
    const effMin = useMemo(() => {
        if (!min) return null;
        const mm = toMin(min)!;
        return ceilTo30(mm);
    }, [min]);

    const [hourSel, minSel] = (value ?? '').split(':');
    const hourIdx = HOURS.indexOf(hourSel ?? '');
    const currentMin = toMin(value ?? '');

    const pick = (h: string, m: string) => {
        const v = `${h}:${m}`;
        // min 제약
        if (effMin !== null && toMin(v)! < effMin) return;
        onChange(v);
        setOpen(false); // 즉시 적용 & 닫기
    };

    // 시간 리스트에서 비활성 조건: effMin보다 이른 시
    const isHourDisabled = (h: string) => {
        if (effMin === null) return false;
        const hm = Number(h) * 60;
        return hm + 30 <= effMin - 1; // 해당 시의 마지막 슬롯(30)이 effMin 미만이면 비활성
    };

    // 분 버튼 비활성: 같은 시인 경우에만 비교
    const isMinuteDisabled = (h: string, m: string) => {
        if (effMin === null) return false;
        const v = toMin(`${h}:${m}`)!;
        return v < effMin;
    };

    return (
        <div className="relative w-full">
            <button
                ref={btnRef}
                type="button"
                onClick={() => setOpen((v) => !v)}
                className={[
                    'w-full rounded-xl h-full flex items-center justify-center border border-[#e3ecdc] px-3 py-2 text-sm bg-white text-left hover:bg-gray-50',
                    className,
                ].join(' ')}
                aria-haspopup="dialog"
                aria-expanded={open}
            >
                {value ? (
                    <span className="font-medium">{value}</span>
                ) : (
                    <span className="text-gray-400">{placeholder}</span>
                )}
            </button>

            {open && (
                <div
                    ref={popRef}
                    className="absolute z-30 mt-2 w-[260px] rounded-xl border border-gray-200 bg-white shadow-lg p-3"
                >
                    {/* 퀵 셋 */}
                    <div className="flex gap-2 mb-3">
                        <button
                            className="text-xs px-2 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            onClick={() => {
                                // 현재 시간을 30분 단위로 올림
                                const now = new Date();
                                const n = now.getHours() * 60 + now.getMinutes();
                                const v = fromMin(ceilTo30(n));
                                // min 제약
                                if (effMin !== null && toMin(v)! < effMin) return onChange(fromMin(effMin));
                                onChange(v);
                                setOpen(false);
                            }}
                        >
                            지금 기준
                        </button>
                        <button
                            className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                            onClick={() => {
                                const base =
                                    currentMin ?? ceilTo30(new Date().getHours() * 60 + new Date().getMinutes());
                                const v = fromMin(base + 30);
                                if (effMin !== null && toMin(v)! < effMin) return onChange(fromMin(effMin));
                                onChange(v);
                                setOpen(false);
                            }}
                        >
                            +30분
                        </button>
                        <button
                            className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                            onClick={() => {
                                const base =
                                    currentMin ?? ceilTo30(new Date().getHours() * 60 + new Date().getMinutes());
                                const v = fromMin(base + 60);
                                if (effMin !== null && toMin(v)! < effMin) return onChange(fromMin(effMin));
                                onChange(v);
                                setOpen(false);
                            }}
                        >
                            +1시간
                        </button>
                    </div>

                    {/* 피커: 시/분 2컬럼 */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* 시(스크롤 목록, 적은 높이로 24개만) */}
                        <div className="h-[300px]">
                            <div className="text-[11px] text-gray-500 mb-1">시</div>
                            <div className="h-[280px] overflow-y-scroll rounded-lg border border-gray-100">
                                {HOURS.map((h) => {
                                    const disabled = isHourDisabled(h);
                                    const on = h === hourSel;
                                    return (
                                        <button
                                            key={h}
                                            disabled={disabled}
                                            onClick={() => {
                                                // 시를 누르면 분이 선택되어 있으면 그 분으로 확정, 아니면 00 또는 30 중 가능한 쪽으로
                                                const m = MINUTES.find((mm) => !isMinuteDisabled(h, mm)) ?? '30';
                                                pick(h, m);
                                            }}
                                            className={[
                                                'w-full text-left px-2 py-1.5 text-sm',
                                                disabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-50',
                                                on ? 'bg-emerald-50 text-emerald-700' : '',
                                            ].join(' ')}
                                        >
                                            {h}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 분(00/30 칩) */}
                        <div>
                            <div className="text-[11px] text-gray-500 mb-1">분</div>
                            <div className="grid grid-cols-2 gap-2">
                                {MINUTES.map((m) => {
                                    const h =
                                        hourSel ||
                                        (effMin !== null ? String(Math.floor(effMin / 60)).padStart(2, '0') : '00');
                                    const disabled = isMinuteDisabled(h, m);
                                    const on = m === (minSel ?? '');
                                    return (
                                        <button
                                            key={m}
                                            disabled={disabled}
                                            onClick={() => pick(h, m)}
                                            className={[
                                                'px-2 py-1.5 rounded-lg text-sm',
                                                disabled
                                                    ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800',
                                                on ? 'bg-emerald-50 text-emerald-700' : '',
                                            ].join(' ')}
                                        >
                                            {m}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* 하단: 초기화 / 닫기 */}
                    <div className="flex justify-between mt-3">
                        <button className="text-xs text-gray-500 hover:text-gray-700" onClick={() => onChange('')}>
                            지우기
                        </button>
                        <button
                            className="text-xs px-3 py-1.5 rounded-md bg-white border hover:bg-gray-50"
                            onClick={() => setOpen(false)}
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
