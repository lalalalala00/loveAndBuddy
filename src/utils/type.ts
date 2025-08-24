// 공용
export type Role = 'love' | 'buddy' | 'lovuddy';

export type UsersRow = {
  id: string;                 // auth.users.id (UUID)
  email: string;
  name: string;               // 표시용 닉네임
  type: Role;
  avatar_url: string | null;
  bio: string | null;
  certificate_url: string | null;
  created_at: string;         // ISO8601 (timestamptz)
  updated_at: string;         // ISO8601 (timestamptz)
};

// INSERT 시(서버에서 기본값 채워지는 것 제외)
export type UsersInsert = {
  id: string;                 // = auth.uid()
  email: string;
  name: string;
  type: Role;
  avatar_url?: string | null;
  bio?: string | null;
  certificate_url?: string | null;
  // created_at/updated_at는 DB 기본값 사용
};

// UPDATE 시
export type UsersUpdate = {
  id: string;                 
  email?: string;
  name?: string;
  type?: Role;
  avatar_url?: string | null;
  bio?: string | null;
  certificate_url?: string | null;
 
};


export type UsersState = UsersRow | null | undefined; 

