/* eslint-disable @next/next/no-img-element */
// 'use client';

// import { cover, imgs, months } from './filepage';
// import FileNameBox from './file.name.box';
// import DiaryMessage from './diary.message';

// export default function NewType() {
//     return (
//         <div className="w-full h-full">
//             <div className="text-center px-6 py-4 bg-[#f3f7ee] rounded-t-2xl border-b border-gray-200 text-[15px] font-semibold text-gray-700">
//                 -`♥´- dear.Love_〘 chanelu 〙 -`♥´-
//             </div>
//             <div className="flex h-full">
//                 <div className="min-w-[220px] h-[100vh] p-3 bg-[#f3f7ee]">
//                     <div className="w-full h-[100px] border border-gray-200 rounded-xl mb-2 bg-white p-2">
//                         <span>buddy info</span>
//                     </div>
//                     <button className="font-bold mb-3 text-[16px] h-[40px] cursor-pointer w-full flex justify-center items-center custom-card-hover-bg-white">
//                         2025
//                     </button>
//                     <div className="flex flex-col gap-1 overflow-y-auto no-scrollbar w-full">
//                         {months.map((month, i) => (
//                             <button
//                                 key={i}
//                                 className={`text-sm lowercase tracking-tight rounded-md px-2 py-1 w-full text-left hover:bg-[#e3ecdc] hover:border hover:border-white/20  hover:shadow-[inset_4px_8px_10px_#f3f7ee,-4px_-4px_10px_#ffffff]`}
//                             >
//                                 {month}_[3].zip
//                             </button>
//                         ))}
//                     </div>
//                 </div>
//                 <div className="w-full mx-1">
//                     <div className="flex w-full justify-between mb-2 itmes-center p-3">
//                         <button
//                             className="px-3 py-1 rounded-lg hover:bg-[#f8fbf4] border border-[#e3ecdc]"
//                             aria-label="이전 달"
//                         >
//                             ‹
//                         </button>
//                         <div className="mt-2 mb-4">
//                             <h4 className="text-[24px] font-bold lowercase text-[#5b7551]">˚₊· selectedMonth —̳͟͞͞♡ ˚₊·</h4>
//                         </div>
//                         <button
//                             className="px-3 py-1 rounded-lg hover:bg-[#f8fbf4] border border-[#e3ecdc]"
//                             aria-label="다음 달"
//                         >
//                             ›
//                         </button>
//                     </div>

//                     <div className="columns-2 sm:columns-3 gap-2 [column-fill:_balance]">
//                         {imgs.map((item, i) => (
//                             <div key={i} className="mb-2 break-inside-avoid">
//                                 {i === 0 && (
//                                     <div className="mb-2">
//                                         <FileNameBox bgImg="/cha/bg.png" textColor="" />
//                                     </div>
//                                 )}
//                                 {i === 5 && (
//                                     <DiaryMessage
//                                         text={
//                                             `Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero id obcaecati, fuga ex, nulla eligendi tempore ad tempora, cumque omnis minima laudantium. Excepturi consequuntur omnis doloremque quis nam sint enim. Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero id obcaecati, fuga ex, nulla eligendi tempore ad tempora, cumque omnis minima laudantium. Excepturi consequuntur omnis doloremque quis nam sint enim.` ??
//                                             ''
//                                         }
//                                     />
//                                 )}
//                                 <div className="border border-gray-200 rounded-b-xl w-full">
//                                     <img
//                                         src={item.url}
//                                         alt="img"
//                                         loading="lazy"
//                                         decoding="async"
//                                         className={`w-full  object-cover ${item.comment ? 'rounded-t-xl' : 'rounded-xl'}`}
//                                     />
//                                     {item.comment && (
//                                         <div className="p-2 leading-3">
//                                             <span className="text-[13px] text-wrap ">{item.comment}</span>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//                 <div className="min-w-[220px] w-[220px] px-3 py-5 bg-[#f3f7ee]">
//                     {cover.map((item, i) => (
//                         <div key={i} className="relative ">
//                             <div className="absolute bottom-2 right-3 flex flex-col items-end z-1">
//                                 <span className="text-[12px] font-semibold">Buddy_ᬏ᭄꙳⸌ 체리쉬 ⛧*̩̩͙⸝⋆</span>
//                                 <span className="text-[12px] font-semibold">july 14, 2025</span>
//                             </div>
//                             <div className="bg-white/40 absolute top-0 left-0 w-full h-full rounded-xl -z-0" />
//                             <img
//                                 src={item.url}
//                                 alt="img"
//                                 className="w-full h-[140px] mb-2 rounded-xl bg-white object-cover border-2 border-gray-300"
//                             />
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }

'use client';

import { useMemo, useState } from 'react';
import { cover, imgs, months } from './filepage';
import FileNameBox from './file.name.box';
import DiaryMessage from './diary.message';

