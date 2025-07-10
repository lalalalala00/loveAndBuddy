import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

type SignUpFormValues = {
  email: string;
  password: string;
  name: string;
  pet_name?: string | null;
  pet_age?: string | null;
  pet_type?: string | null;
  certificate_url?: string | null;
};

const SignUp = () => {
  const [signData, setSignData] = useState<SignUpFormValues>({
    email: "",
    password: "",
    name: "",
    pet_name: null,
    pet_age: null,
    pet_type: null,
    certificate_url: null,
  });

  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSignData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignUp = async () => {
    const { email, password, name } = signData;
    const { data: signUpData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      throw new Error(authError.message);
    }

    const userId = signUpData.user?.id;
    if (!userId) {
      throw new Error("유저 ID가 존재하지 않습니다.");
    }

    const { error: insertError } = await supabase.from("users").insert([
      {
        id: userId,
        name,
        type: selectedType,
      },
    ]);

    if (insertError) {
      throw new Error("err: " + insertError.message);
    }

    console.log("회원가입 완료 🎉");
  };

  return (
    <div className="flex justify-between flex-col h-[95%]">
      <div>
        <input
          type="email"
          name="email"
          placeholder="email"
          value={signData.email}
          onChange={handleChange}
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="password"
          value={signData.password}
          onChange={handleChange}
        />
        <br />
        <input
          type="text"
          name="name"
          placeholder="닉네임"
          value={signData.name}
          onChange={handleChange}
        />
        <br />
        <div>
          <span>당신은 어떤 역할인가요?</span>
          {type.map((item, i) => (
            <div key={i} className="flex">
              <button
                onClick={() => setSelectedType(item.type)}
                className="w-[100px]"
              >
                {item.label}
              </button>
              <p className="text-[14px]">{item.comment}</p>
            </div>
          ))}
        </div>
        {selectedType === null ? (
          ""
        ) : (
          <div className="my-5">
            <span>{selectedType}로 가입 시 필요한 정보를 입력해주세요.</span>

            {selectedType !== "buddy" && (
              <div className="flex flex-col">
                <input
                  type="text"
                  name="pet_name"
                  placeholder="반려동물 이름"
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="pet_type"
                  placeholder="반려동물 종류 (강아지, 고양이 등)"
                  onChange={handleChange}
                />
                <input
                  type="number"
                  name="pet_age"
                  placeholder="반려동물 나이"
                  onChange={handleChange}
                />
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">
                * 일부 정보는 나중에 추가할 수 있지만, 버디 활동 시 자격증
                정보가 없으면 등록이 제한돼요.
              </span>
              {selectedType !== "love" && (
                <input
                  type="text"
                  name="certificate_url"
                  placeholder="자격증 URL 또는 설명"
                  onChange={handleChange}
                />
              )}
            </div>
          </div>
        )}
      </div>
      <button
        onClick={handleSignUp}
        className="flex justify-center w-full border p-3"
      >
        {selectedType}로 가입하기!
      </button>
    </div>
  );
};

const type = [
  {
    label: "러브",
    type: "love",
    comment: "믿을 수 있는 펫시터를 찾고 있어요!",
  },
  {
    label: "버디",
    type: "buddy",
    comment: "반려동물들을 사랑으로 돌봐줄 준비가 되어 있어요!",
  },
  {
    label: "러버디",
    type: "lovuddy",
    comment: "펫시터도 찾고, 다른 반려인도 도와주고 싶어요!",
  },
];

export default SignUp;
