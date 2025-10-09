import ModalIos from '@/common/modal.ios';
import { useUserState } from '@/context/useUserContext';
import AnimalsForm, { defaultAnimal } from './sign.animals.form';
import { useEffect, useState } from 'react';

import Tooltip from '@/common/tooltip';
import CertificatesForm, { CertificateFormItem } from './sign.certificateField.form';
import { Animal, Certificate } from '@/utils/sign';
import { supabase } from '@/lib/supabaseClient';
import { getDecadeLabel } from '@/utils/date';
import { Chip } from '@/common/animal.card.select';

export const getMannerEmoji = (score: number) => {
    if (score >= 9) return '🌸';
    if (score >= 6) return '🍃';
    return '🌿';
};

const SettingModal = ({ isOpen, handleModalState }: { isOpen: boolean; handleModalState: () => void }) => {
    const { getUser, certificates, animals, toast, setToast, setGetUser, setAnimals } = useUserState();

    const [draftAnimals, setDraftAnimals] = useState<Animal[]>(animals);

    const [profilePreview, setProfilePreview] = useState<string>('');
    const [profileFile, setProfileFile] = useState<File | null>(null);

    const [certs, setCerts] = useState<CertificateFormItem[]>([]);

    const [name, setName] = useState('');
    const [comment, setComment] = useState<string>('');

    const [saving, setSaving] = useState(false);
    const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
    const [editOne, setEditOne] = useState<Animal[]>([]);

    const [animalFiles, setAnimalFiles] = useState<Record<string, File>>({});

    const handleClickChip = (a: Animal) => {
        setSelectedAnimal(a);
        setEditOne([a]);
    };

    // const onSaveOne = () => {
    //     if (!editOne.length) return;
    //     const updated = editOne[0];
    //     setSaving(true);

    //     setDraftAnimals((prev) => {
    //         let next = prev.map((x) => (x.animal_uuid === updated.animal_uuid ? { ...x, ...updated } : x));
    //         if (updated.first) {
    //             next = next.map((x) => ({ ...x, first: x.animal_uuid === updated.animal_uuid }));
    //         }
    //         return next;
    //     });

    //     setSelectedAnimal(null);
    //     setEditOne([]);
    //     setSaving(false);
    // };

    const handleEditCancel = () => {
        setSelectedAnimal(null);
        setEditOne([]);
    };
    useEffect(() => {
        if (isOpen && getUser) {
            setName(getUser.name ?? '');
            setComment(getUser.user_comment ?? '');
        }
    }, [isOpen, getUser]);

    const _lov = getUser?.type === 'love' || getUser?.type === 'lovuddy';
    const _buddy = getUser?.type === 'buddy' || getUser?.type === 'lovuddy';

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

    async function uploadAnimalImage(userId: string, key: string, file: File) {
        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';

        const path = `${userId}/animals/${key}-${Date.now()}.${ext}`;

        const { error } = await supabase.storage
            .from('avatars')
            .upload(path, file, { upsert: true, contentType: file.type });

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
            .from('certificates')
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

            const withUrls = await Promise.all(
                draftAnimals.map(async (a, idx) => {
                    const key = a.animal_uuid || `idx-${idx}`;
                    const file = animalFiles[key];
                    if (file) {
                        const publicUrl = await uploadAnimalImage(userId, key, file);
                        return { ...a, img: publicUrl || a.img };
                    }
                    return a;
                }),
            );

            const mergedAnimals = withUrls;

            let seenFirst = false;

            const animalsPayload = mergedAnimals
                .filter((a) => a.name?.trim() || a.img)
                .map((a, idx) => {
                    let first =
                        typeof (a as any).owner === 'boolean' ? (a as any).owner : ((a as any).first ?? idx === 0);
                    if (first) {
                        if (seenFirst) first = false;
                        else seenFirst = true;
                    }
                    console.log(a, 'aa');
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

                    const uuid = (a as any).animal_uuid;
                    if (uuid && /^[0-9a-f-]{36}$/i.test(uuid)) base.animal_uuid = uuid;

                    return base;
                });

            // if (!seenFirst && animalsPayload[0]) animalsPayload[0].first = true;

            if (!animalsPayload.some((a) => a.first) && animalsPayload[0]) {
                animalsPayload[0].first = true;
            }

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
                if ((c as any).id) item.id = (c as any).id;
                return item;
            });

            const animalsPart = animalsPayload.length > 0 ? { animals: { replace: true, items: animalsPayload } } : {};

            const certsPart = certsPayload.length > 0 ? { certificates: { replace: true, items: certsPayload } } : {};
            console.log(animalsPart, 'part');
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
                        user_comment: comment,
                    },
                    ...animalsPart,
                    ...certsPart,
                }),
            });

            const j = await res.json().catch(() => ({}));
            if (!res.ok || !j.ok) throw new Error(j.error || '저장 실패');
            setToast(true);

            setToast(true);
            setGetUser((prev) =>
                prev ? { ...prev, name, user_comment: comment, avatar_url: avatar_url ?? prev.avatar_url } : prev,
            );
            setAnimals(withUrls);
            setDraftAnimals(withUrls);
        } catch (e: any) {
            console.error(e);
            alert(e?.message ?? '저장 중 오류가 발생했습니다.');
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        if (!saving) {
            setEditOne([]);
        }
    }, [saving]);

    useEffect(() => {
        if (!isOpen) return;

        setDraftAnimals(animals && animals.length ? animals : [defaultAnimal(true)]);
    }, [isOpen, animals, saving]);

    const getAnimalKey = (a: Animal, idx: number) => (a as any).animal_uuid || (a as any).client_id || `idx-${idx}`;

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
            <div className="relative p-2 overflow-y-scroll no-scrollbar h-[685px]">
                <div className="w-full rounded-2xl border border-[#e3ecdc] bg-gradient-to-br from-[#f3f7ee] to-white shadow-sm">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-[#e3ecdc] rounded-t-2xl bg-white/60">
                        <h3 className="text-[13px] font-semibold text-[#3c5732]">정보 수정</h3>
                        <span className="text-[11px] text-gray-500">필수 항목을 확인해 주세요</span>
                    </div>

                    <div className="p-3 flex flex-col gap-3">
                        <div className="grid grid-cols-3 gap-2">
                            <div className="rounded-xl border border-[#e3ecdc] bg-white px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                                <p className="text-[11px] text-gray-500">ꯁꯧ 마음</p>
                                <p className="text-[14px] font-semibold text-gray-800">3</p>
                            </div>
                            <div className="rounded-xl border border-[#e3ecdc] bg-white px-3 py-2">
                                <p className="text-[11px] text-gray-500">{getMannerEmoji(4)} 매너 점수</p>
                                <p className="text-[14px] font-semibold text-gray-800">8 점</p>
                            </div>
                            <div className="rounded-xl border border-[#e3ecdc] bg-white px-3 py-2">
                                <p className="text-[11px] text-gray-500">✎ꪑ 디얼 러브</p>
                                <p className="text-[14px] font-semibold text-gray-800">34 장</p>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="flex mr-3 flex-col items-center justify-end  w-1/3 bg-[#f3f7ee] border border-[#e3ecdc] rounded-xl p-2">
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
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={onSelectProfile}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="rounded-xl mb-1 border border-[#e3ecdc] bg-white px-3 py-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                                    <p className="text-[12px] text-gray-600">
                                        타입 : {getMannerEmoji(4)}{' '}
                                        <span className="font-medium text-gray-800">{getUser?.type}</span>
                                    </p>
                                    <p className="text-[12px] text-gray-600">
                                        연령대 :{' '}
                                        <span className="font-medium text-gray-800">
                                            {getDecadeLabel(getUser?.birth_year)}
                                        </span>
                                    </p>
                                </div>

                                <div className="rounded-xl border border-[#e3ecdc] bg-white px-3 py-3">
                                    <label htmlFor="nickname" className="block text-[11px] text-gray-500 mb-1">
                                        닉네임 <span className="text-gray-400">(최대 7자)</span>
                                    </label>
                                    <div className="flex items-end gap-2">
                                        <input
                                            id="nickname"
                                            type="text"
                                            placeholder="닉네임 7자리"
                                            className="px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white shadow-inner text-[14px] w-full outline-none focus:ring-2 focus:ring-emerald-100"
                                            value={name}
                                            onChange={(e) => setName(e.target.value.slice(0, 7))}
                                        />
                                        <span className="text-[11px] text-gray-500 tabular-nums">
                                            {name?.length ?? 0}/7
                                        </span>
                                    </div>
                                    <p className="mt-1 text-[11px] text-gray-500">
                                        · 공개 프로필에 표시되는 이름이에요. 따뜻하고 기억하기 쉬운 닉네임을 권장해요 🌿
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-xl border border-[#e3ecdc] bg-white px-3 py-3">
                            <label htmlFor="nickname" className="block text-[11px] text-gray-500 mb-1">
                                한마디!
                            </label>
                            <div className="flex items-end gap-2">
                                <input
                                    id="user_comment"
                                    type="text"
                                    className="px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white shadow-inner text-[14px] w-full outline-none focus:ring-2 focus:ring-emerald-100"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* 반려동물 */}
                        {getUser && _lov && (
                            <div className="rounded-xl border border-[#e3ecdc] bg-white px-3 py-2">
                                <p className="text-[11px] text-gray-500 mb-1">반려동물</p>
                                <div className="flex flex-wrap gap-1.5 text-[12px]">
                                    {animals.map((item) => (
                                        <button key={item.animal_uuid} onClick={() => handleClickChip(item)}>
                                            <Chip>{item.name}</Chip>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {getUser && _buddy && (
                            <div className="rounded-xl border border-[#e3ecdc] bg-white px-3 py-2">
                                <p className="text-[11px] text-gray-500 mb-1">자격증 정보</p>
                                <div>
                                    {certificates ? (
                                        certificates.map((item, i) => (
                                            <div key={i} className="flex flex-col">
                                                <span className="text-[14px]">✰ {item.name}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex flex-wrap gap-1.5 text-[12px]">
                                            등록된 자격증 정보가 없어요.
                                        </div>
                                    )}
                                </div>

                                <span className="text-[11px] text-red-800">
                                    * 버디 활동 시 자격증 정보가 없으면 등록이 제한돼요.
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                {selectedAnimal && getUser && _lov && (
                    //수정
                    <div className="relative mt-15">
                        <AnimalsForm
                            key={selectedAnimal.animal_uuid}
                            value={editOne}
                            onChange={setEditOne}
                            onLocalFileChange={(idx, file) => {
                                const key = getAnimalKey(editOne[idx], idx);
                                setAnimalFiles((prev) => {
                                    const next = { ...prev };
                                    if (file) next[key] = file;
                                    else delete next[key];
                                    return next;
                                });
                            }}
                            maxCount={5}
                            className="mt-4"
                            allowAddRemove={false}
                            title={`${selectedAnimal.name || '반려동물'} 정보 수정`}
                        />

                        <button
                            onClick={handleEditCancel}
                            className="absolute -top-11 right-0 w-[150px] h-[38px] px-3 py-2 text-[14px] rounded-lg border-2 border-dashed border-red-200  hover:bg-red-200 hover:border-solid"
                        >
                            취소
                        </button>
                    </div>
                )}

                {!selectedAnimal && getUser && _lov && (
                    //새로 추가
                    <div className="p-2 rounded-xl shadow">
                        {/* <AnimalCardVertical initial={animals} onDelete={handleDelete} /> */}
                        <AnimalsForm
                            value={draftAnimals}
                            onChange={setDraftAnimals}
                            onLocalFileChange={(idx, file) => {
                                const key = getAnimalKey(draftAnimals[idx], idx); // draftAnimals 또는 editOne
                                setAnimalFiles((prev) => {
                                    const next = { ...prev };
                                    if (file) next[key] = file;
                                    else delete next[key];
                                    return next;
                                });
                            }}
                            maxCount={5}
                            className="mt-4"
                            allowAddRemove
                        />
                    </div>
                )}

                {getUser && _buddy && (
                    <div className="p-2 rounded-xl shadow">
                        <CertificatesForm value={certs} onChange={setCerts} allowUpload minCount={0} className="mt-3" />
                    </div>
                )}

                {toast && (
                    <div
                        className={`fixed inset-0 z-[100] grid place-items-center transition-opacity duration-200 ${toast ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <div className="absolute inset-0 bg-black/20" />
                        <div
                            className="relative w-[300px] h-[200px] rounded-lg bg-white
      border border-gray-300 shadow flex flex-col items-center justify-center"
                        >
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3 custom-card">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M20 7L9 18L4 13"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <span className="text-[14px]">수정이 완료되었습니다!</span>
                        </div>
                    </div>
                )}
            </div>
        </ModalIos>
    );
};

export default SettingModal;
