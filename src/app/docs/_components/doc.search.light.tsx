// components/DocsSearchLight.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { SECTIONS, scrollToId } from '.'; // 경로는 프로젝트 구조에 맞게

type Hit = {
    id: string;
    title: string;
    groupTitle: string;
    text: string;
    score: number;
    excerpt: string;
};

const MAX_INDEX_CHARS = 1800;
const EXCERPT_LEN = 140;

export default function DocsSearchLight({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [q, setQ] = useState<string>('');
    const [cursor, setCursor] = useState<number>(0);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 0);
        } else {
            setQ('');
            setCursor(0);
        }
    }, [open]);

    const index = useMemo<Hit[]>(() => {
        const hits: Hit[] = [];
        for (const g of SECTIONS) {
            for (const i of g.items) {
                const id = `${g.id}__${i.id}`;
                const el = typeof window !== 'undefined' ? document.getElementById(id) : null;
                const raw = (el?.innerText || '').replace(/\s+/g, ' ').trim().slice(0, MAX_INDEX_CHARS);
                const text = raw || '';
                hits.push({
                    id,
                    title: i.title,
                    groupTitle: g.title,
                    text,
                    score: 0,
                    excerpt: '',
                });
            }
        }
        return hits;
    }, [open]);

    const results = useMemo(() => {
        const query = q.trim().toLowerCase();
        if (!query) {
            // 기본은 목차 순 상위 8개 노출
            return index.slice(0, 8).map((h) => ({ ...h, score: 0, excerpt: makeExcerpt(h.text, '') }));
        }

        const tokens = query.split(/\s+/).filter(Boolean);
        const scored = index
            .map((h) => {
                const titleStr = `${h.title} ${h.groupTitle}`.toLowerCase();
                let score = 0;

                // 제목/그룹 타이틀
                for (const t of tokens) {
                    if (titleStr.includes(t)) score += 5;
                }

                // 본문 단순 등장 횟수
                const txt = h.text.toLowerCase();
                for (const t of tokens) {
                    const count = (txt.match(new RegExp(escapeRegExp(t), 'g')) || []).length;
                    score += Math.min(count, 5); // 섹션 하나 최대값
                }

                const excerpt = makeExcerpt(h.text, query);
                return { ...h, score, excerpt };
            })
            .filter((h) => h.score > 0 || h.excerpt) // 뭔가라도 맞은 것만
            .sort((a, b) => b.score - a.score)
            .slice(0, 20);

        return scored;
    }, [q, index]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (!open) return;
            if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setCursor((c) => Math.min(c + 1, Math.max(results.length - 1, 0)));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setCursor((c) => Math.max(c - 1, 0));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const hit = results[cursor];
                if (hit) {
                    onClose();
                    // 작은 딜레이로 스크롤
                    setTimeout(() => scrollToId(hit.id), 0);
                }
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, results, cursor, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100]">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="absolute left-1/2 top-24 -translate-x-1/2 w-[92vw] max-w-xl rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl">
                <div className="p-3 border-b border-neutral-200 dark:border-neutral-800">
                    <input
                        ref={inputRef}
                        value={q}
                        onChange={(e) => {
                            setQ(e.target.value);
                            setCursor(0);
                        }}
                        placeholder="검색어를 입력하세요… (↑/↓ 이동, Enter로 이동, Esc 닫기)"
                        className="w-full bg-transparent outline-none text-sm"
                        aria-label="문서 검색"
                    />
                </div>

                <ul className="max-h-80 overflow-auto py-1">
                    {results.length === 0 && (
                        <li className="px-3 py-2 text-sm text-neutral-500">검색 결과가 없습니다.</li>
                    )}
                    {results.map((h, i) => (
                        <li key={h.id}>
                            <button
                                onClick={() => {
                                    onClose();
                                    setTimeout(() => scrollToId(h.id), 0);
                                }}
                                className={`w-full text-left px-3 py-2 ${
                                    i === cursor
                                        ? 'bg-neutral-100 dark:bg-neutral-800'
                                        : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                }`}
                            >
                                <div className="text-sm font-medium">{h.title}</div>
                                {/* <div className="text-[12px] text-neutral-500 mb-1">
                                    {h.groupTitle} · <code className="text-[11px]">{h.id}</code>
                                </div> */}
                                {h.excerpt && (
                                    <div
                                        className="text-[12px] text-neutral-600 dark:text-neutral-300 line-clamp-2"
                                        dangerouslySetInnerHTML={{ __html: h.excerpt }}
                                    />
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

function makeExcerpt(text: string, query: string): string {
    if (!text) return '';
    const q = query.trim().toLowerCase();
    if (!q) return escapeHTML(text.slice(0, EXCERPT_LEN)) + (text.length > EXCERPT_LEN ? '…' : '');

    const idx = text.toLowerCase().indexOf(q);
    const start = Math.max(0, (idx >= 0 ? idx : 0) - Math.floor(EXCERPT_LEN / 2));
    const raw = text.slice(start, start + EXCERPT_LEN);
    return highlight(raw, q) + (text.length > start + EXCERPT_LEN ? '…' : '');
}

function highlight(src: string, q: string): string {
    if (!q) return escapeHTML(src);

    const parts = q.split(/\s+/).filter(Boolean).map(escapeRegExp);
    try {
        const re = new RegExp(`(${parts.join('|')})`, 'ig');
        return escapeHTML(src).replace(re, '<mark>$1</mark>');
    } catch {
        return escapeHTML(src);
    }
}

function escapeRegExp(s: string) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function escapeHTML(s: string) {
    return s.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]!);
}
