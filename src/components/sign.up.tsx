'use client';

import { useMemo, useState } from 'react';
import ModalIos from '@/common/modal.ios';
import { supabase } from '@/lib/supabaseClient';
import { Animal } from '@/common/animal.card.vertical';

type Role = 'love' | 'buddy' | 'lovuddy';

type SignUpFormValues = {
    email: string;
    password: string;
    name: string;
    type: Role | null;

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

    const isBuddy = v.type === 'buddy';
    const isLove = v.type === 'love';
    const isLovuddy = v.type === 'lovuddy';

    const canSubmit = useMemo(() => {
        if (!v.email || !v.password || v.password.length < 6 || !v.name || !v.type) return false;
        if (!isLove && !isLovuddy) {
            return true;
        }
        if (!v.animal.name || !v.animal.age || !v.animal.type) return false;
        return true;
    }, [v, isLove, isLovuddy]);

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

    const toAnimalRecord = (userId: string, nickname: string): Animal => {
        const age = Number(v.animal.age || 0);
        const level = Math.min(10, Math.max(1, Number(v.animal.level || 5)));
        const uuid = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now());

        return {
            ownerNickname: nickname,
            ownerId: userId,
            animalId: uuid,
            name: v.animal.name,
            age,
            level,
            type: v.animal.type,
            variety: v.animal.variety || '',
            color: v.animal.color || '',
            comment: v.animal.comment || '',
            owner: true, // 최초 등록은 대표로
            img: v.animal.img || '',
            personality: v.animal.personality,
        };
    };

    const handleSignUp = async () => {
        if (!canSubmit || loading) return;
        setLoading(true);
        setErr('');

        try {
            const { data: signUpData, error: authError } = await supabase.auth.signUp({
                email: v.email,
                password: v.password,
                options: {
                    // emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (authError) throw authError;

            const userId = signUpData.user?.id;
            if (!userId) throw new Error('회원가입은 되었지만 사용자 ID를 찾을 수 없습니다.');

            // users 테이블
            const { error: uerr } = await supabase.from('users').insert([
                {
                    id: userId,
                    name: v.name,
                    type: v.type, // 'love' | 'buddy' | 'lovuddy'
                    certificate_url: v.certificate_url ?? null,
                },
            ]);
            if (uerr) throw uerr;

            // love/lovuddy → animals 테이블에 대표 동물 추가
            if (v.type === 'love' || v.type === 'lovuddy') {
                const animal = toAnimalRecord(userId, v.name);
                // 컬럼명이 DB에서 snake_case라면 아래처럼 매핑하세요.
                // const payload = {
                //   owner_nickname: animal.ownerNickname,
                //   owner_id: animal.ownerId,
                //   animal_id: animal.animalId,
                //   name: animal.name,
                //   age: animal.age,
                //   level: animal.level,
                //   type: animal.type,
                //   variety: animal.variety,
                //   color: animal.color,
                //   comment: animal.comment,
                //   owner: animal.owner,
                //   img: animal.img,
                //   personality: animal.personality,
                // };
                const payload = animal; // ⬅️ DB가 camelCase면 이대로 사용
                const { error: aerr } = await supabase.from('animals').insert([payload]);
                if (aerr) throw aerr;
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
            height="78%"
            leftComment={loading ? '처리 중…' : '가입하기'}
            leftAction={handleSignUp}
        >
            <div className="p-3 space-y-4">
                {/* 기본 정보 */}
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

                    <label className="text-[13px] text-gray-600 mt-2">닉네임</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="닉네임"
                        value={v.name}
                        onChange={onChange}
                        className="px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-[#c8d9b5]"
                    />
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
                            <div className="space-y-2">
                                <div className="grid grid-cols-3 gap-2">
                                    <input
                                        name="animal.name"
                                        placeholder="반려동물 이름"
                                        value={v.animal.name}
                                        onChange={onChange}
                                        className="px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white shadow-inner text-[14px]"
                                    />
                                    <select
                                        name="animal.type"
                                        value={v.animal.type}
                                        onChange={onChange}
                                        className="px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white text-[14px]"
                                    >
                                        <option value="dog">강아지</option>
                                        <option value="cat">고양이</option>
                                        <option value="others">기타</option>
                                    </select>
                                    <input
                                        type="number"
                                        min={0}
                                        name="animal.age"
                                        placeholder="나이"
                                        value={v.animal.age}
                                        onChange={onChange}
                                        className="px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white shadow-inner text-[14px]"
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    <input
                                        name="animal.variety"
                                        placeholder="품종 (예: 스피츠)"
                                        value={v.animal.variety}
                                        onChange={onChange}
                                        className="px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white text-[14px]"
                                    />
                                    <input
                                        name="animal.color"
                                        placeholder="색상 (예: white)"
                                        value={v.animal.color}
                                        onChange={onChange}
                                        className="px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white text-[14px]"
                                    />
                                    <select
                                        name="animal.personality"
                                        value={v.animal.personality}
                                        onChange={onChange}
                                        className="px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white text-[14px]"
                                    >
                                        <option value="extrovert">외향적</option>
                                        <option value="introvert">내향적</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    <div>
                                        <input
                                            type="number"
                                            min={1}
                                            max={10}
                                            name="animal.level"
                                            placeholder="활동 레벨 (1~10)"
                                            value={v.animal.level}
                                            onChange={onChange}
                                            className="px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white text-[14px]"
                                        />
                                        <span>/10</span>
                                    </div>

                                    <input
                                        name="animal.img"
                                        placeholder="이미지 URL (선택)"
                                        value={v.animal.img}
                                        onChange={onChange}
                                        className="col-span-2 px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white text-[14px]"
                                    />
                                </div>

                                <textarea
                                    name="animal.comment"
                                    placeholder="코멘트 (예: 흙냄새 풀냄새 좋아해요!)"
                                    value={v.animal.comment}
                                    onChange={onChange}
                                    className="w-full px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white text-[14px] focus:outline-none"
                                    rows={3}
                                />
                            </div>
                        )}

                        {/* buddy/lovuddy → 자격증 */}
                        {(isBuddy || isLovuddy) && (
                            <div className="flex flex-col gap-2">
                                <input
                                    type="text"
                                    name="certificate_url"
                                    placeholder="자격증 URL 또는 설명"
                                    value={v.certificate_url ?? ''}
                                    onChange={onChange}
                                    className="px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white shadow-inner text-[14px]"
                                />
                                <span className="text-[12px] text-gray-500">
                                    * 일부 정보는 나중에 추가 가능하지만, 버디 활동 시 자격증 정보가 없으면 등록이
                                    제한돼요.
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* 메시지/액션 */}
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
                    {loading
                        ? '처리 중…'
                        : v.type
                          ? `${ROLES.find((r) => r.value === v.type)?.label}로 가입하기!`
                          : '가입하기'}
                </button>

                <p className="text-[11px] text-gray-400 text-center">
                    가입 시 서비스 약관 및 개인정보 처리방침에 동의하게 됩니다.
                </p>
            </div>
        </ModalIos>
    );
}
