'use client';

import { useState, useRef, useEffect } from 'react';

export function LocationCard({ value, onChange }: { value?: string; onChange: (next: string) => void }) {
    const [editing, setEditing] = useState(false);

    // 기본주소/상세주소 분리 상태
    const [base, setBase] = useState<string>('');
    const [detail, setDetail] = useState<string>('');

    const [openPostcode, setOpenPostcode] = useState(false);
    const inputBaseRef = useRef<HTMLInputElement>(null);
    const inputDetailRef = useRef<HTMLInputElement>(null);
    const postcodeRef = useRef<HTMLDivElement>(null);

    const [ready, setReady] = useState<boolean>(!!window.daum?.Postcode);

    // 최초 value를 base/detail로 분해(간단 분리: 첫 공백 기준)
    useEffect(() => {
        if (!editing) return;
        const v = (value ?? '').trim();
        if (!v) {
            setBase('');
            setDetail('');
            inputBaseRef.current?.focus();
            return;
        }
        // 간단 분리: 첫 괄호 전 또는 첫 콤마 전 등 규칙이 있으면 여기서 조정
        setBase(v);
        setDetail('');
        inputDetailRef.current?.focus();
    }, [editing, value]);

    // 카카오 스크립트 로드
    useEffect(() => {
        if (window.daum?.Postcode) {
            setReady(true);
            return;
        }
        const el = document.createElement('script');
        el.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        el.async = true;
        el.onload = () => setReady(true);
        el.onerror = () => setReady(false);
        document.body.appendChild(el);
    }, []);

    // 카카오 우편번호 임베드
    useEffect(() => {
        if (!openPostcode || !ready || !postcodeRef.current) return;
        if (!window.daum?.Postcode) return;

        const container = postcodeRef.current;
        container.innerHTML = '';

        // eslint-disable-next-line new-cap
        const postcode = new window.daum.Postcode({
            oncomplete: (data: any) => {
                const road = (data.roadAddress || '').trim();
                const jibun = (data.jibunAddress || '').trim();
                const bname = (data.buildingName || '').trim();

                let nextBase = road || jibun;
                if (bname && !nextBase.includes(bname)) nextBase += ` ${bname}`;

                setBase(nextBase.trim());
                setOpenPostcode(false);
                // 기본주소 입력 후 상세주소로 포커스
                setTimeout(() => inputDetailRef.current?.focus(), 0);
            },
            width: '100%',
            height: '100%',
            animation: true,
        });

        postcode.embed(container);
    }, [openPostcode, ready]);

    const confirm = () => {
        const combined = [base.trim(), detail.trim()].filter(Boolean).join(' ');
        onChange(combined);
        setEditing(false);
        setOpenPostcode(false);
    };

    const cancel = () => {
        // 원래 값 복원
        setBase(value ?? '');
        setDetail('');
        setEditing(false);
        setOpenPostcode(false);
    };

    const openEdit = () => {
        setEditing(true);
        // value 기반으로 분리 초기화는 위 useEffect(editing, value)에서 처리
    };

    return (
        <div
            className={[
                'rounded-2xl bg-white/70 border border-gray-100',
                'shadow-[8px_8px_20px_rgba(163,177,138,0.18),_-8px_-8px_20px_rgba(255,255,255,0.9)]',
                'p-3 group',
            ].join(' ')}
        >
            <div className="flex items-center gap-2 mb-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M4 7h16M6 7v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                </svg>
                <span className="text-[12px] text-gray-500">동네 - 장소</span>
            </div>

            {!editing && (
                <button
                    type="button"
                    onClick={openEdit}
                    className="w-full text-left text-[14px] text-gray-800 px-2 py-2 rounded-xl hover:bg-white/60 focus:outline-none  transition"
                    title="클릭해서 주소 입력"
                >
                    {value?.trim() ? value : <span className="text-gray-400">주소를 입력하세요</span>}
                </button>
            )}

            {editing && (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <input
                            ref={inputBaseRef}
                            type="text"
                            placeholder="예) 서울 마포구 양화로 12"
                            value={base}
                            onChange={(e) => setBase(e.target.value)}
                            className={[
                                'flex-1 px-3 py-2 rounded-xl text-[14px] outline-none',
                                'border border-gray-200',
                            ].join(' ')}
                        />
                        <button
                            type="button"
                            onClick={() => setOpenPostcode((v) => !v)}
                            disabled={!ready}
                            className="px-3 py-2 rounded-xl text-[13px] border border-[#9dbb80]  hover:bg-[#9dbb80] disabled:opacity-50 transition whitespace-nowrap"
                            title="카카오 주소 검색"
                        >
                            주소 검색
                        </button>
                    </div>

                    {openPostcode && (
                        <div
                            ref={postcodeRef}
                            className="w-full h-72 rounded-xl overflow-hidden border border-gray-200 bg-white"
                        />
                    )}

                    <div className="flex items-center gap-2">
                        <input
                            ref={inputDetailRef}
                            type="text"
                            placeholder="상세 주소 (동/호, 층, 가게명 등)"
                            value={detail}
                            onChange={(e) => setDetail(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') confirm();
                                if (e.key === 'Escape') cancel();
                            }}
                            className={[
                                'flex-1 px-3 py-2 rounded-xl text-[14px] outline-none',
                                'border border-gray-200',
                            ].join(' ')}
                        />
                    </div>

                    <div className="flex items-center gap-2 justify-end">
                        <button
                            type="button"
                            onClick={confirm}
                            disabled={!base.trim()}
                            className="px-5 py-2 rounded-xl text-[13px] font-semibold custom-card transition"
                        >
                            저장
                        </button>
                        <button
                            type="button"
                            onClick={cancel}
                            className="px-5 py-2 rounded-xl text-[13px] border border-gray-300 hover:bg-gray-50 transition"
                        >
                            취소
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
