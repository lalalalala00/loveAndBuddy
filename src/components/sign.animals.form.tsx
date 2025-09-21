'use client';

import { Animal, EMPTY_ANIMAL } from '@/utils/sign';
import React, { useEffect, useRef, useState } from 'react';

export const defaultAnimal = (first = false): Animal => ({
    ...EMPTY_ANIMAL,
    first,
});

type Props = {
    value: Animal[];
    onChange: (next: Animal[]) => void;
    title?: string;
    minCount?: number;
    maxCount?: number;
    className?: string;
};

export default function AnimalsForm({
    value,
    onChange,
    title = '반려동물 정보를 입력해주세요. 대표는 한 마리만 지정돼요.',
    minCount = 1,
    maxCount,
    className = '',
}: Props) {
    const [files, setFiles] = useState<Record<number, File | null>>({});
    const createdUrlsRef = useRef<Set<string>>(new Set());

    const updateAt = (idx: number, patch: Partial<Animal>) => {
        const next = [...value];
        next[idx] = { ...next[idx], ...patch };
        onChange(next);
    };

    const setOwnerAt = (idx: number) => {
        const next = value.map((a, i) => ({ ...a, first: i === idx }));
        onChange(next);
    };

    const addAnimal = () => {
        if (maxCount !== undefined && value.length >= maxCount) return;
        const hasFirst = value.some((v) => v.first);
        const newItem = defaultAnimal(false);
        const next = [...value, newItem];
        if (!hasFirst && next.length > 0) {
            next[0] = { ...next[0], first: true };
        }
        onChange(next);
    };

    const removeAt = (idx: number) => {
        if (value.length <= (minCount ?? 1)) return;
        const wasOwner = value[idx].first;

        const img = value[idx]?.img;
        if (img?.startsWith('blob:') && createdUrlsRef.current.has(img)) {
            URL.revokeObjectURL(img);
            createdUrlsRef.current.delete(img);
        }

        const next = value.filter((_, i) => i !== idx);

        if (wasOwner || !next.some((a) => a.first)) {
            if (next[0]) next[0] = { ...next[0], first: true };
            for (let i = 1; i < next.length; i++) {
                if (next[i].first) next[i] = { ...next[i], first: false };
            }
        }
        onChange(next);

        setFiles((prev) => {
            const copy = { ...prev };
            delete copy[idx];

            return copy;
        });
    };

    const onPickImgAt = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !file.type.startsWith('image/')) return;

        const prevImg = value[idx]?.img;
        if (prevImg?.startsWith('blob:') && createdUrlsRef.current.has(prevImg)) {
            URL.revokeObjectURL(prevImg);
            createdUrlsRef.current.delete(prevImg);
        }

        const url = URL.createObjectURL(file);
        createdUrlsRef.current.add(url);

        setFiles((prev) => ({ ...prev, [idx]: file }));
        updateAt(idx, { img: url });
    };

    const clearImgAt = (idx: number) => {
        const prevImg = value[idx]?.img;

        if (prevImg?.startsWith('blob:') && createdUrlsRef.current.has(prevImg)) {
            URL.revokeObjectURL(prevImg);
            createdUrlsRef.current.delete(prevImg);
        }

        setFiles((prev) => ({ ...prev, [idx]: null }));
        updateAt(idx, { img: '' });
    };

    useEffect(() => {
        return () => {
            createdUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
            createdUrlsRef.current.clear();
        };
    }, []);

    const canAdd = maxCount === undefined || value.length < maxCount;
    const canRemove = (idx: number) => value.length > (minCount ?? 1);

    return (
        <div className={`space-y-3 ${className}`}>
            <div className="flex items-center justify-between">
                <p className="text-[13px]">{title}</p>
                <button
                    type="button"
                    onClick={addAnimal}
                    disabled={!canAdd}
                    className={[
                        'px-3 py-2 rounded-xl border-2 border-dashed text-[14px] transition',
                        canAdd
                            ? 'border-gray-300 bg-white hover:border-emerald-300'
                            : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed',
                    ].join(' ')}
                >
                    + 반려동물 추가하기
                </button>
            </div>

            {value.map((a, idx) => (
                <div
                    key={idx}
                    className={[
                        'rounded-2xl p-3 border transition',
                        a.first ? 'bg-[#f3f7ee] border-[#e3ecdc] shadow' : 'bg-[#f3f7ee23] border-[#e3ecdc]',
                    ].join(' ')}
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <span className="text-[14px] font-medium">{a.name || `반려동물 ${idx + 1}`}</span>
                            {a.first && (
                                <span className="px-2 py-0.5 text-[11px] rounded-lg bg-white text-[#51683b] shadow">
                                    대표
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setOwnerAt(idx)}
                                className="px-2 py-1.5 text-[12px] rounded-lg bg-white hover:bg-[#f8fbf4] shadow"
                            >
                                대표로 설정
                            </button>
                            <button
                                type="button"
                                disabled={!canRemove(idx)}
                                onClick={() => removeAt(idx)}
                                className={[
                                    'px-2 py-1.5 text-[12px] rounded-lg border',
                                    canRemove(idx)
                                        ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                                        : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed',
                                ].join(' ')}
                            >
                                삭제
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-2">
                            <input
                                placeholder="반려동물 이름"
                                value={a.name}
                                onChange={(e) => updateAt(idx, { name: e.target.value })}
                                className="px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white shadow-inner text-[14px]"
                            />
                            <select
                                value={a.type}
                                onChange={(e) => updateAt(idx, { type: e.target.value as Animal['type'] })}
                                className="px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white text-[14px]"
                            >
                                <option value="dog">강아지</option>
                                <option value="cat">고양이</option>
                                <option value="others">기타</option>
                            </select>
                            <input
                                type="number"
                                min={0}
                                placeholder="출생년도 (예: 2012)"
                                value={a.birth_year || 0}
                                onChange={(e) => updateAt(idx, { birth_year: Number(e.target.value || 0) })}
                                className="px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white shadow-inner text-[14px]"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <input
                                placeholder="품종 (예: 스피츠)"
                                value={a.variety}
                                onChange={(e) => updateAt(idx, { variety: e.target.value })}
                                className="px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white text-[14px]"
                            />
                            <input
                                placeholder="색상 (예: 하얀색)"
                                value={a.color}
                                onChange={(e) => updateAt(idx, { color: e.target.value })}
                                className="px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white text-[14px]"
                            />
                            <select
                                value={a.personality}
                                onChange={(e) =>
                                    updateAt(idx, { personality: e.target.value as Animal['personality'] })
                                }
                                className="px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white text-[14px]"
                            >
                                <option value="extrovert">외향적</option>
                                <option value="introvert">내향적</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-3 gap-2 items-end">
                            <div className="flex flex-col">
                                <span className="text-[12px] px-1 mb-1">난이도</span>
                                <div className="flex items-center">
                                    <input
                                        type="number"
                                        min={1}
                                        max={10}
                                        value={Number.isFinite(Number(a.level)) ? Number(a.level) : 0}
                                        onChange={(e) => {
                                            const n = Math.max(0, Math.min(10, Number(e.target.value || 0)));
                                            updateAt(idx, { level: n as any });
                                        }}
                                        className="px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white text-[14px] w-[50px] mr-2"
                                    />
                                    <span className="text-[14px]">/10</span>
                                </div>
                            </div>

                            <div className="col-span-2">
                                {a.img ? (
                                    <div className="relative rounded-xl border border-[#e3ecdc] bg-white p-2">
                                        <img
                                            src={a.img}
                                            alt="animal"
                                            onClick={() => clearImgAt(idx)}
                                            className="w-full h-40 object-cover rounded-lg ring-1 ring-[#e3ecdc] shadow-inner hover:opacity-50 hover:border hover:border-red-400 cursor-pointer"
                                        />
                                        <div className="mt-2 flex gap-2">
                                            <label className="px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white text-[14px] cursor-pointer hover:bg-[#f8fbf4]">
                                                이미지 변경
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => onPickImgAt(idx, e)}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                        <p className="mt-1 text-[11px] text-gray-500">
                                            권장: 가로세로 1:1 또는 4:3 비율
                                        </p>
                                    </div>
                                ) : (
                                    <label className="flex items-center justify-center px-3 py-6 rounded-xl border-2 border-dashed border-gray-300 bg-white text-[14px] cursor-pointer hover:border-[#c8d9b5]">
                                        + 이미지 추가하기
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => onPickImgAt(idx, e)}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        <textarea
                            placeholder="코멘트 (예: 흙냄새 풀냄새 좋아해요!)"
                            value={a.comment}
                            onChange={(e) => updateAt(idx, { comment: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white text-[14px] focus:outline-none"
                            rows={3}
                        />
                    </div>
                </div>
            ))}

            <p className="text-[11px] text-gray-500">
                * 마지막 {minCount}마리는 삭제할 수 없어요. 대표는 한 마리만 지정됩니다.
            </p>
        </div>
    );
}