export default function NewType() {
    const [year] = useState(2025);
    const [activeMonth, setActiveMonth] = useState(0);
    const selectedMonth = months[activeMonth] ?? 'month';

    const prevMonth = () => setActiveMonth((i) => (i - 1 + months.length) % months.length);
    const nextMonth = () => setActiveMonth((i) => (i + 1) % months.length);

    const gallery = useMemo(() => imgs, []);

    return (
        <div className="min-h-screen w-full text-gray-800">
            <div className="text-center px-6 py-4 bg-[#f3f7ee] rounded-t-2xl border-b border-[#e3ecdc] text-[15px] font-semibold text-[#5b7551] tracking-tight">
                -`♥´- dear.love_〘 chanelu 〙 -`♥´-
            </div>

            <div className="mx-auto  px-1 py-3 grid grid-cols-[220px_minmax(0,1fr)_220px] gap-3">
                <aside className="sticky top-0 h-[calc(100vh-24px)] rounded-2xl bg-[#f3f7ee] p-3 border border-[#e3ecdc]">
                    <div className="w-full h-[110px] rounded-xl mb-3 bg-white/80 p-3 border border-[#e3ecdc] shadow-[4px_8px_12px_#eef6e6,-4px_-4px_10px_#ffffff]">
                        <span className="block text-[13px] font-semibold text-[#5b7551]">buddy info</span>
                        <p className="mt-2 text-[12px] text-gray-600 leading-relaxed">
                            버디 프로필, 인증 뱃지, 한 줄 소개 등 요약 박스.
                        </p>
                    </div>

                    <button
                        className="w-full h-[42px] mb-3 rounded-xl border border-[#e3ecdc] bg-white/80 font-bold text-[15px] text-[#5b7551] hover:bg-white transition"
                        aria-label={`${year}`}
                    >
                        {year}
                    </button>

                    <div className="flex flex-col gap-1 overflow-y-auto no-scrollbar w-full h-[calc(100%-170px)] pr-1">
                        {months.map((m, i) => {
                            const active = i === activeMonth;
                            return (
                                <button
                                    key={i}
                                    onClick={() => setActiveMonth(i)}
                                    className={[
                                        'text-sm lowercase tracking-tight rounded-lg px-3 py-2 text-left transition',
                                        'border hover:shadow-[inset_4px_8px_10px_#f3f7ee,-4px_-4px_10px_#ffffff]',
                                        active
                                            ? 'bg-white text-[#5b7551] border-[#afcb94] font-semibold'
                                            : 'bg-[#f7fbf3] text-gray-700 border-[#e3ecdc] hover:bg-[#eef6e6]',
                                    ].join(' ')}
                                >
                                    {m}_[3].zip
                                </button>
                            );
                        })}
                    </div>
                </aside>

                <main className="min-w-0">
                    <div className="sticky -top-1 z-10 bg-gradient-to-b from-[#f6f9f3] to-transparent pt-2 pb-1">
                        <div className="flex w-full items-center justify-between p-2">
                            <button
                                onClick={prevMonth}
                                className="px-3 py-1.5 rounded-lg hover:bg-[#f8fbf4] border border-[#e3ecdc] text-[15px]"
                                aria-label="이전 달"
                            >
                                ‹
                            </button>
                            <div className="py-1">
                                <h4 className="text-[22px] md:text-[24px] font-bold lowercase text-[#5b7551]">
                                    ˚₊· {selectedMonth} —̳͟͞͞♡ ˚₊·
                                </h4>
                            </div>
                            <button
                                onClick={nextMonth}
                                className="px-3 py-1.5 rounded-lg hover:bg-[#f8fbf4] border border-[#e3ecdc] text-[15px]"
                                aria-label="다음 달"
                            >
                                ›
                            </button>
                        </div>
                    </div>

                    <div className="columns-2 md:columns-3 gap-2 mt-8 [column-fill:_balance]">
                        {gallery.map((item, i) => (
                            <div key={i} className="mb-2 break-inside-avoid">
                                {i === 0 && (
                                    <div className="mb-2">
                                        <FileNameBox bgImg="/cha/bg.png" textColor="" />
                                    </div>
                                )}
                                {i === 5 && (
                                    <div className="mb-3">
                                        <DiaryMessage
                                            text={`Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero id obcaecati, fuga ex, nulla eligendi tempore ad tempora, cumque omnis minima laudantium. Excepturi consequuntur omnis doloremque quis nam sint enim. Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero id obcaecati, fuga ex, nulla eligendi tempore ad tempora, cumque omnis minima laudantium. Excepturi consequuntur omnis doloremque quis nam sint enim.`}
                                        />
                                    </div>
                                )}

                                <article className="group rounded-2xl border border-[#e3ecdc] bg-white/90 shadow-sm overflow-hidden transition hover:shadow-md hover:-translate-y-0.5">
                                    <img
                                        src={item.url}
                                        alt="img"
                                        loading="lazy"
                                        decoding="async"
                                        className={`block w-full object-cover ${
                                            item.comment ? 'rounded-t-2xl' : 'rounded-2xl'
                                        }`}
                                    />

                                    {item.comment && (
                                        <div className="px-2 py-1">
                                            <p className="text-[13px] leading-relaxed text-gray-700">{item.comment}</p>
                                        </div>
                                    )}
                                </article>
                            </div>
                        ))}
                    </div>
                </main>

                <aside className="sticky top-0 h-[calc(100vh-24px)] rounded-2xl bg-[#f3f7ee] p-3 border border-[#e3ecdc] overflow-y-auto no-scrollbar">
                    {cover.map((item, i) => (
                        <div key={i} className="relative mb-3">
                            <div className="absolute bottom-2 right-3 flex flex-col items-end z-10 text-white">
                                <span className="text-[12px] font-semibold drop-shadow-sm">Buddy_ᬏ᭄꙳⸌ 체리쉬 ⛧*̩̩͙⸝⋆</span>
                                <span className="text-[12px] font-semibold drop-shadow-sm">july 14, 2025</span>
                            </div>
                            <div className="absolute inset-0 rounded-xl bg-white/20 z-[1]" />
                            <img
                                src={item.url}
                                alt="cover"
                                className="w-full h-[140px] mb-2 rounded-xl object-cover border border-gray-300 shadow transition hover:-translate-y-0.5"
                            />
                        </div>
                    ))}
                </aside>
            </div>
        </div>
    );
}
