'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import ModalIos from '@/common/modal.ios';
import { supabase } from '@/lib/supabaseClient';
import SignUpModal from './sign.up';
import { useUserState } from '@/context/useUserContext';

const GUEST_ROUTE = process.env.NEXT_PUBLIC_GUEST_ROUTE || '/';

export default function LoginModal({
    isOpen,
    onClose,
    onOpenSignUp,
}: {
    isOpen: boolean;
    onClose: () => void;
    onOpenSignUp?: () => void;
}) {
    const { setUserState } = useUserState();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');
    const [justLogged, setJustLogged] = useState(false);

    const canSubmit = useMemo(() => !!email && !!pw && pw.length >= 6, [email, pw]);

    const finish = () => {
        setJustLogged(true);
        setTimeout(() => {
            setJustLogged(false);
            onClose();
        }, 800);
    };

    const handleLogin = async () => {
        if (!canSubmit || loading) return;
        setLoading(true);
        setErr('');
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
            if (error) throw error;
            finish();
        } catch (e: any) {
            setErr(e?.message ?? '로그인 중 오류가 발생했어요.');
        } finally {
            setLoading(false);
        }
    };

    const sendReset = async () => {
        if (!email) return setErr('비밀번호 재설정을 위해 이메일을 입력해 주세요.');
        setErr('');
        try {
            const redirectTo =
                typeof window !== 'undefined' ? `${window.location.origin}/auth/callback?type=recovery` : undefined;
            const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
            if (error) throw error;
            alert('재설정 메일을 보냈어요. 메일함을 확인해 주세요.');
        } catch (e: any) {
            setErr(e?.message ?? '재설정 메일 발송 중 오류가 발생했어요.');
        }
    };

    const continueAsGuest = () => {
        setUserState('guest');
        onClose();
        router.push(GUEST_ROUTE);
    };

    return (
        <ModalIos isOpen={isOpen} handleModalState={onClose} title="로그인" width="480px" height="65%">
            <div className="p-3 space-y-4">
                <div className="grid grid-cols-1 gap-3">
                    <label className="text-[13px] text-gray-600">이메일</label>
                    <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-emerald-300"
                    />

                    <label className="text-[13px] text-gray-600 mt-2">비밀번호</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={pw}
                        onChange={(e) => setPw(e.target.value)}
                        className="px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-emerald-300"
                    />

                    <div className="flex items-center justify-between text-[12px] mt-1">
                        <button type="button" onClick={sendReset} className="text-[#9dbb80] hover:underline">
                            비밀번호 재설정
                        </button>
                    </div>
                </div>

                {err && <p className="text-[12px] text-red-500">{err}</p>}
                {justLogged && <p className="text-[12px] text-[#9dbb80]">로그인 되었습니다. 환영해요! 🎉</p>}

                <button
                    type="button"
                    onClick={handleLogin}
                    disabled={!canSubmit || loading}
                    className={[
                        'w-full h-11 rounded-2xl transition',
                        canSubmit && !loading
                            ? 'custom-card custom-card-hover'
                            : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed',
                        justLogged ? 'ring-2 ring-emerald-300' : '',
                    ].join(' ')}
                >
                    {loading ? '처리 중…' : '로그인'}
                </button>

                <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-[#e3ecdc]" />
                    <span className="text-[12px] text-gray-500">또는</span>
                    <div className="flex-1 h-px bg-[#e3ecdc]" />
                </div>

                <div className="grid grid-cols-1 gap-2">
                    <button
                        type="button"
                        onClick={onOpenSignUp}
                        className="flex items-center justify-center gap-2 h-11 rounded-xl shadow hover:border hover:border-[#e3ecdc]  bg-[#e2e6d4] text-[14px] hover:bg-[#f8fbf4]"
                    >
                        회원가입
                    </button>
                    <button
                        type="button"
                        onClick={continueAsGuest}
                        className="flex items-center justify-center gap-2 h-11 rounded-xl shadow border border-[#e3ecdc] bg-white text-[14px] hover:bg-[#f8fbf4]"
                    >
                        게스트로 둘러보기
                    </button>
                </div>

                <p className="text-[11px] text-gray-400 text-center">게스트 모드에서는 일부 기능이 제한될 수 있어요.</p>
            </div>
        </ModalIos>
    );
}
