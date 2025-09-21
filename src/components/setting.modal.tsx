import ModalIos from '@/common/modal.ios';
import { useUserState } from '@/context/useUserContext';
import AnimalsForm, { defaultAnimal } from './sign.animals.form';
import { useEffect, useState } from 'react';
import AnimalCardVertical, { Animal } from '@/common/animal.card.vertical';
import Tooltip from '@/common/tooltip';
import { getMannerEmoji } from '@/common/buddy.name.tag';
import CertificatesForm from './sign.certificateField.form';
import { Certificate } from '@/utils/sign';
import { supabase } from '@/lib/supabaseClient';
import AnimalSelect from '@/common/animal.card.select';

const SettingModal = ({ isOpen, handleModalState }: { isOpen: boolean; handleModalState: () => void }) => {
    const { getUser, certificates, animals } = useUserState();
    const [animalsForm, setAnimalsForm] = useState<Animal[]>([defaultAnimal(true)]);

    const [draftAnimals, setDraftAnimals] = useState<Animal[]>(animals);

    console.log(animals, 'dd');

    const [profilePreview, setProfilePreview] = useState<string>(''); // 미리보기
    const [profileFile, setProfileFile] = useState<File | null>(null);

    const [certs, setCerts] = useState<Certificate[]>([]);

    const [name, setName] = useState('');

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isOpen && getUser) setName(getUser.name ?? '');
    }, [isOpen, getUser]);

    const _lov = getUser?.type === 'love' || getUser?.type === 'lovuddy';
    const _buddy = getUser?.type === 'buddy' || getUser?.type === 'lovuddy';

    const handleDelete = (id: string) => {
        if (draftAnimals.length === 0) return;

        setDraftAnimals((prev) => {
            if (prev.length <= 1) return prev;

            const wasOwner = prev.find((a) => a.animalId === id)?.owner;
            const next = prev.filter((a) => a.animalId !== id);

            if (next.length === 1) {
                if (!next[0].owner) next[0] = { ...next[0], owner: true };
                return next;
            }

            if (wasOwner || !next.some((a) => a.owner)) {
                next[0] = { ...next[0], owner: true };

                for (let i = 1; i < next.length; i++) {
                    if (next[i].owner) next[i] = { ...next[i], owner: false };
                }
            }

            return next;
        });
    };

    async function uploadAvatarAndGetUrl(userId: string): Promise<string | null> {
        if (!profileFile) return getUser?.avatar_url || null;
        const ext = profileFile.name.split('.').pop()?.toLowerCase() || 'jpg';
        const path = `${userId}/avatar.${ext}`;

        const { error } = await supabase.storage
            .from('avatars')
            .upload(path, profileFile, { upsert: true, contentType: profileFile.type });
        if (error) throw error;

        const { data } = supabase.storage.from('avatars').getPublicUrl(path);
        return data.publicUrl || null;
    }

    const onSelectProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setProfileFile(file);
        const reader = new FileReader();
        reader.onload = () => setProfilePreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const clearProfile = () => {
        setProfileFile(null);
        setProfilePreview('');
        // setV((prev) => ({ ...prev, profileImg: '' }));
    };

    const safeName = (s: string) => s.replace(/[^\w.\-]+/g, '_').slice(0, 80);

    async function uploadCertFile(userId: string, file: File) {
        const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
        const path = `${userId}/certs/${Date.now()}-${safeName(file.name)}`;
        const { error } = await supabase.storage
            .from('certificates') // ★ 버킷명: 예) 'certificates' (만들어두세요, public 읽기 권장)
            .upload(path, file, { upsert: true, contentType: file.type });
        if (error) throw error;
        const { data } = supabase.storage.from('certificates').getPublicUrl(path);
        return data.publicUrl;
    }

    const handleSaveAll = async () => {
        try {
            setSaving(true);

            const [{ data: sess }, { data: u }] = await Promise.all([
                supabase.auth.getSession(),
                supabase.auth.getUser(),
            ]);
            const token = sess.session?.access_token;
            const userId = u.user?.id;
            if (!token || !userId) throw new Error('세션이 없습니다.');

            let avatar_url: string | null = null;
            try {
                avatar_url = await uploadAvatarAndGetUrl(userId);
            } catch (e) {
                console.warn('avatar upload skipped:', e);
            }

            // 유효성 검사
            const isUuid = (v: any) =>
                typeof v === 'string' &&
                /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);

            const mergedAnimals = [...(draftAnimals ?? []), ...(animalsForm ?? [])];
            let seenFirst = false;

            const animalsPayload = mergedAnimals
                .filter((a) => a.name?.trim() || a.img) // 빈 폼 제거
                .map((a, idx) => {
                    let first =
                        typeof (a as any).owner === 'boolean' ? (a as any).owner : ((a as any).first ?? idx === 0);
                    if (first) {
                        if (seenFirst) first = false;
                        else seenFirst = true;
                    }

                    // 공통 필드
                    const base: any = {
                        name: a.name?.trim() ?? '',
                        birth_year: a.birth_year ? Number(a.birth_year) : null,
                        type: (a as any).type ?? 'dog',
                        variety: a.variety ?? '',
                        color: a.color ?? '',
                        personality: (a as any).personality ?? 'introvert',
                        level: Number((a as any).level ?? 0),
                        comment: a.comment ?? '',
                        img: a.img ?? '',
                        first,
                    };

                    // ⚠️ 절대 animalId/숫자 넣지 말 것. 유효 uuid만 포함. 그 외는 **키 자체를 빼기**
                    const uuid = (a as any).animal_uuid;
                    if (isUuid(uuid)) base.animal_uuid = uuid;

                    return base;
                });

            if (!seenFirst && animalsPayload[0]) animalsPayload[0].first = true;

            const certsWithUrl = await Promise.all(
                (certs ?? []).map(async (c) => {
                    if (c.file && !c.url) {
                        try {
                            const publicUrl = await uploadCertFile(userId, c.file);
                            return { ...c, url: publicUrl };
                        } catch (e) {
                            console.warn('cert file upload failed:', e);
                            return c;
                        }
                    }
                    return c;
                }),
            );

            const certsPayload = certsWithUrl.map((c) => {
                const item: any = {
                    name: c.name?.trim() ?? '',
                    issuer: c.issuer?.trim() ?? '',
                    acquired_at: c.acquired_at || null, // 'YYYY-MM-DD'
                    url: c.url ?? null,
                };
                if ((c as any).id) item.id = (c as any).id; // 기존 항목만 id 포함
                return item;
            });

            // 서버로 POST
            const res = await fetch('/api/profile/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    profile: {
                        name,
                        avatar_url: avatar_url ?? undefined,
                    },
                    animals: {
                        replace: true,
                        items: animalsPayload,
                    },
                    certificates: {
                        replace: true,
                        items: certsPayload,
                    },
                }),
            });

            const j = await res.json().catch(() => ({}));
            if (!res.ok || !j.ok) throw new Error(j.error || '저장 실패');

            handleModalState();
        } catch (e: any) {
            console.error(e);
            alert(e?.message ?? '저장 중 오류가 발생했습니다.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <ModalIos
            isOpen={isOpen}
            handleModalState={handleModalState}
            title="정보 수정하기"
            width="590px"
            height="800px"
            leftAction={handleSaveAll}
            leftComment={saving ? '저장 중…' : '정보 수정하기'}
        >
            <div className="p-2 overflow-y-scroll no-scrollbar h-[685px]">
                <div className="p-2 rounded-xl shadow mb-3 flex">
                    <div className="flex flex-col items-center justify-end  w-1/3 bg-[#f3f7ee] border border-[#e3ecdc] rounded-xl p-2">
                        <div className="flex items-center justify-center gap-3 flex-col ">
                            {profilePreview || getUser?.avatar_url ? (
                                <Tooltip
                                    comment={
                                        <div className="w-24 h-24 rounded-full overflow-hidden border border-[#e3ecdc] bg-white shadow-inner">
                                            <img
                                                src={profilePreview || getUser?.avatar_url}
                                                alt="profile"
                                                className="w-full h-full object-cover cursor-pointer hover:opacity-40 hover:border hover:border-red-400"
                                                onClick={clearProfile}
                                            />
                                        </div>
                                    }
                                    tooltip="삭제"
                                />
                            ) : (
                                <></>
                            )}

                            <div className="flex gap-1 justify-end">
                                <label
                                    className="px-3 py-2 rounded-xl border-2 border-dashed border-gray-200 h-full bg-white shadow 
                          cursor-pointer text-[13px]"
                                >
                                    + 프로필 이미지 선택
                                    <input type="file" accept="image/*" className="hidden" onChange={onSelectProfile} />
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between w-2/3 bg-[#f3f7ee] border border-[#e3ecdc] rounded-xl p-2 ml-2">
                        <div className="px-2 flex">
                            <p className="text-[12px] text-gray-600">
                                ꯁꯧ 마음: <span className="font-medium">3</span>
                            </p>
                            <p className="text-[12px] text-gray-600 mx-3">
                                {getMannerEmoji(4)} 매너 점수: <span className="font-medium">8 점</span>
                            </p>
                            <p className="text-[12px] text-gray-600">
                                ✎ꪑ 디얼 러브: <span className="font-medium">34 장</span>
                            </p>
                        </div>
                        <div className="flex items-end w-full">
                            <input
                                type="text"
                                placeholder="닉네임 7자리"
                                className="px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white shadow-inner text-[14px] w-2/3"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <button className="text-[12px] ml-2 custom-card p-2 rounded-xl w-1/3">
                                닉네임 변경하기
                            </button>
                        </div>
                    </div>
                </div>

                {getUser && _lov && (
                    <div className="p-2 rounded-xl shadow">
                        <AnimalCardVertical initial={animals} onDelete={handleDelete} />
                        <AnimalsForm value={animalsForm} onChange={setAnimalsForm} maxCount={5} className="mt-4" />
                    </div>
                )}

                {getUser && _buddy && (
                    <div className="p-2 rounded-xl shadow">
                        <div>
                            {certificates.map((item, i) => (
                                <div key={i}>
                                    <span>{item.name}</span>
                                </div>
                            ))}
                        </div>
                        <CertificatesForm value={certs} onChange={setCerts} allowUpload minCount={0} className="mt-3" />
                    </div>
                )}
            </div>
        </ModalIos>
    );
};

export default SettingModal;
