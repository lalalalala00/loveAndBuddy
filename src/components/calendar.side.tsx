import dayjs from 'dayjs';
import { useMemo } from 'react';
import type { BuddyLite, DearLove } from '@/utils/data';
import type { SelectedDay } from './home/calendar';
import { useUserState } from '@/context/useUserContext';

type Props = {
    item: SelectedDay | undefined;
    dayContents: boolean;
    calSize: boolean;
    resolveBuddyName: (id?: string | null) => string;
    buddyAvatar: string;
};

const fallbackPhotos = [
    '/cha/1_1.png',
    '/cha/1_2.png',
    '/cha/1_3.png',
    '/cha/1_4.png',
    '/cha/1_5.png',
    '/cha/1_6.png',
    '/cha/1_7.png',
];

const CalendarSideContent = ({ item, dayContents, calSize, resolveBuddyName, buddyAvatar }: Props) => {
    if (!item) return null;

    const { animals } = useUserState();

    const loveNames = useMemo(() => {
        const names = new Set<string>();

        (animals ?? []).forEach((a) => a?.animal_uuid && names.add(a.name));

        return Array.from(names);
    }, [item]);

    const cardWidth = dayContents && calSize ? 'w-[375px]' : 'w-[360px]';
    const listHeight = dayContents && calSize ? 'h-[530px]' : 'h-[340px]';

    const formatTime = (v?: string | number | null) => {
        if (!v) return '';
        const d = typeof v === 'number' ? dayjs(v) : dayjs(v);
        return d.format('HH:mm');
    };

    const gridPhotos = (dl: DearLove) => {
        const pics = dl.photos && dl.photos.length > 0 ? dl.photos : fallbackPhotos;
        const show = pics.slice(0, 6);
        const extra = Math.max(pics.length - show.length, 0);
        return { show, extra };
    };
    console.log(item);
    return (
        <div className="flex flex-col justify-between items-center h-full rounded-xl p-2">
            {item?.reservation.length >= 1 ? (
                <>
                    <div>
                        <span className="text-[14px] text-[#51683b] inline-flex justify-center text-center mb-2 w-full p-2 rounded-xl border border-[#e3ecdc]">
                            -`♥´- dear.Love_〘 <b className="px-2">{loveNames.join(', ') || '—'}</b> 〙 -`♥´-
                        </span>

                        <div className={`overflow-y-scroll no-scrollbar ${listHeight}`}>
                            {item.reservation.map((dl, i) => {
                                const buddyName = resolveBuddyName(dl.buddy_user_id);
                                const { show, extra } = gridPhotos(dl);
                                const t = formatTime(dl.date_at);

                                return (
                                    <div
                                        key={dl.id ?? i}
                                        className={`border mb-2 border-gray-200 bg-[#fafdf4] rounded-xl p-4 ${cardWidth}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-9 h-9 rounded-full bg-white border border-[#e3ecdc] flex items-center justify-center text-[12px] text-[#51683b]">
                                                {buddyName}
                                            </div>
                                            <img src={buddyAvatar} alt="" className="w-9 h-9 rounded-full" />
                                            <div className="flex-1 min-w-0">
                                                <div className="text-[12px] text-gray-700 truncate">
                                                    Buddy&nbsp;<b className="text-[#51683b]">{buddyName}</b>
                                                </div>
                                                <div className="text-[11px] text-gray-500">
                                                    ⏱ ̗̀ {dl.start_time} =͟͟͞ ♡̩͙꙳ {dl.end_time} ˎˊ
                                                </div>
                                            </div>
                                            <span className="text-[11px] px-2 py-0.5 rounded-lg bg-white/70 border border-[#e3ecdc]">
                                                {dl.weather ?? '--'}
                                            </span>
                                        </div>

                                        <div className="w-full border-t border-[#e3ecdc] my-2" />

                                        <div className="text-[13px] font-medium text-gray-800 line-clamp-2">
                                            {dl.title || '-'}
                                        </div>

                                        {/* {dl.representative_img && (
                                            <div className="mt-2">
                                                <img
                                                    src={dl.representative_img}
                                                    alt=""
                                                    className="w-full h-32 object-cover rounded-lg ring-1 ring-[#e3ecdc] shadow-inner"
                                                />
                                            </div>
                                        )} */}

                                        <div className="mt-2 grid grid-cols-3 gap-1">
                                            {show.map((src, idx) => (
                                                <div key={idx} className="relative">
                                                    <img
                                                        src={src}
                                                        alt=""
                                                        className="w-full h-24 object-cover rounded-lg ring-1 ring-[#e3ecdc] shadow-inner"
                                                    />
                                                    {idx === 5 && extra > 0 && (
                                                        <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center text-white text-[13px]">
                                                            +{extra}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {dl.comment && (
                                            <p className="mt-2 text-[13px] text-gray-700 line-clamp-3">{dl.comment}</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <button className="text-[13px] custom-card custom-card-hover rounded-2xl w-full h-9">
                        dear.Love 보러가기
                    </button>
                </>
            ) : (
                <div className="flex items-start justify-center w-full h-full text-gray-500">-</div>
            )}
        </div>
    );
};

export default CalendarSideContent;
