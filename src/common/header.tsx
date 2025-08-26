'use client';

import { usePathname, useRouter } from 'next/navigation';
import { UserStateType, useUserState } from '../context/useUserContext';
import { useTypedRouter } from '@/hooks/userTypeRouter';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

import SignUpModal from '@/components/sign.up';
import LoginModal from '@/components/sign.login';
import { UsersRow } from '@/utils/type';
import SettingModal from '@/components/setting.modal';
import Tooltip from './tooltip';

const ROLE_META = {
    love: { label: 'love', emoji: '💚' },
    buddy: { label: 'buddy', emoji: '🐾' },
    lovuddy: { label: 'lovuddy', emoji: '🌿' },
} as const;

const Header = () => {
    const router = useRouter();
    const pathname = usePathname();

    const { userState, setUserState } = useUserState();
    const { push } = useTypedRouter();

    const [pendingType, setPendingType] = useState<UserStateType | null>(null);
    const [getUser, setGetUser] = useState<UsersRow | null>(null);
    const [signUpModal, setSignUpModal] = useState<boolean>(false);
    const [signModal, setSignModal] = useState<boolean>(false);

    const [settingModal, setSettingModal] = useState<boolean>(false);

    const currentUser = userType.find((u) => u.label === userState);

    const isActive = (url: string) => pathname.includes(url);

    const handleTabClick = (type: UserStateType) => {
        setUserState(type);
        setPendingType(type);
    };
    console.log(getUser, 'get');

    useEffect(() => {
        (async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user?.id) {
                setGetUser(null);
                return;
            }

            const { data, error } = await supabase
                .from('users')
                .select('id,email,name,type,avatar_url,certificate_url,created_at,updated_at')
                .eq('id', user.id)
                .maybeSingle();
            if (error) {
                console.error('users select error:', error);
                setGetUser(null);
                return;
            }
            setGetUser(data ?? null);

            setUserState(data.type);
        })();
    }, []);

    useEffect(() => {
        if (pendingType) {
            router.push(`/?type=${pendingType}`);
            setPendingType(null);
        }
    }, [userState]);

    const handleSignUp = () => {
        setSignModal(false);
        setSignUpModal(true);
    };

    return (
        <div>
            <div className="mt-5 mx-auto w-full flex items-center justify-between rounded-3xl bg-[#f9fbf6] px-6 py-3 border border-white/20 shadow-[4px_4px_10px_#f3f7ee,-4px_-4px_10px_#ffffff]">
                <div className="flex items-center">
                    <button
                        onClick={() => router.push('/')}
                        className="relative cursor-pointer w-16 h-12 rounded-full bg-white shadow-[4px_4px_10px_#ebf7dc,-4px_-4px_10px_#ffffff] hover:scale-105 transition group overflow-hidden"
                    >
                        <img
                            src="/logo/soom_gr.png"
                            alt="logo"
                            className="w-10 h-10 object-cover mx-auto my-auto opacity-0 group-hover:opacity-100 transition duration-300"
                        />

                        <span className="absolute inset-0 flex items-center justify-center text-[#9dbb80] font-bold text-[14px]  group-hover:opacity-0 transition duration-300">
                            soom
                        </span>
                    </button>

                    <div className="flex ml-10 space-x-6">
                        {typeMenu.map((item) => {
                            const isActiveMenu = isActive(item.url);
                            return (
                                <button
                                    key={item.url}
                                    onClick={() => router.push(item.url)}
                                    className={`relative px-3 py-2 text-[14px] font-semibold transition-all duration-200 cursor-pointer
          ${isActiveMenu ? 'text-[#7d9f68] scale-[1.02]' : 'text-[#aec399] hover:text-[#94b973]'}
          custom-card-hover-bg-white-only rounded-2xl
        `}
                                >
                                    {item.label}

                                    {isActiveMenu && (
                                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85%] h-[5px] bg-[#f1f9e9] rounded-full custom-card" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div
                    className={`rounded-full h-12 justify-center bg-white p-3 shadow-[4px_4px_10px_#ebf7dc,-4px_-4px_10px_#ffffff] flex items-center space-x-2 ${getUser === null ? 'w-16' : ''}`}
                >
                    {getUser === null ? (
                        <button onClick={() => setSignModal(!signModal)} className="">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4 stroke-black group-hover:stroke-amber-500 transition"
                                fill="none"
                                viewBox="0 0 20 20"
                                strokeWidth="1.5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2px"
                                    d="M18 9v6m3-3h-6m-4 6a4 4 0 10-8 0m8 0v1a1 1 0 001 1h6a1 1 0 001-1v-1a4 4 0 00-8 0zM10 9a4 4 0 11-8 0 4 4 0 018 0z"
                                />
                            </svg>
                        </button>
                    ) : (
                        <div className="flex">
                            <button className="rounded-xl px-3 py-2 text-sm shadow-[4px_8px_10px_#f3faea,-4px_-4px_10px_#ffffff]">
                                <span className="inline-flex items-center gap-1">{ROLE_META[getUser.type]?.emoji}</span>
                                <span className="text-[12px]">{getUser.type}</span>
                                <span className="text-[12px]">{getUser.name}</span>
                            </button>
                            <button onClick={() => setSettingModal(!settingModal)}>
                                <Tooltip tooltip="내 정보 수정하기" comment="⚙️" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <SignUpModal isOpen={signUpModal} onClose={() => setSignUpModal(!signUpModal)} />
            <LoginModal isOpen={signModal} onClose={() => setSignModal(!signModal)} onOpenSignUp={handleSignUp} />
            <SettingModal isOpen={settingModal} handleModalState={() => setSettingModal(!settingModal)} />
        </div>
    );
};

const typeMenu = [
    // { label: "home", url: "/" },
    { label: 'find.MyDearDay', url: '/find' },
    { label: 'dear.Love', url: '/dearLove' },
    { label: 'our.dailyMoments', url: '/dailyMoments' },
];

const userType: { label: UserStateType; type: number; menu: string }[] = [
    { label: 'love', type: 0, menu: 'find buddy' },
    { label: 'lovuddy', type: 2, menu: 'find love & buddy' },
    { label: 'buddy', type: 1, menu: 'find love' },
];

export default Header;
