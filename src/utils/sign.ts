
export type Role = 'love' | 'buddy' | 'lovuddy';

export type Certificate = {
  name: string;          // 자격증명
  issuer: string;        // 발급기관
  acquired_at: string;   // 취득일 (YYYY-MM-DD)
  url?: string | null;   // 증빙 URL(선택)
};

export type AnimalType = 'dog' | 'cat' | 'others'
export type Personality = 'introvert' | 'extrovert';

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
    first: boolean; // 동물 중에 대표
    animal_uuid: string;
    owner_uuid: string; // 주인 아이디
  
};


export const EMPTY_ANIMAL: Animal = {
  owner_nickname: "",
  name: "",
  birth_year: 2012,
 
  type: "dog",   
  variety: "",
  color: "",
    personality: "introvert" ,
    level: '0',    
  comment: "",
  img: "",
  first: true,

  animal_uuid: "",
  owner_uuid: "",

};




export type SignUpFormValues = {
  uuid?: string;
  email: string;
  password: string;
  name: string;
  type: Role | null;
  avatar_url: string;
    user_birth_year?: string;
  user_comment?: string;
  animals: Animal
  certificates?: Certificate[]; 
};

export const EMPTY_SIGNUP_FORM: SignUpFormValues = {
  email: '',
  password: '',
  name: '',
  type: null,
  avatar_url: '',
  animals: EMPTY_ANIMAL,
  certificates: [],
};
