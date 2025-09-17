export function Type() {
    return (
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
            <h3 className="text-sm font-semibold mb-3">Domain & Form Types</h3>
            <pre className="text-xs md:text-sm font-mono whitespace-pre overflow-x-auto p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800">
                <code>{`// ----------------------------------------------------
// Domain enums
// ----------------------------------------------------
export type Role = 'love' | 'buddy' | 'lovuddy';
export type AnimalType = 'dog' | 'cat' | 'others';
export type Personality = 'introvert' | 'extrovert';

// ----------------------------------------------------
// Domain models
// ----------------------------------------------------
export type Certificate = {
  name: string;          // 자격증명
  issuer: string;        // 발급기관
  acquired_at: string;   // 취득일 (YYYY-MM-DD)
  url?: string | null;   // 증빙 URL(선택)
};

export type Animal = {
  owner_nickname: string;
  name: string;
  birth_year: number;
  type: AnimalType;
  variety: string;
  color: string;
  personality: Personality;
  level: string;
  comment: string;
  img: string;
  first: boolean;        // 대표 개체 여부
  animal_uuid: string;
  owner_uuid: string;    // 주인 UUID
};

// 도메인 기본값(스켈레톤)
export const EMPTY_ANIMAL: Animal = {
  owner_nickname: '',
  name: '',
  birth_year: 2012,
  type: 'dog',
  variety: '',
  color: '',
  personality: 'introvert',
  level: '0',
  comment: '',
  img: '',
  first: true,
  animal_uuid: '',
  owner_uuid: '',
};

// ----------------------------------------------------
// Form model (UI 전용)
// ----------------------------------------------------
export type SignUpFormValues = {
  uuid?: string;
  email: string;
  password: string;
  nickname: string;
  type: Role | null;
  avatar_url: string;
  birth_year?: string;          // 문자열로 입력받아 서버에서 number 변환
  user_comment?: string;
  animals?: Animal;             // 초기 운영 기간 동안은 가입시 필수값 x (펫시터 찾기 카드 등록시 입력 가능)
  certificates?: Certificate[]; // 초기 운영 기간 동안은 가입시 필수값 x (펫시터 등록시 입력 가능)
  name?: string;                // 표시/닉네임과 별도 실명 필드(선택)
};

// 폼 기본값
export const EMPTY_SIGNUP_FORM: SignUpFormValues = {
  email: '',
  password: '',
  nickname: '',
  type: null,
  avatar_url: '',
  animals: EMPTY_ANIMAL,
  certificates: [],
  user_comment: '',
  name: '',
  birth_year: '',
};`}</code>
            </pre>
        </div>
    );
}

export function DomainTypes() {
    return (
        <div className="rounded-2xl mt-3 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
            <h3 className="text-sm font-semibold mb-3">Domain Models (User · Card · DearLove)</h3>
            <pre className="text-xs md:text-sm font-mono whitespace-pre overflow-x-auto p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800">
                <code>{`import type { Animal, Certificate, Role } from './sign';

// ----------------------------------------------------
// User & Booking
// ----------------------------------------------------
export type User = {
  uuid: string;
  nickname: string;
  avatar_url: string;
  type: Role | null;
  user_birth_year: string;
  user_comment: string;
  name: string | null;
};

export type Booking = {
  user: User;       // 예약 상대
  date: number;     // unix timestamp
  place: string;    // 장소 라벨
  location: string; // 동네
};

// ----------------------------------------------------
// Card (프로필 카드 뷰 모델)
// ----------------------------------------------------
export type CardKind = 'buddy' | 'love';

export type Card = User & {
  cardKind: CardKind;
  
  // 공통 메트릭
  manner: number;
  heart: number;
  dearLove: number;

  // 역할별 보조 메트릭
  reliability?: number; // buddy에서 사용
  level?: number;       // love에서 사용

  // 프로필
  gender: 'female' | 'male' | ''; // 빈값 허용

  // 리스트/달력 공통 소스
  bookmarks: User[];    // 즐겨찾기
  bookings: Booking[];  // 캘린더/배지 계산 소스

  // 배지/상세
  certificates: Certificate[];
  animals: Animal[];    // lovuddy면 채워짐, buddy면 []
};

// ----------------------------------------------------
// DearLove (게시물/후기)
// ----------------------------------------------------
export type Weather = 'sunny' | 'wind' | 'cloud' | 'snow' | 'rain';
export type DearLoveVisibility = 'public' | 'followers' | 'private';

export type DearLove = {
  id?: string;                 // DB 생성 시 사용
  authorType: CardKind;        // 작성자 카드 유형

  buddy?: User;                // 어떤 버디와 함께했는지 (선택)

  date: number;                // unix timestamp
  title: string;
  weather: Weather;

  /** 대표 이미지(미입력 시 photos[0] 자동 대표) */
  representativeImg?: string;

  photos: string[];
  comment: string;
  animals: Animal[];

  // 메타
  location?: string;           // 동네/장소 라벨
  place?: string;              // 카테고리 ("애견카페" 등)
  tags?: string[];             // 검색/필터 태그

  // 공개 범위/반응
  visibility?: DearLoveVisibility; // 기본 public
  likes?: number;
  bookmarks?: number;
  commentsCount?: number;

  created_at?: number;
  updated_at?: number;
};`}</code>
            </pre>
        </div>
    );
}
