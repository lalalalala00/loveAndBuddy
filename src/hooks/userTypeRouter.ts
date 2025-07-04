"use client";

import { useRouter } from "next/navigation";
import { useUserState } from "@/context/useUserContext";

export const useTypedRouter = () => {
  const router = useRouter();
  const { userState } = useUserState();

  const push = (path: string) => {
    const hasQuery = path.includes("?");
    const connector = hasQuery ? "&" : "?";
    router.push(`${path}${connector}type=${userState}`);
  };

  return { push };
};
