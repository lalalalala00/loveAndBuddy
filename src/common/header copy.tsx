"use client";

import { useRouter } from "next/navigation";
import { UserStateType, useUserState } from "../context/useUserContext";
import { useTypedRouter } from "@/hooks/userTypeRouter";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import Modal from "./modal";
import SignUp from "@/components/sign.up";

const Header = () => {
  const router = useRouter();
  const { userState, setUserState } = useUserState();
  const { push } = useTypedRouter();

  const [pendingType, setPendingType] = useState<UserStateType | null>(null);
  const [getUser, setGetUser] = useState<User | null>(null);
  const [signUpModal, setSignUpModal] = useState<boolean>(false);

  const currentUser = userType.find((u) => u.label === userState);

  const typeMenu = [
    { label: "home", url: "/" },
    { label: currentUser?.menu, url: "/lovuddy" },
    { label: "Dear Love", url: "/dearLove" },
    { label: "community", url: "/community" },
  ];

  const handleTabClick = (type: UserStateType) => {
    setUserState(type);
    setPendingType(type);
  };

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setGetUser(user);
    })();
  }, []);

  useEffect(() => {
    if (pendingType) {
      router.push(`/?type=${pendingType}`);
      setPendingType(null);
    }
  }, [userState]);

  return (
    <div className="flex mt-5 justify-between items-center">
      <div className="flex">
        {typeMenu.map((item, i) => (
          <button
            key={i}
            onClick={() => router.push(item.url)}
            className="w-[200px] neumorph-card flex justify-center items-center text-[14px] h-[30px] mx-3"
            // className="w-[200px] rounded-md border border-black neumorph-card flex justify-center items-center text-[14px] h-[30px] mx-3"
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="h-[30px] w-[200px]">
        {getUser === null ? (
          <div className="flex justify-end">
            <button className="mr-3" onClick={() => setSignUpModal(!signUpModal)}>
              signUp
            </button>
            <button>login</button>
          </div>
        ) : (
          userType.map((item, i) => (
            <button
              key={i}
              onClick={() => handleTabClick(item.label)}
              className={` border-black border-r last:border-r-0 px-2  ${
                userState === item.label ? "bg-blue-200" : ""
              }`}
            >
              {item.label}
            </button>
          ))
        )}
      </div>
      <Modal
        isOpen={signUpModal}
        handleModalState={() => setSignUpModal(!signUpModal)}
        width="500px"
        height="500px"
        title="loveAndbuddy 가입하기"
      >
        <SignUp />
      </Modal>
    </div>
  );
};

const userType: { label: UserStateType; type: number; menu: string }[] = [
  { label: "love", type: 0, menu: "Find buddy" },
  { label: "lovuddy", type: 2, menu: "Find love & buddy" },
  { label: "buddy", type: 1, menu: "Find love" },
];

export default Header;
