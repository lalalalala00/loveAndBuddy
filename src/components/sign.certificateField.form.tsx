'use client';

import React, { useEffect } from 'react';
import CertificateField from './sign.certificateField';

export type CertificateItem = {
    text: string;
    file?: File | null;
    preview?: string;
};

type Props = {
    value: CertificateItem[];
    onChange: (next: CertificateItem[]) => void;
    title?: string;
    allowUpload?: boolean;
    minCount?: number;
    maxCount?: number;
    className?: string;
};

export default function CertificatesForm({
    value,
    onChange,
    title = '자격증 URL 또는 설명을 추가해 주세요.',
    allowUpload = true,
    minCount = 0,
    maxCount,
    className = '',
}: Props) {
    const updateAt = (idx: number, patch: Partial<CertificateItem>) => {
        const next = [...value];
        next[idx] = { ...next[idx], ...patch };
        onChange(next);
    };

    const addItem = () => {
        if (maxCount !== undefined && value.length >= maxCount) return;
        onChange([...value, { text: '', file: null, preview: '' }]);
    };

    const removeAt = (idx: number) => {
        if (value.length <= (minCount ?? 0)) return;
        const prev = value[idx];
        if (prev?.preview?.startsWith('blob:')) URL.revokeObjectURL(prev.preview);
        const next = value.filter((_, i) => i !== idx);
        onChange(next);
    };

    const handleFileChange = (idx: number, file: File | null) => {
        const prev = value[idx];
        if (prev?.preview?.startsWith('blob:')) URL.revokeObjectURL(prev.preview);

        if (!file) {
            updateAt(idx, { file: null, preview: '' });
            return;
        }

        const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : '';
        updateAt(idx, { file, preview });
    };

    useEffect(() => {
        return () => {
            value.forEach((c) => {
                if (c.preview?.startsWith('blob:')) URL.revokeObjectURL(c.preview);
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const canAdd = maxCount === undefined || value.length < maxCount;
    const canRemove = (idx: number) => value.length > (minCount ?? 0);

    return (
        <div className={`space-y-3 ${className}`}>
            <div className="flex items-center justify-between">
                <p className="text-[13px]">{title}</p>

                <button
                    type="button"
                    onClick={addItem}
                    disabled={!canAdd}
                    className={[
                        'px-3 py-2 rounded-xl border-2 border-dashed text-[14px] transition',
                        canAdd
                            ? 'border-gray-300 bg-white hover:border-[#c8d9b5]'
                            : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed',
                    ].join(' ')}
                >
                    + 자격증 추가하기
                </button>
            </div>

            {value.length === 0 && <div className="text-[12px] text-gray-500">추가된 자격증이 없어요.</div>}

            {value.map((c, idx) => (
                <div key={idx} className="rounded-2xl p-3 border bg-[#f3f7ee23] border-[#e3ecdc]">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[14px] font-medium">자격증 {idx + 1}</span>
                        <button
                            type="button"
                            onClick={() => removeAt(idx)}
                            disabled={!canRemove(idx)}
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

                    <CertificateField
                        value={c.text}
                        onChange={(t) => updateAt(idx, { text: t })}
                        allowUpload={allowUpload}
                        file={c.file ?? null}
                        onFileChange={(f) => handleFileChange(idx, f)}
                        className="mt-1"
                    />
                </div>
            ))}

            <p className="text-[11px] text-gray-500">
                * URL 또는 설명을 여러 개 입력할 수 있어요. (필요 시 파일도 첨부)
            </p>
        </div>
    );
}
