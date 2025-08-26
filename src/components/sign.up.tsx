'use client';

import { useEffect, useMemo, useState } from 'react';
import ModalIos from '@/common/modal.ios';
import { supabase } from '@/lib/supabaseClient';
import { Animal } from '@/common/animal.card.vertical';
import AnimalsForm, { AnimalForm, defaultAnimal } from './sign.animals.form';
import CertificateField from './sign.certificateField';
import CertificatesForm, { CertificateItem } from './sign.certificateField.form';
import Modal from '@/common/modal';
import Tooltip from '@/common/tooltip';

type Role = 'love' | 'buddy' | 'lovuddy';

type SignUpFormValues = {
    email: string;
    password: string;
    name: string;
    type: Role | null;
    avatar_url: string;
    animal: {
        name: string;
        age: string;
        type: Animal['type'];
        variety: string;
        color: string;
        personality: Animal['personality'];
        level: string; // 1~10
        comment: string;
        img: string;
    };
    certificate_url?: string | null;
};

const ROLES: Array<{ label: string; value: Role; comment: string; icon: string }> = [
    { label: '러브', value: 'love', icon: '💚', comment: '믿을 수 있는 펫시터를 찾고 있어요!' },
    { label: '버디', value: 'buddy', icon: '🐾', comment: '반려동물을 사랑으로 돌봐줄 준비가 되었어요!' },
    { label: '러버디', value: 'lovuddy', icon: '🌿', comment: '펫시터도 찾고, 다른 반려인도 도와주고 싶어요!' },
];

