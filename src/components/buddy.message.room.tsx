'use client';

import { supabase } from '@/lib/supabaseClient';
import { useEffect, useMemo, useRef, useState } from 'react';
import BuddyMessageInput from './buddy.message.input';
import { useUserState } from '@/context/useUserContext';
import { ChatSummary } from './buddy.connect';

type Message = {
    id: string;
    room_id: string;
    sender_id: string;
    content: string | null;
    created_at: string;
};

const fmtTime = (ts: string) => {
    const d = new Date(ts);
    return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
};
const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const dayLabel = (ts: string) => {
    const d = new Date(ts);
    return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
};

export default function BuddyMessageRoom({
    chatRoomId,
    senderId,
    activePartnerName,
    items,
}: {
    chatRoomId: string;
    senderId: string;
    activePartnerName: string;
    items: ChatSummary[];
}) {
    const { loveChatData } = useUserState();
    const [messages, setMessages] = useState<Message[]>([]);
    const [users, setUsers] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [accepted, setAccepted] = useState(false);
    const [showAcceptedInfo, setShowAcceptedInfo] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);
    const prevLenRef = useRef(0);

    useEffect(() => {
        if (!chatRoomId) return;
        let mounted = true;

        (async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('chat_messages')
                .select('*')
                .eq('room_id', chatRoomId)
                .order('created_at', { ascending: true });

            if (!mounted) return;
            if (error) {
                console.error('[chat_messages select] error:', error);
                setMessages([]);
            } else {
                setMessages((data as Message[]) || []);
            }
            setLoading(false);
        })();

        const channel = supabase
            .channel(`chat-room-${chatRoomId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `room_id=eq.${chatRoomId}` },
                (payload) => {
                    const newMsg = payload.new as Message;
                    setMessages((prev) => [...prev, newMsg]);
                },
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
            mounted = false;
        };
    }, [chatRoomId]);

    useEffect(() => {
        const ids = Array.from(new Set(messages.map((m) => m.sender_id))).filter((id) => !(id in users));
        if (ids.length === 0) return;
        (async () => {
            const { data, error } = await supabase.from('users').select('id,name').in('id', ids);
            if (error) {
                console.error('[users select] error:', error);
                return;
            }
            setUsers((prev) => ({ ...prev, ...Object.fromEntries((data || []).map((u) => [u.id, u.name])) }));
        })();
    }, [messages, users]);

    useEffect(() => {
        const box = scrollRef.current;
        if (!box) return;
        const prevLen = prevLenRef.current;
        const nextLen = messages.length;
        if (nextLen > prevLen || prevLen === 0) {
            requestAnimationFrame(() => {
                box.scrollTop = box.scrollHeight;
            });
        }
        prevLenRef.current = nextLen;
    }, [messages]);

    const threaded = useMemo(() => {
        const out: Array<{ type: 'day' | 'msg'; data: any }> = [];
        let prevDate: Date | null = null;
        messages.forEach((m) => {
            const d = new Date(m.created_at);
            if (!prevDate || !isSameDay(prevDate, d)) {
                out.push({ type: 'day', data: dayLabel(m.created_at) });
                prevDate = d;
            }
            out.push({ type: 'msg', data: { m, isMine: m.sender_id === senderId } });
        });
        return out;
    }, [messages, senderId]);

    const acceptReservation = () => {
        setAccepted(true);
        setShowAcceptedInfo(true);

        supabase
            .from('chat_messages')
            .insert([{ room_id: chatRoomId, sender_id: senderId, content: '예약을 수락했어요.' }]);
    };

    return (
        <div className="w-full h-full flex flex-col">
            <div
                ref={scrollRef}
                className="no-scrollbar overflow-scroll h-[360px] bg-[#f8fbf4] rounded-xl border border-[#e3ecdc] p-2"
            >
                {loading && <div className="text-[13px] text-gray-500 p-2">메시지를 불러오는 중…</div>}

                {!loading && messages.length === 0 && !accepted && (
                    <div className="text-[13px] text-gray-700 p-2 flex items-center flex-col text-center">
                        {/* {items.map((item, i) =>
                            item.partnerName === activePartnerName ? (
                                <span key={item.roomId}>
                                    <b>{activePartnerName} </b> 버디와 대화가 시작됩니다.
                                </span>
                            ) : (
                                <span key={loveChatData?.owner_uuid}>
                                    <b>{loveChatData?.owner_nickname ?? activePartnerName}</b> 러브와 대화가 시작됩니다.
                                </span>
                            ),
                        )} */}

                        {loveChatData?.owner_nickname === activePartnerName ? (
                            <span>
                                <b>{loveChatData?.owner_nickname ?? activePartnerName}</b> 러브와 대화가 시작됩니다.
                            </span>
                        ) : (
                            items.map(
                                (item) =>
                                    item.partnerName === activePartnerName && (
                                        <span key={item.roomId}>
                                            <b>{activePartnerName} </b> 버디와 대화가 시작됩니다.
                                        </span>
                                    ),
                            )
                        )}

                        <div className=" text-gray-800">
                            {loveChatData?.animals.map((item) => (
                                <div key={item.animal_uuid} className="flex flex-col my-2 text-gray-500">
                                    <span>
                                        {item.name}, {item.variety}, {item.comment}
                                    </span>
                                    <span>
                                        {loveChatData.location} - {loveChatData.place}
                                    </span>
                                </div>
                            ))}
                            <div className="text-black font-medium">안녕하세요. {loveChatData?.owner_nickname}님!</div>
                            <div className="mt-1">
                                저는 33세 여성으로 현재 수의테크니션으로 일하고 있습니다. 자격증 및 이력은 버디룸에서
                                확인해주세요.
                            </div>
                            <div className="mt-1">
                                괜찮으시다면 아래에서 <b>예약 수락하기</b>를 눌러주세요!
                            </div>
                        </div>

                        <button
                            onClick={acceptReservation}
                            className="mt-3 h-10 px-4 rounded-xl custom-card custom-card-hover flex items-center"
                        >
                            예약 수락하기
                        </button>

                        <div className="w-full border-t border-gray-200 mt-4" />
                    </div>
                )}

                {showAcceptedInfo && (
                    <div className="mb-3 p-3 bg-white border border-[#e3ecdc] rounded-xl text-left">
                        <div className="text-[13px] text-gray-700">
                            {loveChatData?.animals?.map((item) => (
                                <div key={item.animal_uuid} className="mb-1">
                                    <span className="font-medium">{item.name}</span>
                                    <span className="mx-1 text-gray-400">·</span>
                                    <span>{item.variety}</span>
                                    <span className="mx-1 text-gray-400">·</span>
                                    <span className="text-gray-600">{item.comment}</span>
                                </div>
                            ))}

                            {(loveChatData?.location || loveChatData?.place) && (
                                <div className="mt-1">
                                    <span className="text-gray-500">장소</span>
                                    <span className="mx-1 text-gray-400">·</span>
                                    <span>
                                        {loveChatData?.location} - {loveChatData?.place}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {!loading &&
                    threaded.map((item, i) => {
                        if (item.type === 'day') {
                            return (
                                <div key={`d-${i}`} className="my-2 flex items-center gap-2">
                                    <div className="flex-1 h-px bg-[#e3ecdc]" />
                                    <span className="text-[11px] text-gray-500">{item.data}</span>
                                    <div className="flex-1 h-px bg-[#e3ecdc]" />
                                </div>
                            );
                        }
                        const { m, isMine } = item.data as { m: Message; isMine: boolean };
                        const name = users[m.sender_id] ?? m.sender_id.slice(0, 6);

                        return (
                            <div key={m.id} className={`mt-1 flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                {!isMine && (
                                    <div className="mr-2 mt-5 w-7 h-7 rounded-full bg-white border border-[#e3ecdc] text-[11px] flex items-center justify-center text-[#51683b]">
                                        {name.slice(0, 1).toUpperCase()}
                                    </div>
                                )}

                                <div className={`max-w-[70%] ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
                                    {!isMine && <span className="text-[11px] text-gray-500 mb-0.5">{name}</span>}

                                    <div
                                        className={[
                                            'px-3 py-2 rounded-2xl shadow',
                                            isMine
                                                ? 'custom-card text-[#2b3a1f]'
                                                : 'bg-white border border-[#e3ecdc] text-gray-800',
                                        ].join(' ')}
                                    >
                                        <p className="whitespace-pre-wrap text-[14px]">{m.content ?? ''}</p>
                                    </div>

                                    <span className="mt-1 text-[10px] text-gray-400">{fmtTime(m.created_at)}</span>
                                </div>
                            </div>
                        );
                    })}
            </div>

            <div className="mt-2">
                <BuddyMessageInput chatRoomId={chatRoomId} senderId={senderId} disabled={!accepted} />
            </div>
        </div>
    );
}
