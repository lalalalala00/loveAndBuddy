'use client';

import React, { useEffect } from 'react';

export type AnimalForm = {
    name: string;
    age: string;
    type: 'dog' | 'cat' | 'others';
    variety: string;
    color: string;
    personality: 'introvert' | 'extrovert';
    level: string; // "1"~"10"
    comment: string;
    img: string;
    owner: boolean;
    file?: File | null;
    preview?: string;
};

export const defaultAnimal = (owner = false): AnimalForm => ({
    name: '',
    age: '',
    type: 'dog',
    variety: '',
    color: '',
    personality: 'extrovert',
    level: '5',
    comment: '',
    img: '',
    owner,
    file: null,
    preview: '',
});

type Props = {
    value: AnimalForm[];
    onChange: (next: AnimalForm[]) => void;
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
    const updateAt = (idx: number, patch: Partial<AnimalForm>) => {
        const next = [...value];
        next[idx] = { ...next[idx], ...patch };
        onChange(next);
    };

    const setOwnerAt = (idx: number) => {
        const next = value.map((a, i) => ({ ...a, owner: i === idx }));
        onChange(next);
    };

    const addAnimal = () => {
        if (maxCount !== undefined && value.length >= maxCount) return;
        onChange([...value, defaultAnimal(false)]);
    };

    const removeAt = (idx: number) => {
        if (value.length <= (minCount ?? 1)) return;
        const wasOwner = value[idx].owner;
        const next = value.filter((_, i) => i !== idx);

        if (wasOwner || !next.some((a) => a.owner)) {
            next[0] = { ...next[0], owner: true };
            for (let i = 1; i < next.length; i++) {
                if (next[i].owner) next[i] = { ...next[i], owner: false };
            }
        }
        onChange(next);
    };

    const onPickImgAt = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !file.type.startsWith('image/')) return;
        const url = URL.createObjectURL(file);
        const prev = value[idx];
        if (prev.preview?.startsWith('blob:')) URL.revokeObjectURL(prev.preview);
        updateAt(idx, { file, preview: url, img: url });
    };

    const clearImgAt = (idx: number) => {
        const prev = value[idx];
        if (prev.preview?.startsWith('blob:')) URL.revokeObjectURL(prev.preview);
        updateAt(idx, { file: null, preview: '', img: '' });
    };

    useEffect(() => {
        return () => {
            value.forEach((a) => {
                if (a.preview?.startsWith('blob:')) URL.revokeObjectURL(a.preview);
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                        a.owner ? 'bg-[#f3f7ee] border-[#e3ecdc] shadow' : 'bg-[#f3f7ee23] border-[#e3ecdc]',
                    ].join(' ')}
                >
                    {/* 헤더 */}
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <span className="text-[14px] font-medium">{a.name || `반려동물 ${idx + 1}`}</span>
                            {a.owner && (
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
                                onChange={(e) => updateAt(idx, { type: e.target.value as AnimalForm['type'] })}
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
                                value={a.age}
                                onChange={(e) => updateAt(idx, { age: e.target.value })}
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
                                    updateAt(idx, { personality: e.target.value as AnimalForm['personality'] })
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
                                        value={a.level}
                                        onChange={(e) => updateAt(idx, { level: e.target.value })}
                                        className="px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white text-[14px] w-[50px] mr-2"
                                    />
                                    <span className="text-[14px]">/10</span>
                                </div>
                            </div>

                            <div className="col-span-2">
                                {a.preview || a.img ? (
                                    <div className="relative rounded-xl border border-[#e3ecdc] bg-white p-2">
                                        <img
                                            src={a.preview || a.img}
                                            alt="animal preview"
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
