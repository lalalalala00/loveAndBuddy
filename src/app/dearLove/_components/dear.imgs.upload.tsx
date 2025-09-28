'use client';

import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';

export default function DearLovePhotoUploader() {
    const [files, setFiles] = useState<FileList | null>(null);
    const [urls, setUrls] = useState<string[]>([]);

    const dearId = 'a3eb62cc-3df9-4560-974e-2a5d7c102821';
    const onUpload = async () => {
        if (!files) return;

        const uploaded: string[] = [];

        for (const file of Array.from(files)) {
            const fileName = `${dearId}/${Date.now()}-${file.name}`;

            const { error } = await supabase.storage.from('dearlove').upload(fileName, file, {
                contentType: file.type,
                upsert: true,
            });

            if (error) {
                console.error('❌ 업로드 실패:', error.message);
                continue;
            }

            const { data: publicUrl } = supabase.storage.from('dearlove').getPublicUrl(fileName);

            uploaded.push(publicUrl.publicUrl);
        }

        const { error: updateError } = await supabase.from('dear_love').update({ photos: uploaded }).eq('id', dearId);

        if (updateError) {
            console.error('❌ DB 업데이트 실패:', updateError.message);
        } else {
            console.log('✅ DB 업데이트 성공:', uploaded);
            setUrls(uploaded);
        }
    };

    return (
        <div className="p-4">
            <input type="file" accept="image/*" multiple onChange={(e) => setFiles(e.target.files)} />
            <button onClick={onUpload} className="mt-2 px-3 py-1 rounded bg-emerald-500 text-white">
                업로드하기
            </button>

            <div className="mt-4 grid grid-cols-3 gap-2">
                {urls.map((url, i) => (
                    <img key={i} src={url} className="w-full rounded-lg shadow" />
                ))}
            </div>
        </div>
    );
}
