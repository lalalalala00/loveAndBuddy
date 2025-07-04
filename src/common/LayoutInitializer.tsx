"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useUserState } from "@/context/useUserContext";
import type { UserStateType } from "@/context/useUserContext";

export default function LayoutInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const { setUserState } = useUserState();

  const isUserStateType = (value: string): value is UserStateType =>
    ["love", "buddy", "lovuddy"].includes(value);

  useEffect(() => {
    const typeParam = searchParams.get("type");
    const safeType = typeParam?.toLowerCase();

    if (safeType && isUserStateType(safeType)) {
      setUserState(safeType as UserStateType);
    } else {
      setUserState("love");
    }
  }, [searchParams]);

  return <>{children}</>;
}
