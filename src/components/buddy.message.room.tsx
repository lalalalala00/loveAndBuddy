'use client';

import { supabase } from '@/lib/supabaseClient';
import { useEffect, useMemo, useRef, useState } from 'react';
import BuddyMessageInput from './buddy.message.input';

type Message = {
    id: string;
    chat_room_id: string;
    sender_id: string;
    content: string;
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

export default function BuddyMessageRoom({ chatRoomId, senderId }: { chatRoomId: string; senderId: string }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [users, setUsers] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);
    const prevLenRef = useRef(0);

    // 초기 로드 + 실시간 수신
    useEffect(() => {
        let mounted = true;
        (async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('chat_room_id', chatRoomId)
                .order('created_at', { ascending: true });

            if (!mounted) return;
            if (error) {
                console.error('err:', error);
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
                { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_room_id=eq.${chatRoomId}` },
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

    // 메시지에 등장하는 발신자만 조회 (이름 맵)
    useEffect(() => {
        const ids = Array.from(new Set(messages.map((m) => m.sender_id))).filter((id) => !(id in users));
        if (ids.length === 0) return;
        (async () => {
            const { data, error } = await supabase.from('users').select('id,name').in('id', ids);
            if (error) {
                console.error('유저 정보 불러오기 실패:', error);
                return;
            }
            setUsers((prev) => ({ ...prev, ...Object.fromEntries((data || []).map((u) => [u.id, u.name])) }));
        })();
    }, [messages, users]);

    // 오토스크롤(새 메시지 들어오면 하단으로)
    useEffect(() => {
        const box = scrollRef.current;
        if (!box) return;
        const prevLen = prevLenRef.current;
        const nextLen = messages.length;
        // 처음 로드/추가 시 스크롤
        if (nextLen > prevLen || prevLen === 0) {
            // 약간의 렌더 타이밍 보정
            requestAnimationFrame(() => {
                box.scrollTop = box.scrollHeight;
            });
        }
        prevLenRef.current = nextLen;
    }, [messages]);

    // 날짜 구분선을 포함한 렌더 리스트
    const threaded = useMemo(() => {
        const out: Array<{ type: 'day' | 'msg'; data: any }> = [];
        let prevDate: Date | null = null;
        messages.forEach((m, idx) => {
            const d = new Date(m.created_at);
            if (!prevDate || !isSameDay(prevDate, d)) {
                out.push({ type: 'day', data: dayLabel(m.created_at) });
                prevDate = d;
            }
            out.push({ type: 'msg', data: { m, isMine: m.sender_id === senderId } });
        });
        return out;
    }, [messages, senderId]);

    return (
        <div className="w-full h-full flex flex-col">
            {/* 메시지 리스트 */}
            <div
                ref={scrollRef}
                className=" no-scrollbar overflow-scroll h-[360px]  bg-[#f8fbf4] rounded-xl border border-[#e3ecdc] p-2"
            >
                {loading && <div className="text-[13px] text-gray-500 p-2">메시지를 불러오는 중…</div>}
                {!loading && messages.length === 0 && (
                    <div className="text-[13px] text-gray-500 p-2">아직 대화가 없어요. 첫 메시지를 보내보세요!</div>
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
                            <div key={m.id} className={`mt-1 flex  ${isMine ? 'justify-end' : 'justify-start'}`}>
                                {/* 상대 말풍선: 아바타/이름 */}
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

            {/* 입력 영역 */}
            <div className="mt-2">
                {/* ❗ 기존 코드에서 하드코딩되어 있던 chatRoomId를 실제 프롭으로 교체 */}
                <BuddyMessageInput chatRoomId={chatRoomId} senderId={senderId} />
            </div>
        </div>
    );
}
