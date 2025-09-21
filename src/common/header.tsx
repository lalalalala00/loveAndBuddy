'use client';

import { usePathname, useRouter } from 'next/navigation';
import { UserStateType, useUserState } from '../context/useUserContext';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

import SignUpModal from '@/components/sign.up';
import LoginModal from '@/components/sign.login';
import SettingModal from '@/components/setting.modal';
import Tooltip from './tooltip';
import { DearLove } from '@/utils/data';

const ROLE_META = {
    love: { label: 'love', emoji: '💚' },
    buddy: { label: 'buddy', emoji: '🐾' },
    lovuddy: { label: 'lovuddy', emoji: '🌿' },
} as const;

const Header = () => {
    const router = useRouter();
    const pathname = usePathname();

    const { setUserState, getUser, setGetUser, setAnimals, setCertificates, animals, setDearLoves } = useUserState();

    // const [getUser, setGetUser] = useState<UsersRow | null>(null);
    const [signUpModal, setSignUpModal] = useState<boolean>(false);
    const [signModal, setSignModal] = useState<boolean>(false);

    const [settingModal, setSettingModal] = useState<boolean>(false);

    const safeAvatarSrc = getUser?.avatar_url && getUser.avatar_url.trim().length > 0 ? getUser.avatar_url : null;

    const isActive = (url: string) => pathname.includes(url);

    async function fetchAllDearLove(userId: string, pageSize = 1000) {
        let from = 0;
        let all: DearLove[] = [];

        while (true) {
            const { data, error } = await supabase
                .from('dear_love')
                .select(
                    `
        id, author_id, author_type, buddy_user_id,
        date_at, title, weather, representative_img, photos,
        comment, location, place, tags, visibility,
        likes, bookmarks, comments_count,
        created_at, updated_at, with_animals
      `,
                )
                .eq('author_id', userId)
                .order('date_at', { ascending: false }) // 또는 .order('created_at', { ascending: false })
                .range(from, from + pageSize - 1);

            if (error) throw error;

            const chunk = data ?? [];
            all = all.concat(chunk);

            if (chunk.length < pageSize) break; // 마지막 페이지
            from += pageSize;
        }

        return all;
    }

    const loadUser = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user?.id) {
            setGetUser(null);
            setUserState(null as any);
            setCertificates([]);
            setAnimals([]);
            setDearLoves([]);
            return;
        }

        const [{ data: u }, { data: cs }, { data: as }] = await Promise.all([
            supabase.from('users').select('*').eq('id', user.id).maybeSingle(),
            supabase.from('certificates').select('*').eq('user_id', user.id).order('acquired_at', { ascending: false }),
            supabase.from('animals').select('*').eq('owner_uuid', user.id),
        ]);

        setGetUser(u ?? null);
        setCertificates(cs ?? []);
        setAnimals(as ?? []);
        if (u?.type) setUserState(u.type as UserStateType);

        try {
            const list = await fetchAllDearLove(user.id);
            setDearLoves(list);
        } catch (e) {
            console.error('[dear_love fetchAll]', e);
            setDearLoves([]);
        }
    };

    console.log(animals);
    useEffect(() => {
        loadUser();

        const { data: sub } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_OUT') {
                setGetUser(null);
                setUserState(null as any);
            } else {
                loadUser();
            }
        });

        return () => sub.subscription?.unsubscribe();
    }, []);

    const handleSignUp = () => {
        setSignModal(false);
        setSignUpModal(true);
    };

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
        } catch (e) {
            console.warn('signOut error:', e);
        } finally {
            setGetUser(null);
            setUserState(null as any);
            setSignModal(false);
            setSignUpModal(false);
            setSettingModal(false);
            router.push('/');
        }
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

                <div className={` ${getUser === null ? 'w-16' : ''}`}>
                    {!getUser ? (
                        <button
                            onClick={() => setSignModal(!signModal)}
                            className="rounded-full w-full h-12 justify-center bg-white p-3 shadow-[4px_4px_10px_#ebf7dc,-4px_-4px_10px_#ffffff] flex items-center space-x-2"
                        >
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
                        <div className="flex h-12 rounded-2xl bg-white p-3 shadow-[4px_4px_10px_#ebf7dc,-4px_-4px_10px_#ffffff] items-center">
                            <span className="inline-flex items-center gap-1  p-1 rounded-lg">
                                {ROLE_META[getUser?.type]?.emoji}{' '}
                                <span className="text-[13px] mr-2 font-semibold">{getUser.name}</span>
                            </span>

                            <div className="h-full flex">
                                <div
                                    className="w-8 flex items-center custom-card justify-center mr-1 rounded-l-xl rounded-r-sm"
                                    onClick={() => setSettingModal(!settingModal)}
                                >
                                    <Tooltip tooltip="내 정보 수정하기" comment="⚙️" clickCss="text-[13px]" />
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="px-3 py-2 text-[12px] font-semibold text-gray-600 rounded-r-xl rounded-l-sm custom-card flex items-center"
                                    aria-label="logout"
                                >
                                    logout
                                </button>
                            </div>
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
