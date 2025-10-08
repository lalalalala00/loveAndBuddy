'use client';

import { useEffect, useMemo, useState } from 'react';
import BuddyMessageRoom from './buddy.message.room';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { useUserState } from '@/context/useUserContext';

const FIXED_ROOM_ID = '22f9514e-3dad-4749-a3d9-372ead014fec';
const FIXED_SENDER_ID = '6dc3998b-b201-4c89-bb1e-6400d92c79a5';

type ChatSummary = {
    roomId: string;
    partnerName: string;
    partnerAvatar: string;
    lastMessage: string;
    lastAt: string | null;
    unread: number;
};

function mapRpcRow(raw: any): ChatSummary {
    return {
        roomId: raw.room_id ?? '',
        partnerName: raw.partner_name ?? raw.name ?? '이름없음',
        partnerAvatar: raw.partner_avatar ?? '/cha/1_12.png',
        lastMessage: raw.last_message ?? '',
        lastAt: raw.last_at ?? raw.updated_at ?? raw.last_timestamp ?? null,
        unread: Number(raw.unread_count ?? 0),
    };
}

export default function BuddyConnect({
    setSelectedClose,
    initialRoom,
}: {
    setSelectedClose?: ((value: string) => void) | undefined;
    initialRoom?: { roomId: string; partnerName: string };
}) {
    const { getUser } = useUserState();
    const [expanded, setExpanded] = useState(false);
    const [inRoom, setInRoom] = useState(false);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');

    const [items, setItems] = useState<ChatSummary[]>([]);
    const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
    const [activePartnerName, setActivePartnerName] = useState<string>('');

    const userId = getUser?.id;

    useEffect(() => {
        const onOpen = (e: any) => {
            const { roomId, partnerName } = e.detail || {};
            if (!roomId) return;
            setActiveRoomId(roomId);
            setActivePartnerName(partnerName || '');
            setInRoom(true);
            setExpanded(true);
        };
        window.addEventListener('open-buddy-room', onOpen);
        return () => window.removeEventListener('open-buddy-room', onOpen);
    }, []);

    useEffect(() => {
        const onRefresh = (e: any) => {
            const next: ChatSummary[] = e.detail?.items ?? [];
            setItems(next);
        };
        window.addEventListener('refresh-buddy-list', onRefresh);
        return () => window.removeEventListener('refresh-buddy-list', onRefresh);
    }, []);

    useEffect(() => {
        let mounted = true;
        (async () => {
            setLoading(true);
            setErr('');
            const { data, error } = await supabase.rpc('get_chat_list_for_user', { uid: userId });
            console.log(error);
            if (!mounted) return;

            // if (error) {
            //     console.error('err:', error);
            //     setErr('대화 목록을 불러오는 중 오류가 발생했어요.');
            // }

            const mapped = Array.isArray(data) ? data.map(mapRpcRow) : [];
            console.log(mapped, '000');
            const fallback: ChatSummary = {
                roomId: FIXED_ROOM_ID,
                partnerName: 'cheerrry_',
                partnerAvatar: '/cha/1_12.png',
                lastMessage: '',
                lastAt: null,
                unread: 0,
            };

            //guest
            const final = mapped.length > 0 ? mapped : [fallback];

            setItems(mapped);

            if (!activeRoomId && final.length > 0) {
                setActiveRoomId(final[0].roomId);
                setActivePartnerName(final[0].partnerName);
            }

            setLoading(false);
        })();

        return () => {
            mounted = false;
        };
    }, [userId]);

    const unreadTotal = useMemo(() => items.reduce((a, c) => a + (c.unread || 0), 0), [items]);

    const handleResize = () => {
        if (inRoom) return;
        setExpanded((v) => !v);
    };

    const openRoom = (it: ChatSummary) => {
        setActiveRoomId(it.roomId);
        setActivePartnerName(it.partnerName);
        setInRoom(true);
        setExpanded(true);
    };

    const backToList = () => setInRoom(false);

    useEffect(() => {
        if (initialRoom?.roomId) {
            setActiveRoomId(initialRoom.roomId);
            setActivePartnerName(initialRoom.partnerName || '');
            setInRoom(true);
            setExpanded(true);
        }
    }, [initialRoom]);

    return (
        <div
            className={[
                'relative rounded-2xl border border-[#e3ecdc] bg-[#fefefe]',
                'shadow-[4px_4px_10px_#f7f9f6,-4px_-4px_10px_#ffffff]',
                'transition-all duration-300 ease-out overflow-hidden',
                expanded ? 'h-[520px] w-[400px]' : 'h-[200px] w-[400px]',
            ].join(' ')}
        >
            {/* {unreadTotal > 0 && (
                <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-red-500 flex justify-center items-center text-white font-semibold text-[12px] shadow">
                    {unreadTotal}
                </div>
            )} */}

            <div className="w-full flex items-center py-2 px-3">
                <div className="flex-1 flex justify-start">
                    <button
                        onClick={() => setSelectedClose?.('toki')}
                        aria-label="닫기"
                        className="h-[14px] w-[14px] rounded-full bg-red-500 mr-2"
                    />
                </div>
                <div className="flex-1 flex justify-center">
                    <span className="text-[12px] font-bold text-center px-2 py-1 rounded-lg bg-white shadow-sm border border-[#e3ecdc]">
                        buddyToki
                    </span>
                </div>
                <div className="flex-1 flex justify-end">
                    <button
                        onClick={handleResize}
                        aria-label={expanded ? '축소' : '확장'}
                        className={[
                            'w-[40px] h-[12px] rounded-2xl transition shadow-sm',
                            inRoom ? 'bg-gray-200 cursor-not-allowed' : 'bg-amber-300 hover:brightness-95',
                        ].join(' ')}
                    />
                </div>
            </div>

            {/* content */}
            {inRoom && activeRoomId ? (
                <div className="flex flex-col h-[calc(100%-44px)]">
                    <div className="flex items-center justify-between px-3 py-2 border-y border-[#e3ecdc] bg-white">
                        <button onClick={backToList} className="px-2 py-1 rounded-lg text-[13px] hover:bg-[#f8fbf4]">
                            ‹
                        </button>
                        <div className="flex items-center gap-2">
                            {items.map((it) => (
                                <img
                                    key={it.roomId}
                                    src={it.partnerAvatar}
                                    alt=""
                                    className="w-6 h-6 rounded-full object-cover ring-1 ring-[#e3ecdc]"
                                />
                            ))}
                            <span className="text-[13px] font-medium">{activePartnerName}</span>
                        </div>
                        <button className="px-2 py-1 rounded-lg text-[13px] hover:bg-[#f8fbf4]">•••</button>
                    </div>

                    <div className="flex-1 p-2">
                        <BuddyMessageRoom
                            chatRoomId={activeRoomId}
                            senderId={userId || ''}
                            activePartnerName={activePartnerName}
                        />
                    </div>
                </div>
            ) : (
                <div className="border-t border-[#e3ecdc] w-full p-2 bg-[#fafdf4]">
                    <div
                        className={[
                            'no-scrollbar flex flex-col items-start w-full overflow-y-auto',
                            expanded ? 'h-[460px]' : 'h-[140px]',
                        ].join(' ')}
                    >
                        {loading && (
                            <div className="w-full p-3 text-[13px] text-gray-500">대화 목록을 불러오는 중…</div>
                        )}
                        {!loading && err && <div className="w-full p-3 text-[13px] text-red-500">{err}</div>}

                        {!loading && !err && items.length === 0 && (
                            <div className="w-full p-4 text-[13px] text-gray-600 flex flex-col items-center justify-center gap-2">
                                <span>아직 대화가 없어요.</span>
                                <span className="text-[12px] text-gray-500">
                                    새로운 버디를 찾아 첫 메시지를 보내보세요!
                                </span>
                                <Link
                                    href="/find"
                                    className="mt-1 h-10 px-4 rounded-xl custom-card custom-card-hover flex items-center"
                                >
                                    새로운 버디 만나러 가기
                                </Link>
                            </div>
                        )}

                        {!loading &&
                            !err &&
                            items.map((it) => (
                                <button
                                    key={it.roomId}
                                    onClick={() => openRoom(it)}
                                    className="w-full p-2 rounded-xl border border-[#e3ecdc] transition text-left bg-white mb-2"
                                >
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={it.partnerAvatar}
                                            alt={it.partnerName}
                                            className="w-12 h-12 min-w-12 rounded-full object-cover ring-1 ring-[#e3ecdc] shadow-sm"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[12px] font-medium truncate">
                                                    {it.partnerName}
                                                </span>
                                                <span className="text-[11px] text-gray-500 shrink-0 ml-2">
                                                    {it.lastAt ? new Date(it.lastAt).toLocaleDateString() : ''}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between mt-0.5">
                                                <span className="text-[13px] text-gray-700 truncate">
                                                    {it.lastMessage || '대화를 시작해보세요!'}
                                                </span>
                                                {it.unread > 0 && (
                                                    <span className="ml-2 text-[11px] min-w-4 h-4 px-1 flex justify-center items-center rounded-full bg-red-500 text-white">
                                                        {it.unread}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
}
