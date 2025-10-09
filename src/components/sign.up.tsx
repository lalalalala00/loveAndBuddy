'use client';

import { useMemo, useState } from 'react';
import ModalIos from '@/common/modal.ios';
import { supabase } from '@/lib/supabaseClient';
import AnimalsForm from './sign.animals.form';
import CertificatesForm, { CertificateFormItem } from './sign.certificateField.form';
import Tooltip from '@/common/tooltip';
import { EMPTY_ANIMAL, EMPTY_SIGNUP_FORM, Role, SignUpFormValues, Animal } from '@/utils/sign';

const ROLES: Array<{ label: string; value: Role; comment: string; icon: string }> = [
    { label: '러브', value: 'love', icon: '💚', comment: '믿을 수 있는 펫시터를 찾고 있어요!' },
    { label: '버디', value: 'buddy', icon: '🐾', comment: '반려동물을 사랑으로 돌봐줄 준비가 되었어요!' },
    { label: '러버디', value: 'lovuddy', icon: '🌿', comment: '펫시터도 찾고, 다른 반려인도 도와주고 싶어요!' },
];

export default function SignUpModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [v, setV] = useState<SignUpFormValues>(EMPTY_SIGNUP_FORM);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');
    const [success, setSuccess] = useState<boolean>(false);

    const [animalsForm, setAnimalsForm] = useState<Animal[]>([EMPTY_ANIMAL]);
    const [certs, setCerts] = useState<CertificateFormItem[]>([]);

    const [profilePreview, setProfilePreview] = useState<string>('');
    const [profileFile, setProfileFile] = useState<File | null>(null);

    const [animalFiles, setAnimalFiles] = useState<Record<string, File>>({});

    const isBuddy = v.type === 'buddy';
    const isLove = v.type === 'love';
    const isLovuddy = v.type === 'lovuddy';

    const canSubmit = useMemo(() => {
        if (!v.email || !v.password || v.password.length < 6 || !v.name || !v.type) return false;

        if (isLove || isLovuddy) {
            const firstAnimal = animalsForm[0];
            if (!firstAnimal) return false;
            return !!firstAnimal.name && !!firstAnimal.birth_year && !!firstAnimal.animal_type;
        }

        return true;
    }, [v.email, v.password, v.name, v.type, animalsForm, isLove, isLovuddy]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'name') {
            setV((prev) => ({ ...prev, [name]: value.slice(0, 7) }) as any);
        } else {
            setV((prev) => ({ ...prev, [name]: value }) as any);
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
        setV((prev) => ({ ...prev, avatar_url: '' }));
    };

    const handleSignUp = async () => {
        if (!v.email || !v.password || !v.name || !v.type) {
            setErr('필수 값을 입력해주세요.');
            return;
        }
        if ((isLove || isLovuddy) && !animalsForm?.[0]?.name) {
            setErr('반려동물 정보를 입력해주세요.');
            return;
        }

        try {
            setLoading(true);
            setErr('');
            setSuccess(false);

            const r = await fetch('/api/dev-create-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: v.email, password: v.password }),
            });
            const j = await r.json().catch(() => ({}));
            if (!r.ok || !j.ok) throw new Error(j.error || '관리자 생성 실패');

            const { error: siErr } = await supabase.auth.signInWithPassword({
                email: v.email,
                password: v.password,
            });
            if (siErr) throw siErr;

            const { data: userData } = await supabase.auth.getUser();
            if (!userData?.user) throw new Error('세션 없음(로그인 실패)');
            const userId = userData.user.id;

            let avatarUrl: string | null = v.avatar_url || null;
            if (profileFile) {
                const ext = profileFile.name.split('.').pop()?.toLowerCase() || 'jpg';
                const avatarPath = `${userId}/avatar.${ext}`;
                const { error: upErr } = await supabase.storage
                    .from('avatars')
                    .upload(avatarPath, profileFile, { upsert: true, contentType: profileFile.type });
                if (upErr) throw upErr;
                const { data } = supabase.storage.from('avatars').getPublicUrl(avatarPath);
                avatarUrl = data.publicUrl || null;
            }

            const animalsWithUrls = await Promise.all(
                (animalsForm ?? []).map(async (a, idx) => {
                    const key = a?.animal_uuid || `idx-${idx}`;
                    const f = animalFiles[key];
                    if (!f) return a;

                    const ext = f.name.split('.').pop()?.toLowerCase() || 'jpg';
                    const path = `${userId}/animals/${key}-${Date.now()}.${ext}`;
                    const { error } = await supabase.storage
                        .from('avatars')
                        .upload(path, f, { upsert: true, contentType: f.type });
                    if (error) throw error;
                    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
                    return { ...a, img: data.publicUrl || a.img };
                }),
            );

            const animalsPayload = (animalsWithUrls ?? []).map((a: any, idx: number) => ({
                name: a.name?.trim() ?? '',
                birth_year: a.birth_year ? Number(a.birth_year) : null,
                variety: a.variety ?? '',
                color: a.color ?? '',
                personality: a.personality ?? 'introvert',
                level: String(a.level ?? '0'),
                comment: a.comment ?? '',
                img: a.img ?? '',
                first: typeof a.first === 'boolean' ? a.first : idx === 0,
                owner_nickname: v.name,
                owner_uuid: v.uuid,
            }));

            const certsPayload = (certs ?? []).map(({ file, preview, ...rest }: any) => ({
                ...rest,
                name: (rest.name ?? '').trim(),
                issuer: (rest.issuer ?? '').trim(),
                acquired_at: rest.acquired_at || null,
                url: rest.url ?? null,
            }));

            const { data: sess } = await supabase.auth.getSession();
            const accessToken = sess.session?.access_token;
            if (!accessToken) throw new Error('세션 토큰 없음');

            const res = await fetch('/api/sign-up', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    name: v.name,
                    type: v.type,
                    avatar_url: avatarUrl ?? '',
                    birth_year: v.birth_year ? Number(v.birth_year) : null,
                    user_comment: v.user_comment ?? '',
                    email: v.email,
                    animals: animalsPayload,
                    certs: certsPayload,
                }),
            });

            const j2 = await res.json().catch(() => ({}));
            if (!res.ok || !j2.ok) throw new Error(j2.error || '서버 저장 실패');

            setSuccess(true);

            setV(EMPTY_SIGNUP_FORM);
            setAnimalsForm([EMPTY_ANIMAL]);
            setCerts([]);
            setProfileFile(null);
            setProfilePreview('');
            setAnimalFiles({});

            setTimeout(onClose, 900);
        } catch (e: any) {
            setErr(e?.message ?? '회원가입 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalIos isOpen={isOpen} handleModalState={onClose} title="회원가입" width="540px" height="720px">
            <div className="p-3 space-y-4 overflow-y-scroll h-[600px] no-scrollbar">
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
                            <div className="flex items-end">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="최대 7자"
                                    value={v.name}
                                    onChange={onChange}
                                    className="px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-[#c8d9b5]"
                                />
                                <span className="text-[11px] text-gray-500 tabular-nums ml-2">
                                    {v.name?.length ?? 0}/7
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col w-1/2">
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
                                ) : null}

                                <div className="flex flex-col gap-1">
                                    <label className="px-3 py-2 rounded-xl border-2 border-dashed border-gray-200 h-full bg-white shadow cursor-pointer text-[13px]">
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
                    <div className="flex">
                        <div className="flex flex-col w-3/4">
                            <label className="text-[13px] text-gray-600 mb-1">코멘트</label>
                            <input
                                type="text"
                                name="user_comment"
                                placeholder="ex) 친절한 버디를 찾고 있어요!, 사랑으로 보살필께요!"
                                value={v.user_comment}
                                onChange={onChange}
                                className="px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-[#c8d9b5]"
                            />
                        </div>
                        <div className="flex flex-col w-1/4 ml-2">
                            <label className="text-[13px] text-gray-600 mb-1">출생년도</label>
                            <input
                                type="number"
                                name="birth_year"
                                placeholder="1992"
                                value={v.birth_year}
                                onChange={onChange}
                                className="px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-[#c8d9b5]"
                            />
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
                            <AnimalsForm
                                value={animalsForm}
                                onChange={setAnimalsForm}
                                onLocalFileChange={(idx, file) => {
                                    const key =
                                        animalsForm[idx]?.animal_uuid || animalsForm[idx]?.animal_uuid || `idx-${idx}`;
                                    setAnimalFiles((prev) => {
                                        const next = { ...prev };
                                        if (file) next[key] = file;
                                        else delete next[key];
                                        return next;
                                    });
                                }}
                            />
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
                {success && <p className="text-[12px] text-emerald-700">회원가입이 완료됐어요! ✨</p>}

                <button
                    type="button"
                    onClick={handleSignUp}
                    disabled={!canSubmit || loading}
                    className={[
                        'w-full h-11 rounded-2xl transition',
                        canSubmit && !loading
                            ? 'custom-card custom-card-hover'
                            : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed',
                        success ? 'ring-2 ring-[#c8d9b5]' : '',
                    ].join(' ')}
                >
                    {loading ? (
                        '처리 중…'
                    ) : v.type ? (
                        `${ROLES.find((r) => r.value === v.type)?.label}로 가입하기!`
                    ) : success ? (
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
