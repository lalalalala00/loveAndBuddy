

export type Role = 'love' | 'buddy' | 'lovuddy';

export type Certificate = {
  name: string;          // 자격증명 
  issuer: string;        // 발급기관
  acquired_at: string;   // 취득일 (YYYY-MM-DD)
  url?: string | null;   // 증빙 URL(선택)
  cert:string[];
  id?:string;
  file?: string | File | any;
};

export type AnimalType = 'dog' | 'cat' | 'others' | 'rabbit' | 'ferret' | 'bird' | 'raccoon' | 'hamster'
export type Personality = 'introvert' | 'extrovert';

export type Animal = {

    animalId: string;
  owner_nickname?: string;
    name: string;
    birth_year: number; 
    animal_type: AnimalType;
    variety: string;
    color: string;
    personality: Personality;
    level: string | number; 
    comment: string;
    img: string;
    first: boolean; // 동물 중에 대표
    animal_uuid: string;
    owner_uuid?: string; // 주인 아이디

      manner?: number;
  heart?: number;
  
};

export type LoveGroupCard = {
  // 그룹(카드) 공통 속성
  card_kind: 'love';
  owner_uuid: string;
  owner_nickname: string;
  dear_love: number;     // 그룹 단일 값
  date: string;          // 'YYYY-MM-DD'
  start_time: string;    // 'HH:mm'
  end_time: string;      // 'HH:mm'
  location: string;      // ex) '유성구 원신흥동'
  place: string;         // ex) '애견카페 [잘놀아]'
  // 동물 목록
  animals: Animal[];
};


export const EMPTY_ANIMAL: Animal = {
  owner_nickname: "",
  name: "",
  birth_year: 2012,

  animal_type: "dog",
  variety: "",
  color: "",
  personality: "introvert",
  level: '0',
  comment: "",
  img: "",
  first: true,

  animal_uuid: "",
  owner_uuid: "",
  animalId: "",

};




export type SignUpFormValues = {
  uuid?: string;
  email: string;
  password: string;
  nickname: string;
  type: Role | null;
  avatar_url: string;
  birth_year?: string;
  user_comment?: string;
  animals?: Animal
  certificates?: Certificate[]; 
  name?: string;
};

export const EMPTY_SIGNUP_FORM: SignUpFormValues = {
  email: '',
  password: '',
  nickname: '',
  type: null,
  avatar_url: '',
  animals: EMPTY_ANIMAL,
  certificates: [],
  user_comment:"",
  name:"",
  birth_year:"",

};
