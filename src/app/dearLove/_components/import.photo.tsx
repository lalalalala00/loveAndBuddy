'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ImageUp, Trash2, Replace, Plus, GripVertical, X } from 'lucide-react';

type Photo = {
    id: string;
    file: File;
    url: string;
};

function uid() {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const ImportPhoto = () => {
    const [cover, setCover] = useState<Photo | null>(null);

    const [photos, setPhotos] = useState<Photo[]>([]);
    const draggingId = useRef<string | null>(null);

    const coverInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    const filesToPhotos = (files: FileList | File[]) => {
        const list = Array.from(files).filter((f) => f.type.startsWith('image/'));
        return list.map<Photo>((file) => ({
            id: uid(),
            file,
            url: URL.createObjectURL(file),
        }));
    };

    const handlePickCover = useCallback(
        (files: FileList | null) => {
            if (!files || !files.length) return;
            if (cover) URL.revokeObjectURL(cover.url);
            const [photo] = filesToPhotos(files);
            setCover(photo);
        },
        [cover],
    );

    const handleRemoveCover = useCallback(() => {
        if (cover) URL.revokeObjectURL(cover.url);
        setCover(null);
        coverInputRef.current?.value && (coverInputRef.current.value = '');
    }, [cover]);

    const addPhotos = useCallback((files: FileList | File[]) => {
        if (!files || !Array.from(files).length) return;
        const newOnes = filesToPhotos(files);
        setPhotos((prev) => [...prev, ...newOnes]);
    }, []);

    const removePhoto = useCallback((id: string) => {
        setPhotos((prev) => {
            const target = prev.find((p) => p.id === id);
            if (target) URL.revokeObjectURL(target.url);
            return prev.filter((p) => p.id !== id);
        });
    }, []);

    const onDragStart = (id: string) => (e: React.DragEvent) => {
        draggingId.current = id;
        const img = document.createElement('img');
        img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>';
        e.dataTransfer.setDragImage(img, 0, 0);
    };

    const onDragEnter = (overId: string) => (e: React.DragEvent) => {
        e.preventDefault();
        const fromId = draggingId.current;
        if (!fromId || fromId === overId) return;

        setPhotos((prev) => {
            const fromIdx = prev.findIndex((p) => p.id === fromId);
            const toIdx = prev.findIndex((p) => p.id === overId);
            if (fromIdx === -1 || toIdx === -1) return prev;

            const next = [...prev];
            const [moved] = next.splice(fromIdx, 1);
            next.splice(toIdx, 0, moved);
            return next;
        });
    };

    const onDragEnd = () => {
        draggingId.current = null;
    };

    const onDropGallery = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length) {
            addPhotos(e.dataTransfer.files);
        }
    };

    const onDragOverGallery = (e: React.DragEvent) => {
        e.preventDefault();
    };

    useEffect(() => {
        return () => {
            if (cover) URL.revokeObjectURL(cover.url);
            photos.forEach((p) => URL.revokeObjectURL(p.url));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="w-full rounded-xl p-3 mb-3 bg-[#f5f7ee81] border-[#e3ecdc] border shadow">
            <div className="flex gap-3">
                <div className="w-[140px] shrink-0">
                    {!cover ? (
                        <button
                            type="button"
                            onClick={() => coverInputRef.current?.click()}
                            className="flex flex-col rounded-xl w-[140px] h-[130px] border-2 border-dashed border-gray-300 bg-white items-center justify-center p-3 hover:border-[#9dbb80]"
                        >
                            <ImageUp className="mb-2" size={20} />
                            <span className="text-[13px]">대표 이미지 선택하기</span>
                            <span className="text-[12px] text-gray-700 mt-1 text-center">
                                상단 요약 정보의 배경 이미지가 됩니다.
                            </span>
                        </button>
                    ) : (
                        <div className="flex flex-col w-[140px] h-full border-r border-gray-300 pr-2">
                            <img
                                src={cover.url}
                                onClick={handleRemoveCover}
                                alt="대표 이미지"
                                className="w-full h-[130px] object-cover rounded-xl hover:opacity-60 hover:border hover:border-red-400 cursor-pointer"
                                draggable={false}
                            />
                            <div className="flex items-center p-1 mt-1">
                                <button
                                    type="button"
                                    onClick={() => coverInputRef.current?.click()}
                                    className="flex w-full bg-white justify-center items-center gap-1 px-2 py-1 rounded-lg border border-[#e3ecdc] text-[12px] hover:bg-[#f8fbf4]"
                                >
                                    <Replace size={14} />
                                    대표 이미지 변경
                                </button>
                                {/* <button
                                    type="button"
                                    className="flex items-center gap-1 px-2 py-1 rounded-lg border border-[#e3ecdc] text-[12px] hover:bg-[#fef2f2]"
                                >
                                    <Trash2 size={14} />
                                    삭제
                                </button> */}
                            </div>
                        </div>
                    )}

                    <input
                        ref={coverInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePickCover(e.target.files)}
                    />
                </div>

                <div className="flex-1 min-w-0">
                    {photos.length > 0 && (
                        <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1">
                            {photos.map((p) => (
                                <div
                                    key={p.id}
                                    className="group cursor-pointer relative border border-[#e3ecdc] rounded-xl overflow-hidden bg-white"
                                    draggable
                                    onDragStart={onDragStart(p.id)}
                                    onDragEnter={onDragEnter(p.id)}
                                    onDragEnd={onDragEnd}
                                >
                                    <img
                                        src={p.url}
                                        alt="업로드 이미지"
                                        className="w-full h-[130px] object-cover select-none pointer-events-none"
                                        draggable={false}
                                    />

                                    <div className=" absolute top-1 right-1 flex items-center justify-between opacity-0 group-hover:opacity-100 transition">
                                        <button
                                            type="button"
                                            onClick={() => removePhoto(p.id)}
                                            className="inline-flex items-center gap-1 p-1 rounded-lg bg-white/90 border border-[#e3ecdc] text-[12px] hover:bg-[#fef2f2]"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <div
                                className="w-full ml-1 flex items-center justify-center bg-white border-2 border-dashed border-gray-200 rounded-xl h-[130px] p-3 hover:border-[#9dbb80] cursor-pointer"
                                onClick={() => galleryInputRef.current?.click()}
                                onDrop={onDropGallery}
                                onDragOver={onDragOverGallery}
                            >
                                <span className="text-[14px] flex flex-col items-center">
                                    <Plus size={18} />
                                </span>
                                <input
                                    ref={galleryInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={(e) => e.target.files && addPhotos(e.target.files)}
                                />
                            </div>
                        </div>
                    )}
                    {photos.length <= 0 && (
                        <div
                            className="w-full flex items-center justify-center bg-white border-2 border-dashed border-gray-200 rounded-xl h-[130px] p-3 hover:border-[#9dbb80] cursor-pointer"
                            onClick={() => galleryInputRef.current?.click()}
                            onDrop={onDropGallery}
                            onDragOver={onDragOverGallery}
                        >
                            <span className="text-[14px] flex items-center gap-2">
                                <Plus size={18} />
                                사진 가져오기
                            </span>
                            <input
                                ref={galleryInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={(e) => e.target.files && addPhotos(e.target.files)}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImportPhoto;