export default function SignUpModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [v, setV] = useState<SignUpFormValues>({
        email: '',
        password: '',
        name: '',
        type: null,
        avatar_url: '',
        animal: {
            name: '',
            age: '',
            type: 'dog',
            variety: '',
            color: '',
            personality: 'extrovert',
            level: '5',
            comment: '',
            img: '',
        },
        certificate_url: null,
    });

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');
    const [justSaved, setJustSaved] = useState(false);

    const [animalsForm, setAnimalsForm] = useState<AnimalForm[]>([defaultAnimal(true)]);

    const [profilePreview, setProfilePreview] = useState<string>(''); // 미리보기
    const [profileFile, setProfileFile] = useState<File | null>(null);

    const [certs, setCerts] = useState<CertificateItem[]>([]);

    const isBuddy = v.type === 'buddy';
    const isLove = v.type === 'love';
    const isLovuddy = v.type === 'lovuddy';

    const canSubmit = useMemo(() => {
        if (!v.email || !v.password || v.password.length < 6 || !v.name || !v.type) return false;

        if (v.type === 'love' || v.type === 'lovuddy') {
            const owner = animalsForm.find((a) => a.owner) ?? animalsForm[0];
            if (!owner) return false;
            return !!owner.name && !!owner.age && !!owner.type;
        }

        return true;
    }, [v.email, v.password, v.name, v.type, animalsForm]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('animal.')) {
            const key = name.replace('animal.', '') as keyof SignUpFormValues['animal'];
            setV((prev) => ({ ...prev, animal: { ...prev.animal, [key]: value } }));
        } else {
            setV((prev) => ({ ...prev, [name]: value }));
        }
        setErr('');
    };

    const selectRole = (r: Role) => setV((prev) => ({ ...prev, type: r }));

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
        setV((prev) => ({ ...prev, profileImg: '' }));
    };

    const uploadProfileAndGetUrl = async (userId: string) => {
        if (!profileFile) return '';
        const ext = profileFile.name.split('.').pop() || 'jpg';
        const path = `${userId}/profile_${Date.now()}_.${ext}`;

        const { error: upErr } = await supabase.storage
            .from('avatars')
            .upload(path, profileFile, { cacheControl: '3600', upsert: true });
        if (upErr) throw upErr;

        const { data } = supabase.storage.from('avatars').getPublicUrl(path);
        return data.publicUrl || '';
    };

    const handleSignUp = async () => {
        if (!canSubmit || loading) return;
        setLoading(true);
        setErr('');

        try {
            const { data: signUpData, error: authError } = await supabase.auth.signUp({
                email: v.email,
                password: v.password,
            });
            if (authError) throw authError;

            const accessToken =
                signUpData.session?.access_token || (await supabase.auth.getSession()).data.session?.access_token;

            const animalsPayload = animalsForm.map((a) => ({
                name: a.name,
                age: Number(a.age || 0),
                type: a.type,
                variety: a.variety,
                color: a.color,
                personality: a.personality,
                level: Number(a.level || 5),
                comment: a.comment,
                img: a.img || '',
                owner: !!a.owner,
            }));

            const certsPayload = certs.map(({ file, preview, ...rest }) => ({ ...rest }));

            if (!accessToken) {
                try {
                    localStorage.setItem(
                        'pendingSignUp',
                        JSON.stringify({
                            name: v.name,
                            type: v.type,
                            avatar_url: v.avatar_url || '',
                            certificate_url: v.certificate_url ?? null,
                            animals: animalsPayload,
                            certs: certsPayload,
                            email: v.email,
                        }),
                    );
                } catch {}
                setJustSaved(true);
                return;
            }

            const res = await fetch('/api/sign-up', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    name: v.name,
                    type: v.type,
                    avatar_url: v.avatar_url,
                    certificate_url: v.certificate_url ?? null,
                    animals: animalsPayload,
                    certs: certsPayload,
                }),
            });

            if (!res.ok) {
                const { error } = await res.json().catch(() => ({ error: '서버 오류' }));
                throw new Error(error || '서버에 저장하는 중 문제가 발생했어요.');
            }

            setJustSaved(true);
            setTimeout(() => {
                setJustSaved(false);
                onClose();
            }, 900);
        } catch (e: any) {
            setErr(e?.message ?? '회원가입 중 오류가 발생했어요.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalIos
            isOpen={isOpen}
            handleModalState={onClose}
            title="회원가입"
            width="560px"
            height="970px"
            // leftComment={loading ? '처리 중…' : '가입하기'}
            // leftAction={handleSignUp}
        >
            <div className="p-3 space-y-4 overflow-scroll h-[850px] no-scrollbar">
                <div className="grid grid-cols-1 gap-3">
                    <label className="text-[13px] text-gray-600">이메일</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={v.email}
                        onChange={onChange}
                        className="px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-[#c8d9b5]"
                    />

                    <label className="text-[13px] text-gray-600 mt-2">비밀번호 (6자 이상)</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={v.password}
                        onChange={onChange}
                        className="w-full px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-[#c8d9b5]"
                    />

                    <div className="flex items-end gap-6">
                        <div className="flex flex-col w-1/2">
                            <label className="text-[13px] text-gray-600 mb-1">닉네임</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="최대 7자"
                                value={v.name}
                                onChange={onChange}
                                className="px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white shadow-inner 
                 focus:outline-none focus:ring-2 focus:ring-[#c8d9b5]"
                            />
                        </div>

                        <div className="flex flex-col  w-1/2">
                            <div className="flex items-end gap-3">
                                {profilePreview || v.avatar_url ? (
                                    <Tooltip
                                        comment={
                                            <div className="w-16 h-16 rounded-full overflow-hidden border border-[#e3ecdc] bg-white shadow-inner">
                                                <img
                                                    src={profilePreview || v.avatar_url}
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

                                <div className="flex flex-col gap-1">
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
                    </div>
                </div>

                <div className="space-y-2">
                    <span className="text-[13px] text-gray-600">당신은 어떤 역할인가요?</span>
                    <div className="grid grid-cols-3 gap-3">
                        {ROLES.map((r) => {
                            const active = v.type === r.value;
                            return (
                                <button
                                    key={r.value}
                                    type="button"
                                    onClick={() => selectRole(r.value)}
                                    className={[
                                        'relative rounded-2xl p-3 text-left transition border',
                                        active
                                            ? 'bg-[#f3f7ee] border-[#e3ecdc] shadow'
                                            : 'bg-[#f3f7ee23] border-[#e3ecdc] hover:bg-white',
                                    ].join(' ')}
                                >
                                    <div className="flex items-start gap-2">
                                        <span className="text-lg">{r.icon}</span>
                                        <div className="min-w-0">
                                            <div className="font-medium text-[14px]">{r.label}</div>
                                            <div className="text-[12px] text-gray-500 line-2">{r.comment}</div>
                                        </div>
                                    </div>
                                    {active && (
                                        <span className="absolute top-2 right-2 text-[11px] px-2 py-0.5 rounded-lg bg-white text-[#51683b] shadow">
                                            선택됨
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {!!v.type && (
                    <div className="rounded-2xl border border-[#e3ecdc] bg-white/80 p-3 shadow space-y-3">
                        <p className="text-[13px]">
                            <b className="text-[#51683b]">{ROLES.find((r) => r.value === v.type)?.label}</b>로 가입 시
                            필요한 정보를 입력해주세요.
                        </p>

                        {(isLove || isLovuddy) && (
                            <AnimalsForm value={animalsForm} onChange={setAnimalsForm} maxCount={5} className="mt-4" />
                        )}

                        {(isBuddy || isLovuddy) && (
                            <CertificatesForm
                                value={certs}
                                onChange={setCerts}
                                allowUpload
                                minCount={0}
                                className="mt-3"
                            />
                        )}
                    </div>
                )}
                {(isBuddy || isLovuddy) && (
                    <span className="text-[12px] text-gray-500 px-3 mb-2 inline-flex">
                        * 일부 정보는 나중에 추가 가능하지만, 버디 활동 시 자격증 정보가 없으면 등록이 제한돼요.
                    </span>
                )}

                {err && <p className="text-[12px] text-red-500">{err}</p>}
                {justSaved && <p className="text-[12px] text-emerald-700">회원가입이 완료됐어요! ✨</p>}

                <button
                    type="button"
                    onClick={handleSignUp}
                    disabled={!canSubmit || loading}
                    className={[
                        'w-full h-11 rounded-2xl transition',
                        canSubmit && !loading
                            ? 'custom-card custom-card-hover'
                            : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed',
                        justSaved ? 'ring-2 ring-[#c8d9b5]' : '',
                    ].join(' ')}
                >
                    {loading ? (
                        '처리 중…'
                    ) : v.type ? (
                        `${ROLES.find((r) => r.value === v.type)?.label}로 가입하기!`
                    ) : justSaved ? (
                        <p className="text-[12px] text-emerald-700">회원가입이 완료됐어요! ✨</p>
                    ) : (
                        '가입하기'
                    )}
                </button>

                <p className="text-[11px] text-gray-400 text-center">
                    가입 시 서비스 약관 및 개인정보 처리방침에 동의하게 됩니다.
                </p>
            </div>
        </ModalIos>
    );
}
