type Message = {
  sender: "love" | "buddy";
  content: string;
  date: string;
};

type ChatRoom = {
  chatId: string;
  participants: [string, string]; // [loveUserId, buddyUserId]
  messages: Message[];
};

const chatRooms: ChatRoom[] = [
  {
    chatId: "room1",
    participants: ["love001", "buddy001"],
    messages: [
      {
        sender: "love",
        content: "안녕하세요! 주말 스케줄 문의드려요.",
        date: "2025-07-04 09:10",
      },
      {
        sender: "buddy",
        content: "안녕하세요! 토요일 오전 가능합니다 :)",
        date: "2025-07-04 09:12",
      },
      {
        sender: "love",
        content: "그럼 오전 10시에 댁으로 방문드리면 될까요?",
        date: "2025-07-04 09:13",
      },
    ],
  },
  {
    chatId: "room2",
    participants: ["love002", "buddy002"],
    messages: [
      {
        sender: "buddy",
        content: "오늘 산책 시간 변경될 수 있어요?",
        date: "2025-07-03 14:30",
      },
      {
        sender: "love",
        content: "네~ 오후 6시쯤 괜찮으세요?",
        date: "2025-07-03 14:32",
      },
    ],
  },
  {
    chatId: "room3",
    participants: ["love003", "buddy003"],
    messages: [
      {
        sender: "love",
        content: "강아지가 요즘 약간 예민한데 괜찮으실까요?",
        date: "2025-07-02 18:00",
      },
      {
        sender: "buddy",
        content:
          "걱정 마세요. 다양한 성격의 친구들을 많이 봐와서 경험 많습니다. 스트레스 받지 않게 천천히 다가갈게요 😊",
        date: "2025-07-02 18:05",
      },
      {
        sender: "love",
        content: "너무 감사합니다. 안심이 되네요!",
        date: "2025-07-02 18:07",
      },
    ],
  },
  {
    chatId: "room4",
    participants: ["love004", "buddy004"],
    messages: [
      {
        sender: "buddy",
        content: "혹시 오늘 급한 일정 있으신가요?",
        date: "2025-07-01 08:50",
      },
    ],
  },
  {
    chatId: "room5",
    participants: ["love005", "buddy005"],
    messages: [
      {
        sender: "love",
        content: "방문 후기 남겨드렸어요! 너무 좋았어요 🐾",
        date: "2025-06-30 21:00",
      },
      {
        sender: "buddy",
        content: "감사합니다! 귀여운 댕댕이 덕분에 저도 행복한 하루였어요!",
        date: "2025-06-30 21:05",
      },
    ],
  },
  {
    chatId: "room6",
    participants: ["love006", "buddy006"],
    messages: [
      {
        sender: "love",
        content:
          "다음 주 화요일 오전도 가능하실까요? 이번에도 너무 잘 돌봐주셔서 또 맡기고 싶어요!",
        date: "2025-06-29 11:10",
      },
      {
        sender: "buddy",
        content:
          "그럼요! 화요일 오전 9시부터 일정 열려 있어요. 아이도 저도 반가울 거예요 🐶",
        date: "2025-06-29 11:12",
      },
      {
        sender: "love",
        content: "좋아요! 그 시간으로 예약할게요. 감사합니다 🙏",
        date: "2025-06-29 11:14",
      },
    ],
  },
];
