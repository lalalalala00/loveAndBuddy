'use client';

import { Certificate } from '@/utils/sign';
import React, { useEffect } from 'react';

export type CertificateFormItem = Certificate & {
    file?: File | null; // 업로드 전 실제 파일
    preview?: string; // blob URL (이미지/문서 미리보기)
    file_mime?: string; // 파일 MIME
    file_name?: string; // 파일명
    file_size?: number; // 바이트
};

type Props = {
    value: CertificateFormItem[];
    onChange: (next: CertificateFormItem[]) => void;
    title?: string;
    allowUpload?: boolean;
    minCount?: number;
    maxCount?: number;
    className?: string;
};

const emptyItem = (): CertificateFormItem => ({
    name: '',
    issuer: '',
    acquired_at: '',
    url: '',
    file: null,
    preview: '',
    file_mime: '',
    file_name: '',
    file_size: 0,
});

const isImage = (mime?: string) => !!mime && mime.startsWith('image/');
const isPdf = (mime?: string) => mime === 'application/pdf';

export default function CertificatesForm({
    value,
    onChange,
    title = '자격증 정보를 입력해 주세요.',
    allowUpload = true,
    minCount = 0,
    maxCount,
    className = '',
}: Props) {
    const updateAt = (idx: number, patch: Partial<CertificateFormItem>) => {
        const next = [...value];
        next[idx] = { ...next[idx], ...patch };
        onChange(next);
    };

    const addItem = () => {
        if (maxCount !== undefined && value.length >= maxCount) return;
        onChange([...value, emptyItem()]);
    };

    const revoke = (url?: string) => {
        if (url && url.startsWith('blob:')) URL.revokeObjectURL(url);
    };

    const removeAt = (idx: number) => {
        if (value.length <= (minCount ?? 0)) return;
        const prev = value[idx];
        revoke(prev?.preview);
        const next = value.filter((_, i) => i !== idx);
        onChange(next);
    };

    const handleFileChange = (idx: number, file: File | null) => {
        const prev = value[idx];
        revoke(prev?.preview);

        if (!file) {
            updateAt(idx, {
                file: null,
                preview: '',
                file_mime: '',
                file_name: '',
                file_size: 0,
            });
            return;
        }

        const mime = file.type;
        const preview = isImage(mime) || isPdf(mime) ? URL.createObjectURL(file) : ''; // 이미지/PDF만 미리보기
        updateAt(idx, {
            file,
            preview,
            file_mime: mime,
            file_name: file.name,
            file_size: file.size,
        });
    };

    useEffect(() => {
        return () => {
            value.forEach((c) => revoke(c.preview));
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

                    <div className="grid grid-cols-2 gap-2">
                        <input
                            placeholder="자격증명 (예: 반려동물 행동상담사 2급)"
                            value={c.name}
                            onChange={(e) => updateAt(idx, { name: e.target.value })}
                            className="px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white text-[14px]"
                        />
                        <input
                            placeholder="발급기관 (예: 한국반려동물교육원)"
                            value={c.issuer}
                            onChange={(e) => updateAt(idx, { issuer: e.target.value })}
                            className="px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white text-[14px]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                        <input
                            type="date"
                            placeholder="취득일"
                            value={c.acquired_at}
                            onChange={(e) => updateAt(idx, { acquired_at: e.target.value })}
                            className="px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white text-[14px]"
                        />
                        <input
                            type="url"
                            placeholder="증빙 URL (선택)"
                            value={c.url ?? ''}
                            onChange={(e) => updateAt(idx, { url: e.target.value })}
                            className="px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white text-[14px]"
                        />
                    </div>

                    {allowUpload && (
                        <div className="mt-3">
                            <div className="flex items-center gap-2">
                                <label className="px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white text-[14px] cursor-pointer hover:bg-[#f8fbf4]">
                                    파일 첨부 (이미지 또는 PDF)
                                    <input
                                        type="file"
                                        accept="image/*,application/pdf"
                                        onChange={(e) => handleFileChange(idx, e.target.files?.[0] ?? null)}
                                        className="hidden"
                                    />
                                </label>
                                {c.file_name && (
                                    <span className="text-[12px] text-gray-600">
                                        {c.file_name} ({Math.ceil((c.file_size ?? 0) / 1024)} KB)
                                    </span>
                                )}
                                {c.file && (
                                    <button
                                        type="button"
                                        onClick={() => handleFileChange(idx, null)}
                                        className="px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white text-[12px] hover:bg-[#f8fbf4]"
                                    >
                                        파일 제거
                                    </button>
                                )}
                            </div>

                            {c.preview && (
                                <div className="mt-2 rounded-xl border border-[#e3ecdc] bg-white p-2">
                                    {isImage(c.file_mime) && (
                                        <img
                                            src={c.preview}
                                            alt="certificate preview"
                                            className="w-full h-40 object-cover rounded-lg ring-1 ring-[#e3ecdc] shadow-inner"
                                        />
                                    )}
                                    {isPdf(c.file_mime) && (
                                        <div className="w-full">
                                            <object
                                                data={c.preview}
                                                type="application/pdf"
                                                className="w-full h-64 rounded-lg ring-1 ring-[#e3ecdc]"
                                            >
                                                <a
                                                    href={c.preview}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="underline text-blue-600"
                                                >
                                                    PDF 미리보기가 지원되지 않습니다. 클릭하여 열기
                                                </a>
                                            </object>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}

            <p className="text-[11px] text-gray-500">
                * 자격증명/발급기관/취득일은 권장 입력, URL 또는 (이미지/PDF) 파일은 선택입니다.
            </p>
        </div>
    );
}
