import { Animal, Certificate, Role } from './sign';

//상대방 정보
export type User = {
    uuid: string;
    name: string;
    avatar_url: string;
    type: Role | null;
    user_birth_year: string;
    user_comment: string;
};

export type Booking = {
    user: User; // 예약 상대
    date: number; //  unix timestamp는 number로 두는 게 안전
    place: string; // 장소 라벨 (애견카페 등)
    location: string; // 동네
};

export type CardKind = 'buddy' | 'love';
//버디 카드 등록 전 최초 인증 후 수정은 설정에서
export type Card = User & {
    cardKind: CardKind;
    // 공통 메트릭
    manner: number;
    heart: number;
    dearLove: number;

    reliability?: number; //버디일 때 신뢰도
    level?: number; // love일 때만 사용

    gender: 'female' | 'male' | 'other' | ''; // 빈값 허용 가능
    // 리스트/달력 공통 소스

    bookmarks: User[]; // 사용자가 좋아요/즐겨찾기한 유저들
    bookings: Booking[]; // 이번 주 캘린더 뱃지 등 계산할 소스

    // 배지/상세
    certificates: Certificate[];
    animals: Animal[]; // lovuddy면 포함, buddy면 []
};

export type Weather = 'sunny' | 'wind' | 'cloud' | 'snow' | 'rain';
export type DearLoveVisibility = 'public' | 'followers' | 'private';

//어떤 버디와 했는지 필요해서 User
// 러브가 직접 썼을 경우 User는 빈값

// export type DearLove  = {
//   id?: string;                 // 식별자(옵션: DB 생성)
//   authorType: CardKind;

//   buddy?: User;

//   date: number;

//   title: string;
//   weather: Weather;

//   /** 대표 이미지(미입력 시 photos[0]을 자동 대표) */
//   representativeImg?: string;

//   photos: string[];

//   comment: string;

//   animals: Animal[];
//   with_animals:string,

//   location?: string;                 // 동네/장소 라벨
//   place?: string;                    // “애견카페” 등 장소 카테고리
//   tags?: string[];                   // 검색/필터 태그

//   //추후 업데이트
//   visibility?: DearLoveVisibility;   // 공개 범위 (기본 public)
//   likes?: number;                    // 반응 수
//   bookmarks?: number;                // 저장 수
//   commentsCount?: number;            // 댓글 수

//   created_at?: number;
//   updated_at?: number;
// };

export type DearLove = {
    id: string;
    author_id: string;
    author_type: 'love' | 'buddy' | string;
    buddy_user_id: string | null;
    date_at: string | null; // '2025-09-21 14:38:53+00'
    start_time: string | null;
    end_time: string | null;
    title: string;
    weather: string | null;
    representative_img: string | null;
    photos: string[]; // ← 단수 아님!
    comment: string | null;
    location: string | null;
    place: string | null;
    tags: string[];
    visibility: 'public' | 'private' | string;
    likes: number;
    bookmarks: number;
    comments_count: number;
    created_at: string;
    updated_at: string;
    with_animals: string | null; // uuid 목록이 문자열이면 나중에 split
};

export type BuddyLite = {
    id: string;
    name?: string | null;
    user_nickname?: string | null;
    avatar_url?: string | null;
    type?: string | null;
};
