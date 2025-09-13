'use client';

import { useMemo, useState } from 'react';
import ModalIos from '@/common/modal.ios';
import { supabase } from '@/lib/supabaseClient';
import AnimalsForm from './sign.animals.form';
import CertificatesForm from './sign.certificateField.form';
import Tooltip from '@/common/tooltip';
import { EMPTY_ANIMAL, EMPTY_SIGNUP_FORM, Role, SignUpFormValues, Animal, Certificate } from '@/utils/sign';

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

    // 폼 하위 컴포넌트 상태
    const [animalsForm, setAnimalsForm] = useState<Animal[]>([EMPTY_ANIMAL]);
    const [certs, setCerts] = useState<Certificate[]>([]);

    // 프로필 이미지
    const [profilePreview, setProfilePreview] = useState<string>('');
    const [profileFile, setProfileFile] = useState<File | null>(null);

    const isBuddy = v.type === 'buddy';
    const isLove = v.type === 'love';
    const isLovuddy = v.type === 'lovuddy';

    // 제출 가능 여부
    const canSubmit = useMemo(() => {
        if (!v.email || !v.password || v.password.length < 6 || !v.name || !v.type) return false;

        if (isLove || isLovuddy) {
            const firstAnimal = animalsForm[0];
            if (!firstAnimal) return false;
            return !!firstAnimal.name && !!firstAnimal.birth_year && !!firstAnimal.type;
        }
        return true;
    }, [v.email, v.password, v.name, v.type, animalsForm, isLove, isLovuddy]);

    // 상위 인풋 onChange (animals는 별도 컴포넌트에서 상태 관리)
    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setV((prev) => ({ ...prev, [name]: value }) as any);
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

    // 스토리지 업로드 후 public URL 반환
    async function uploadAvatarAndGetUrl(userId: string): Promise<string | null> {
        if (!profileFile) return v.avatar_url || null; // 파일이 없으면 기존 URL 사용

        const ext = profileFile.name.split('.').pop()?.toLowerCase() || 'jpg';
        const path = `${userId}/avatar.${ext}`; // avatars 버킷에 userId 폴더

        // 동일 파일명 존재 시 덮어쓰기 위해 upsert 옵션 사용
        const { error: upErr } = await supabase.storage
            .from('avatars')
            .upload(path, profileFile, { upsert: true, contentType: profileFile.type });

        if (upErr) throw upErr;

        const { data } = supabase.storage.from('avatars').getPublicUrl(path);
        return data.publicUrl || null;
    }

    // ⛔ (지금 코드) async function signupViaRpc(avatarUrl: string | null) { ... }
    // ✅ (수정) 인자 제거
    async function signupViaRpc() {
        // 1) 회원가입
        const { data: authData, error: signErr } = await supabase.auth.signUp({
            email: v.email,
            password: v.password,
        });
        if (signErr) throw signErr;

        const userId = authData.user?.id;
        if (!userId) throw new Error('유저 ID를 얻지 못했습니다.');

        // 2) 아바타 업로드 (실패 시 throw 대신 null로 처리하고 싶으면 try/catch로 감싸세요)
        const finalAvatarUrl = await uploadAvatarAndGetUrl(userId);

        // 3) 동물
        const firstAnimal: Animal | undefined = isLove || isLovuddy ? animalsForm[0] : undefined;

        // 4) RPC 호출
        const { error: rpcErr } = await supabase.rpc('signup_with_profile', {
            p_email: v.email,
            p_name: v.name,
            p_type: v.type,
            p_avatar_url: finalAvatarUrl,
            p_user_birth_year: v.user_birth_year ? Number(v.user_birth_year) : null,
            p_user_comment: v.user_comment ?? null,
            p_animal: firstAnimal
                ? {
                      owner_nickname: firstAnimal.owner_nickname || v.name,
                      name: firstAnimal.name,
                      birth_year: Number(firstAnimal.birth_year), // number 변환 중요
                      type: firstAnimal.type,
                      variety: firstAnimal.variety ?? '',
                      color: firstAnimal.color ?? '',
                      personality: firstAnimal.personality ?? 'introvert',
                      level: firstAnimal.level ?? '0',
                      comment: firstAnimal.comment ?? '',
                      img: firstAnimal.img ?? '',
                      first: firstAnimal.first ?? true,
                  }
                : null,
            p_certificates:
                isBuddy || isLovuddy
                    ? (certs || []).map((c) => ({
                          name: c.name,
                          issuer: c.issuer,
                          acquired_at: c.acquired_at, // 'YYYY-MM-DD'
                          url: c.url ?? null,
                      }))
                    : [],
        });

        if (rpcErr) {
            console.error('RPC ERROR:', rpcErr.message, rpcErr.details, rpcErr.hint);
            throw rpcErr;
        }

        // ❌ 여기 있던 “두 번째 signUp” 블록은 완전히 삭제하세요.
        return true;
    }

    const handleSignUp = async () => {
        if (!v.email || !v.password || !v.name || !v.type) {
            setErr('필수 값을 입력해주세요.');
            return;
        }
        if ((isLove || isLovuddy) && (!animalsForm[0] || !animalsForm[0].name)) {
            setErr('반려동물 정보를 입력해주세요.');
            return;
        }

        try {
            setLoading(true);
            setErr('');
            setSuccess(false);
            // 1) 관리자 생성 (클라 signUp 금지)
            const r = await fetch('/api/dev-create-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: v.email, password: v.password }),
            });
            const j = await r.json();
            if (!r.ok || !j.ok) {
                setErr(j.error || '관리자 생성 실패');
                setLoading(false);
                return;
            }

            // 2) 클라 로그인(세션 확보)
            const { error: siErr } = await supabase.auth.signInWithPassword({
                email: v.email,
                password: v.password,
            });
            if (siErr) {
                setErr(siErr.message);
                setLoading(false);
                return;
            }

            // 3) (선택) 프로필 이미지 업로드: 실패해도 가입은 진행
            let avatarUrl: string | null = null;
            try {
                const user = (await supabase.auth.getUser()).data.user;
                if (user) {
                    avatarUrl = await uploadAvatarAndGetUrl(user.id);
                }
            } catch (e) {
                console.warn('Avatar upload skipped:', e);
            }
            const accessToken = (await supabase.auth.getSession()).data.session?.access_token;
            if (!accessToken) {
                setErr('세션 없음');
                setLoading(false);
                return;
            }

            const animalsPayload = animalsForm.map((a) => ({
                name: a.name,
                age: Number(a.age || 0), // 서버에서 birth_year로 변환
                type: a.type,
                variety: a.variety,
                color: a.color,
                personality: a.personality,
                level: Number(a.level || 5),
                comment: a.comment,
                img: a.img || '',
                owner: !!a.owner,
            }));

            const certsPayload = (certs || []).map(({ file, preview, ...rest }) => rest);

            const res = await fetch('/api/sign-up', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
                body: JSON.stringify({
                    name: v.name,
                    type: v.type,
                    avatar_url: v.avatar_url,
                    animals: animalsPayload,
                    certs: certsPayload,
                }),
            });
            const j2 = await res.json();
            if (!res.ok || !j2.ok) {
                setErr(j2.error || '서버 저장 실패');
                setLoading(false);
                return;
            }

            setSuccess(true);
            // 초기화
            setV(EMPTY_SIGNUP_FORM);
            setAnimalsForm([EMPTY_ANIMAL]);
            setCerts([]);
            setProfileFile(null);
            setProfilePreview('');
        } catch (e: any) {
            setErr(e?.message ?? '회원가입 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalIos isOpen={isOpen} handleModalState={onClose} title="회원가입" width="560px" height="970px">
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
                                className="px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-[#c8d9b5]"
                            />
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
