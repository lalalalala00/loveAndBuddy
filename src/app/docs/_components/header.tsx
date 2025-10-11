'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import DocsSearchLight from './doc.search.light';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUserState } from '@/context/useUserContext';
import { supabase } from '@/lib/supabaseClient';

const GUEST_EMAIL = process.env.NEXT_PUBLIC_GUEST_EMAIL as string;
const GUEST_PASSWORD = process.env.NEXT_PUBLIC_GUEST_PASSWORD as string;

export default function Header({
    setSidebarOpen,
    resume,
    setResume,
}: {
    setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    resume: boolean;
    setResume: Dispatch<SetStateAction<boolean>>;
}) {
    const router = useRouter();
    const { setUserState } = useUserState();
    const [searchOpen, setSearchOpen] = useState<boolean>(false);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const isMac = navigator.platform.toLowerCase().includes('mac');
            const isK = e.key.toLowerCase() === 'k';
            if ((isMac && e.metaKey && isK) || (!isMac && e.ctrlKey && isK)) {
                e.preventDefault();
                setSearchOpen(true);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    const continueAsGuest = async () => {
        try {
            setUserState('guest');

            const { error } = await supabase.auth.signInWithPassword({
                email: GUEST_EMAIL,
                password: GUEST_PASSWORD,
            });
            if (error) throw error;
            router.push('/');

            //   if (GUEST_ROUTE) {
            //     try { router.push(GUEST_ROUTE); } catch {}
            //   }
        } catch (e: any) {
            console.log(e?.message ?? '게스트 로그인 중 오류가 발생했어요.');
        } finally {
        }
    };

    return (
        <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-neutral-900/60 bg-[#f9fbf6] dark:bg-neutral-900/80 border-b border-[#c8d9b5]/70 dark:border-neutral-800">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-neutral-200 dark:border-neutral-800"
                        aria-label="Open sidebar"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path
                                d="M4 6h16M4 12h16M4 18h16"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                    <div
                        className="flex items-center gap-2"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl custom-card shadow-inner">
                            <img src="/buddy/buddy_back_none.png" className="w-8 h-8" alt="logo" />
                        </span>
                        <span className="font-semibold tracking-tight">soom — Docs</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2">
                        <a
                            onClick={continueAsGuest}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center h-10 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm"
                        >
                            서비스 체험하기
                        </a>
                        <a
                            href="https://github.com/lalalalala00"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center h-10 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm"
                        >
                            GitHub
                        </a>
                        <Link
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://www.notion.so/2851583f171480089ed0c43434f0529b?source=copy_link"
                            className="inline-flex items-center h-10 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm"
                        >
                            Resume
                        </Link>
                    </div>

                    <button
                        onClick={() => setSearchOpen(true)}
                        className="hidden md:flex items-center gap-2 h-10 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-left"
                        aria-label="Search docs"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path
                                d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-6-6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                        <span className="text-sm text-neutral-600 dark:text-neutral-300">검색 (⌘/Ctrl K)</span>
                    </button>
                    <DocsSearchLight open={searchOpen} onClose={() => setSearchOpen(false)} />
                </div>
            </div>
        </header>
    );
}
