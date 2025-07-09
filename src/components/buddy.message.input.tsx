import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

const BuddyMessageInput = ({
  chatRoomId,
  senderId,
}: {
  chatRoomId: string;
  senderId: string;
}) => {
  const [content, setContent] = useState("");

  const sendMessage = async () => {
    if (!content.trim()) return;

    const { error } = await supabase.from("messages").insert([
      {
        chat_room_id: chatRoomId,
        sender_id: senderId,
        content: content,
      },
    ]);

    if (error) {
      console.error("❌ 메시지 전송 실패:", error);
    } else {
      setContent("");
    }
  };

  return (
    <div className="flex items-center gap-2 mt-4 w-full">
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") sendMessage();
        }}
        placeholder="메시지를 입력하세요"
        className="bg-white h-[44px] px-3 py-1 rounded w-4/5 outline-none"
      />
      <button
        onClick={sendMessage}
        className="bg-amber-600  h-[44px] text-white px-3 py-1 rounded w-1/5"
      >
        전송
      </button>
    </div>
  );
};

export default BuddyMessageInput;
