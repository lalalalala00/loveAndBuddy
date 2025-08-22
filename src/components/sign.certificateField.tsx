'use client';

import React, { useMemo, useState } from 'react';

type Props = {
    value: string;
    onChange: (next: string) => void;
    label?: string;
    placeholder?: string;
    helpText?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;

    allowUpload?: boolean;
    file?: File | null;
    onFileChange?: (file: File | null) => void;
};

function isURL(s: string) {
    try {
        const u = new URL(s);
        return !!u.protocol && !!u.host;
    } catch {
        return false;
    }
}

export default function CertificateField({
    value,
    onChange,
    label = '자격증 URL 또는 설명',
    placeholder = '자격증 URL 또는 설명을 입력해 주세요',
    helpText = '* 일부 정보는 나중에 추가 가능하지만, 버디 활동 시 자격증 정보가 없으면 등록이 제한돼요.',
    required = false,
    disabled = false,
    className = '',
    allowUpload = false,
    file = null,
    onFileChange,
}: Props) {
    const [preview, setPreview] = useState<string>('');

    const urlValid = useMemo(() => isURL(value), [value]);
    const isImg = useMemo(() => (file?.type ?? '').startsWith('image/'), [file]);

    const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    const pickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!onFileChange) return;
        if (!f) return onFileChange(null);

        onFileChange(f);
        if (f.type.startsWith('image/')) {
            const blob = URL.createObjectURL(f);
            setPreview((prev) => {
                if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
                return blob;
            });
        } else {
            if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
            setPreview('');
        }
    };

    const clearFile = () => {
        if (onFileChange) onFileChange(null);
        if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
        setPreview('');
    };

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {label && (
                <label className="text-[13px] text-gray-600">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div className="flex items-center gap-2">
                <input
                    type="text"
                    name="certificate_url"
                    placeholder={placeholder}
                    value={value}
                    onChange={handleText}
                    disabled={disabled}
                    className="flex-1 px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white shadow-inner text-[14px] disabled:bg-gray-50"
                />
                {urlValid && (
                    <a
                        href={value}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-1 text-[12px] rounded-lg bg-white border border-[#e3ecdc] text-emerald-700 hover:bg-[#f8fbf4]"
                    >
                        링크 확인
                    </a>
                )}
            </div>

            {allowUpload && (
                <div className="mt-1">
                    {file ? (
                        <div className="rounded-xl border border-[#e3ecdc] bg-white p-2">
                            {isImg && (preview || (typeof window !== 'undefined' && URL.createObjectURL)) ? (
                                <img
                                    src={preview}
                                    alt="certificate preview"
                                    className="w-full h-40 object-cover rounded-lg ring-1 ring-[#e3ecdc] shadow-inner"
                                />
                            ) : (
                                <div className="text-[13px] text-gray-600">
                                    선택된 파일: <b>{file.name}</b>
                                </div>
                            )}
                            <div className="mt-2 flex gap-2">
                                <label className="px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white text-[14px] cursor-pointer hover:bg-[#f8fbf4]">
                                    파일 변경
                                    <input type="file" onChange={pickFile} className="hidden" />
                                </label>
                                <button
                                    type="button"
                                    onClick={clearFile}
                                    className="px-3 py-2 rounded-xl border border-red-200 bg-red-50 text-red-600 text-[14px] hover:bg-red-100"
                                >
                                    제거
                                </button>
                            </div>
                        </div>
                    ) : (
                        <label className="flex items-center justify-center px-3 py-6 rounded-xl border-2 border-dashed border-gray-300 bg-white text-[14px] cursor-pointer hover:border-[#c8d9b5]">
                            + 파일 업로드 (선택)
                            <input type="file" onChange={pickFile} className="hidden" />
                        </label>
                    )}
                </div>
            )}

            {/* {helpText && <span className="text-[12px] text-gray-500">{helpText}</span>} */}
        </div>
    );
}
