import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import BuddyMessageInput from "./buddy.message.input";

type Message = {
  id: string;
  chat_room_id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

const BuddyMessageRoom = ({
  chatRoomId,
  senderId,
}: {
  chatRoomId: string;
  senderId: string;
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_room_id", chatRoomId)
        .order("created_at", { ascending: true });

      console.log(data);

      if (error) {
        console.error("err:", error);
      } else {
        setMessages(data);
      }
    };

    loadMessages();

    const channel = supabase
      .channel(`chat-room-${chatRoomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_room_id=eq.${chatRoomId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => [...prev, newMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatRoomId]);
  console.log(users);
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("users").select("id, name");
      if (error) {
        console.error("유저 정보 불러오기 실패:", error);
      } else {
        setUsers(Object.fromEntries(data.map((u) => [u.id, u.name])));
      }
    };

    fetchUsers();
  }, []);
  console.log(messages, users);
  return (
    <div className="w-full flex flex-col">
      <div className="h-[480px]">
        {messages.map((msg) => (
          <div key={msg.id}>
            <span className="text-black">
              {users[msg.sender_id] ?? msg.sender_id.slice(0, 4)}:
            </span>
            {msg.content ?? ""}
          </div>
        ))}
      </div>
      <BuddyMessageInput
        chatRoomId="6e43ecea-3772-4926-983d-8688acc9fb8d"
        senderId={senderId}
      />
    </div>
  );
};

export default BuddyMessageRoom;
