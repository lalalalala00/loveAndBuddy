'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './side.bar';
import DocHero from './doc.here';
import DocContent from './doc.content';
import Header from './header';
import ModalIos from '@/common/modal.ios';

import Resume from './resume';

export type Active = { groupId: string; itemId: string } | null;

function cx(...c: (string | false | null | undefined)[]) {
    return c.filter(Boolean).join(' ');
}

export function scrollToId(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 88;
    window.scrollTo({ top: y, behavior: 'smooth' });

    history.replaceState(null, '', `#${id}`);
}

export default function DocsPortfolio() {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [active, setActive] = useState<Active>(null);
    const headingIds = useMemo(() => SECTIONS.flatMap((g) => g.items.map((i) => `${g.id}__${i.id}`)), []);
    const [resume, setResume] = useState<boolean>(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
                if (visible) {
                    const id = visible.target.getAttribute('id');
                    if (id) {
                        const [groupId, itemId] = id.split('__');
                        setActive({ groupId, itemId });
                    }
                }
            },
            { rootMargin: '-100px 0px -70% 0px', threshold: [0, 1] },
        );

        headingIds.forEach((hid) => {
            const el = document.getElementById(hid);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [headingIds]);

    useEffect(() => {
        const onHash = () => setSidebarOpen(false);
        window.addEventListener('hashchange', onHash);
        return () => window.removeEventListener('hashchange', onHash);
    }, []);

    return (
        <div className="relative min-h-screen bg-[#f9fbfd] dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
            <Header setSidebarOpen={setSidebarOpen} resume={resume} setResume={setResume} />

            <div className=" mx-auto max-w-7xl  py-6 lg:py-10 grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-6">
                <aside className="hidden lg:block sticky top-20 self-start">
                    <Sidebar active={active} />
                </aside>

                <main className="min-w-0">
                    <DocHero />
                    <DocContent />
                </main>
            </div>
            <button
                className="fixed right-4 bottom-4 p-4 w-12 h-12 bg-white flex justify-center items-center cursor-pointer hover:border-gray-400 rounded-xl border border-gray-300"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
                ⬆
            </button>

            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                            className="absolute left-0 top-0 h-full w-72 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 p-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="font-semibold">목차</div>
                                <button
                                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-neutral-200 dark:border-neutral-700"
                                    onClick={() => setSidebarOpen(false)}
                                    aria-label="Close sidebar"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                                        <path
                                            d="M6 6l12 12M18 6L6 18"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <Sidebar active={active} onNavigate={() => setSidebarOpen(false)} />
                        </motion.aside>
                    </motion.div>
                )}
            </AnimatePresence>
            <ModalIos
                isOpen={resume}
                handleModalState={() => setResume(!resume)}
                title="자기소개서"
                width="700px"
                height="810px"
            >
                <Resume />
            </ModalIos>

            <Footer />
        </div>
    );
}

export const SECTIONS = [
    {
        id: 'introduction',
        title: 'Introduction',
        items: [
            { id: 'overview', title: '프로젝트 개요' },
            { id: 'problem', title: '기획 배경 & 문제 정의' },
            { id: 'solution', title: '솔루션 한눈에 보기' },
        ],
    },
    {
        id: 'concept',
        title: 'Concept',
        items: [
            { id: 'about', title: '숨이란' },
            { id: 'naming', title: '서비스 언어' },
            { id: 'birth-buddy', title: '버디의 탄생' },
            { id: 'character', title: '버디 캐릭터 스토리' },
            { id: 'site-concept', title: '사이트 컨셉' },
            { id: 'design-keywords', title: '디자인 키워드' },
        ],
    },
    {
        id: 'user-flow',
        title: 'User Flow',
        items: [
            { id: 'love-journey', title: 'Love 여정' },
            { id: 'buddy-journey', title: 'Buddy 여정' },
            { id: 'lovuddy', title: 'Lovuddy (통합)' },
        ],
    },
    {
        id: 'user-scenario',
        title: 'User Scenario',
        items: [{ id: 'persona', title: '유저 페르소나' }],
    },

    {
        id: 'wireframes',
        title: 'Wireframes',
        items: [
            { id: 'auth', title: '회원가입 & 프로필' },
            { id: 'index', title: '인덱스' },
            { id: 'find-buddy-love', title: 'find.myDearDay - love 시점' },
            { id: 'find-buddy-buddy', title: 'find.myDearDay - buddy 시점' },
            { id: 'dear-love', title: 'Dear Love 일기장' },
        ],
    },
    {
        id: 'architecture',
        title: 'Architecture',
        items: [
            { id: 'stack', title: 'Tech Stack' },
            { id: 'system', title: '서비스 아키텍처' },
            { id: 'type', title: 'Domain & Form Types' },
            { id: 'db-erd', title: 'DB 설계 (ERD)' },
        ],
    },
    {
        id: 'demo',
        title: 'Demo',
        items: [
            { id: 'live', title: '시연 (live)' },
            { id: 'case-study', title: '기획서 요약 (Case Study)' },
            { id: 'links', title: '배포 & 자료 링크' },
        ],
    },
    {
        id: 'biz',
        title: 'Business Model',
        items: [
            { id: 'revenue', title: '수익 구조' },
            { id: 'audience', title: '타깃 고객' },
            { id: 'growth', title: '유입/성장 전략' },
            { id: 'roadmap', title: '확장 계획' },
        ],
    },
    {
        id: 'closing',
        title: 'Closing',
        items: [
            { id: 'role', title: '본인 역할 & 기여' },
            { id: 'next', title: '향후 개선' },
        ],
    },
] as const;

function Footer() {
    return (
        <footer className="mt-8 border-t border-neutral-200 dark:border-neutral-800 py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-sm text-neutral-500 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                <div>© {new Date().getFullYear()} Love & Buddy</div>
                <div className="flex items-center gap-4">
                    <a className="hover:underline" href="#" aria-disabled>
                        GitHub
                    </a>
                    <a className="hover:underline" href="#" aria-disabled>
                        Notion
                    </a>
                    <a className="hover:underline" href="#" aria-disabled>
                        Vercel
                    </a>
                </div>
            </div>
        </footer>
    );
}

export const videoMap = [
    { label: '회원가입', url: 'https://www.youtube.com/embed/R81Pu8BLVAQ' },
    {
        label: '[find.myDearDay] 버디 찾기,조건 필터링, 시간, 스케줄 체크, 예약 보내기',
        url: 'https://www.youtube.com/embed/h4XL4g13ohY',
    },
    {
        label: '[find.myDearDay] 러브 찾기,조건 필터링, -> 버디가 러브에게 메세지 보내기 ',
        url: 'https://www.youtube.com/embed/-b_zqKcrwB8',
    },
    { label: '[find.myDearDay] 러브 로그인 후 메세지(버디) 확인', url: 'https://www.youtube.com/embed/yJ6c1F2VQys' },
    { label: '[dear.Love] - 캘린더, 러브 필터링, 디얼러브 등록', url: 'https://www.youtube.com/embed/HecFFv5vio0' },
];
