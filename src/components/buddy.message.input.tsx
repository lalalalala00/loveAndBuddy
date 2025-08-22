import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';

const BuddyMessageInput = ({ chatRoomId, senderId }: { chatRoomId: string; senderId: string }) => {
    const [content, setContent] = useState('');

    const sendMessage = async () => {
        if (!content.trim()) return;

        const { error } = await supabase.from('messages').insert([
            {
                chat_room_id: chatRoomId,
                sender_id: senderId,
                content: content,
            },
        ]);

        if (error) {
            console.error('❌ 메시지 전송 실패:', error);
        } else {
            setContent('');
        }
    };

    const safeSend = () => {
        if (!content.trim() /*|| sending*/) return;
        sendMessage();
    };

    return (
        <div className="flex items-center gap-2  w-full">
            {/* 입력 박스 */}
            <div className="flex-1 flex items-center rounded-xl border border-[#e3ecdc] bg-white shadow-inner px-3 ">
                <input
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={(e) => {
                        // Enter 전송 (Shift+Enter는 줄바꿈 대신 무시)
                        if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
                            e.preventDefault();
                            safeSend();
                        }
                        // Ctrl/Cmd + Enter도 전송
                        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                            e.preventDefault();
                            safeSend();
                        }
                    }}
                    placeholder="메시지를 입력하세요"
                    className="w-full h-11 bg-transparent py-1 text-[14px] focus:outline-none placeholder:text-gray-400"
                    aria-label="메시지 입력"
                />
            </div>

            <button
                onClick={safeSend}
                disabled={!content.trim() /*|| sending*/}
                className={[
                    'h-11 px-4 rounded-xl transition',
                    content.trim() /*&& !sending*/
                        ? 'custom-card custom-card-hover'
                        : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed',
                ].join(' ')}
                aria-label="전송"
                title="Enter로 전송, Shift+Enter는 줄바꿈 미지원"
            >
                전송
            </button>
        </div>
    );
};

export default BuddyMessageInput;
