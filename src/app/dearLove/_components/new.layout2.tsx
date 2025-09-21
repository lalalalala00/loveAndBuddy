'use client';

import { useMemo, useState } from 'react';
import { cover, imgs, months } from './filepage';
import FileNameBox from './file.name.box';
import DiaryMessage from './diary.message';

export default function NewLayout2() {
    const [year, setYear] = useState(2025);
    const [activeMonth, setActiveMonth] = useState(0);
    const [openMonthPicker, setOpenMonthPicker] = useState(false);

    const selectedMonth = months[activeMonth] ?? 'month';

    // 실제에선 month/연도에 따라 필터
    const gallery = useMemo(() => imgs, []);

    return (
        <div className="min-h-screen w-full bg-[#f6f9f3] text-gray-800">
            {/* HEADER (간결) */}
            <header className="px-5 py-5 text-center border-b border-[#e3ecdc] bg-[#f3f7ee]">
                <h1 className="text-[16px] md:text-[18px] font-semibold text-[#455b3f]">dear love • chanelu</h1>
            </header>

            {/* 1) MONTH BAR (드롭다운 피커) */}
            <section className="mx-auto max-w-[1100px] px-3">
                <div className="flex flex-wrap items-center justify-center gap-3 py-4">
                    <button
                        onClick={() => setOpenMonthPicker(true)}
                        className="px-4 py-2 rounded-xl border border-[#e3ecdc] bg-white/90 hover:bg-white shadow-sm"
                        aria-haspopup="dialog"
                        aria-expanded={openMonthPicker}
                    >
                        {selectedMonth} · {year}
                    </button>

                    {/* 연도 간단 변경 (옵션) */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setYear((y) => y - 1)}
                            className="px-2 py-1 rounded-lg border border-[#e3ecdc] bg-white/90 hover:bg-white"
                            aria-label="이전 연도"
                        >
                            ‹
                        </button>
                        <span className="text-[14px] font-medium text-[#5b7551]">{year}</span>
                        <button
                            onClick={() => setYear((y) => y + 1)}
                            className="px-2 py-1 rounded-lg border border-[#e3ecdc] bg-white/90 hover:bg-white"
                            aria-label="다음 연도"
                        >
                            ›
                        </button>
                    </div>
                </div>

                {/* Month Picker (모달 시트) */}
                {openMonthPicker && (
                    <div
                        role="dialog"
                        aria-modal="true"
                        className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center"
                    >
                        <div className="absolute inset-0 bg-black/20" onClick={() => setOpenMonthPicker(false)} />
                        <div className="relative w-full md:w-[520px] rounded-t-2xl md:rounded-2xl bg-white shadow-xl border border-[#e3ecdc] p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-[15px] font-semibold text-[#5b7551]">월 선택</h3>
                                <button
                                    onClick={() => setOpenMonthPicker(false)}
                                    className="px-2 py-1 rounded-lg border border-[#e3ecdc] bg-[#f8fbf4] hover:bg-white"
                                >
                                    닫기
                                </button>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {months.map((m, i) => {
                                    const active = i === activeMonth;
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                setActiveMonth(i);
                                                setOpenMonthPicker(false);
                                            }}
                                            className={[
                                                'px-3 py-2 rounded-xl border text-sm transition',
                                                active
                                                    ? 'bg-[#f3f7ee] text-[#5b7551] border-[#afcb94] font-semibold'
                                                    : 'bg-white text-gray-800 border-[#e3ecdc] hover:bg-[#f8fbf4]',
                                            ].join(' ')}
                                        >
                                            {m}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* 2) FEATURED COVERS (가로 레일 제거 → 그리드) */}
            <section className="mx-auto max-w-[1100px] px-3 mt-3">
                <div className="flex items-end justify-between mb-2">
                    <h2 className="text-[15px] font-semibold text-[#5b7551]">featured covers</h2>
                    {/* buddy info 박스를 오른쪽에 간단히 합침 */}
                    <div className="hidden md:block px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white/90 text-[13px] shadow-sm">
                        <span className="font-medium text-[#5b7551]">buddy info</span>
                        <span className="ml-2 text-gray-600">자격/한줄소개/태그</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {cover.slice(0, 8).map((c, idx) => (
                        <div key={idx} className="relative group">
                            <img
                                src={c.url}
                                alt="cover"
                                className="w-full h-[140px] rounded-xl object-cover border border-[#dfe9d7] shadow-[2px_4px_10px_#eaf3e2,-2px_-2px_8px_#ffffff] transition group-hover:-translate-y-0.5"
                                loading="lazy"
                                decoding="async"
                            />
                            <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition" />
                            <div className="absolute bottom-2 right-3 text-right text-white drop-shadow">
                                <div className="text-[12px] font-semibold">Buddy_ᬏ᭄꙳⸌ 체리쉬</div>
                                <div className="text-[12px] font-semibold">july 14, 2025</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 모바일용 buddy info 박스 (아래로) */}
                <div className="md:hidden mt-3 px-3 py-2 rounded-xl border border-[#e3ecdc] bg-white/90 text-[13px] shadow-sm">
                    <span className="font-medium text-[#5b7551]">buddy info</span>
                    <span className="ml-2 text-gray-600">자격/한줄소개/태그</span>
                </div>
            </section>

            {/* 구분선 */}
            <div className="mx-auto max-w-[1100px] px-3 my-6">
                <div className="border-t-2 border-[#e7efe1]" />
            </div>

            {/* 3) GALLERY (매슨리) */}
            <main className="mx-auto max-w-[1100px] px-3">
                <div className="columns-2 md:columns-3 gap-4 [column-fill:_balance]">
                    {gallery.map((item, i) => (
                        <div key={i} className="mb-4 break-inside-avoid">
                            {/* 특수 카드 */}
                            {i === 0 && (
                                <div className="mb-4">
                                    <FileNameBox bgImg="/cha/bg.png" textColor="" />
                                </div>
                            )}
                            {i === 5 && (
                                <div className="mb-4">
                                    <DiaryMessage
                                        text={`Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero id obcaecati, fuga ex, nulla eligendi tempore ad tempora, cumque omnis minima laudantium.`}
                                    />
                                </div>
                            )}

                            {/* 이미지 카드 */}
                            <article className="group rounded-2xl border border-[#dfe9d7] bg-white/95 shadow-sm overflow-hidden transition hover:shadow-md hover:-translate-y-0.5">
                                <img
                                    src={item.url}
                                    alt=""
                                    loading="lazy"
                                    decoding="async"
                                    className={`block w-full object-cover ${
                                        item.comment ? 'rounded-t-2xl' : 'rounded-2xl'
                                    }`}
                                />
                                {item.comment && (
                                    <div className="p-4">
                                        <p className="text-[14px] md:text-[15px] leading-7 text-gray-800">
                                            {item.comment}
                                        </p>
                                    </div>
                                )}
                            </article>
                        </div>
                    ))}
                </div>
            </main>

            <div className="h-10" />
        </div>
    );
}
