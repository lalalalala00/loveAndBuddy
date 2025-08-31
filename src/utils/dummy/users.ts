import { SignUpFormValues } from "../sign";

export const dummyUsers: SignUpFormValues[] = [
  {
    email: "love1@example.com",
    password: "love1234!",
    name: "러브유저1",
    type: "love",
    avatar_url: "",
    animals: {
      owner_uuid: "00000000-0000-0000-0000-000000000000",
      owner: true,
      name: "몽이",
      birth_year: "3",
      type: "dog",
      variety: "말티즈",
      color: "white",
      personality: "introvert",
      level: "5",
      comment: "처음 만나는 사람 앞에서는 살짝 낯가려요",
      img: ""
    },
    certificates: []
  },
  {
    email: "buddy1@example.com",
    password: "buddy1234!",
    name: "버디유저1",
    type: "buddy",
    avatar_url: "",
    animals: {
      owner_uuid: "",
      owner: false,
      name: "",
      birth_year: "",
      type: "dog",
      variety: "",
      color: "",
      personality: "introvert",
      level: "",
      comment: "",
      img: ""
    },
    certificates: [
      {
        name: "반려동물 행동상담사 2급",
        issuer: "한국반려동물교육원",
        acquired_at: "2024-11-15",
        url: "https://example.com/cert/abc"
      },
      {
        name: "펫시터 전문과정 수료",
        issuer: "러브&버디 트레이닝 센터",
        acquired_at: "2025-07-01",
        url: null
      }
    ]
  },
  {
    email: "lovuddy1@example.com",
    password: "lovuddy1234!",
    name: "러버디유저1",
    type: "lovuddy",
    avatar_url: "",
    animals: {
      owner_uuid: "11111111-1111-1111-1111-111111111111",
      owner: true,
      name: "콩이",
      birth_year: "2",
      type: "cat",
      variety: "코리안숏헤어",
      color: "tabby",
      personality: "extrovert",
      level: "6",
      comment: "장난감 놀이 좋아해요",
      img: ""
    },
    certificates: [
      {
        name: "동물행동관리사",
        issuer: "KAPC",
        acquired_at: "2023-09-20",
        url: null
      }
    ]
  }
];