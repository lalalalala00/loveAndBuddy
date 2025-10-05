import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';

const BuddyMessageInput = ({
    chatRoomId,
    senderId,
    disabled = false,
}: {
    chatRoomId: string;
    senderId: string;
    disabled?: boolean;
}) => {
    const [content, setContent] = useState('');

    const sendMessage = async () => {
        if (!content.trim()) return;

        const { error } = await supabase.from('chat_messages').insert([
            {
                room_id: chatRoomId,
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
        if (!content.trim() || disabled) return;
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
                        if (disabled) return;
                        if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
                            e.preventDefault();
                            safeSend();
                        }
                        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                            e.preventDefault();
                            safeSend();
                        }
                    }}
                    placeholder={disabled ? '예약을 수락하면 입력할 수 있어요' : '메시지를 입력하세요'}
                    className="w-full h-11 bg-transparent py-1 text-[14px] focus:outline-none placeholder:text-gray-400"
                    aria-label="메시지 입력"
                    disabled={disabled}
                />
            </div>

            <button
                onClick={safeSend}
                disabled={disabled || !content.trim()}
                className={[
                    'h-11 px-4 rounded-xl transition',
                    disabled || !content.trim()
                        ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                        : 'custom-card custom-card-hover',
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
