import { useMemo } from 'react';
import { SelectedDay } from './home/calendar';

const CalendarSideContent = ({
    item,
    dayContents,
    calSize,
}: {
    item: SelectedDay | undefined;
    dayContents: boolean;
    calSize: boolean;
}) => {
    const photos = [
        '/cha/1_1.png',
        '/cha/1_2.png',
        '/cha/1_3.png',
        '/cha/1_4.png',
        '/cha/1_5.png',
        '/cha/1_6.png',
        '/cha/1_7.png',
    ];

    const show = photos.slice(0, 6);
    const extra = Math.max(photos.length - show.length, 0);

    const loveNames = useMemo(() => Array.from(new Set((item?.reservation ?? []).map((r) => r.love.name))), [item]);
    if (!item) return;

    return (
        <div className="flex flex-col justify-between items-center h-full rounded-xl p-2">
            {item?.reservation.length >= 1 ? (
                <>
                    <div>
                        <span className="text-[14px] text-[#51683b] inline-flex justify-center text-center  mb-2 w-full p-2 rounded-xl border border-[#e3ecdc]">
                            -`♥´- dear.Love_〘 <b className="px-2">{loveNames.join(', ')}</b> 〙 -`♥´-
                        </span>
                        <div
                            className={`overflow-y-scroll no-scrollbar ${dayContents && calSize ? 'h-[530px]' : 'h-[340px]'}`}
                        >
                            {item.reservation.map((item, i) => (
                                <div
                                    key={i}
                                    className={`border mb-2 border-gray-200 bg-[#fafdf4] rounded-xl p-4 ${dayContents && calSize ? 'w-[375px]' : 'w-[360px]'}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-9 h-9 rounded-full bg-white border border-[#e3ecdc] flex items-center justify-center text-[12px] text-[#51683b]">
                                            B
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[12px] text-gray-700 truncate">
                                                Buddy&nbsp;<b className="text-[#51683b]">{item.buddy.name}</b>
                                            </div>
                                            <div className="text-[11px] text-gray-500">⏱ ̗̀ 16:00 =͟͟͞ ♡̩͙꙳ 19:00 ˎˊ</div>
                                        </div>
                                        <span className="text-[11px] px-2 py-0.5 rounded-lg bg-white/70 border border-[#e3ecdc]">
                                            --
                                        </span>
                                    </div>
                                    <div className="w-full border-t border-[#e3ecdc] my-2" />

                                    <div className="text-[13px] font-medium text-gray-800 line-clamp-2">
                                        샤넬이와 놀이터에서 신나게 놀았어요!
                                    </div>
                                    <div className="mt-2 grid grid-cols-3 gap-1">
                                        {show.map((src, i) => (
                                            <div key={i} className="relative">
                                                <img
                                                    src={src}
                                                    alt=""
                                                    className="w-full h-24 object-cover ring-1 ring-[#e3ecdc] shadow-inner"
                                                />
                                                {i === 5 && extra > 0 && (
                                                    <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center text-white text-[13px]">
                                                        +{extra}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button className="text-[13px] custom-card custom-card-hover rounded-2xl w-full h-9">
                        dear.Love 보러가기
                    </button>
                </>
            ) : (
                <div>
                    <span>-</span>
                </div>
            )}
        </div>
    );
};

export default CalendarSideContent;
