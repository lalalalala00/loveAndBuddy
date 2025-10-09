'use client';

import { DearLove, User } from '@/utils/data';
import { Animal, Certificate, LoveGroupCard } from '@/utils/sign';
import {
    createContext,
    useContext,
    useState,
    type ReactNode,
    type SetStateAction,
    type Dispatch,
    useMemo,
    useEffect,
} from 'react';

export type UserStateType = 'love' | 'buddy' | 'lovuddy' | 'guest';
export type UserWithCerts = User & { certificates: Certificate[] };
export type UserFull = User & { certificates: Certificate[]; animals: Animal[] };

interface UserContext {
    userState: UserStateType;
    setUserState: Dispatch<SetStateAction<UserStateType>>;

    getUser: User | null;
    setGetUser: Dispatch<SetStateAction<User | null>>;

    certificates: Certificate[];
    setCertificates: Dispatch<SetStateAction<Certificate[]>>;

    animals: Animal[];
    setAnimals: Dispatch<SetStateAction<Animal[]>>;

    dearLoves: DearLove[];
    setDearLoves: Dispatch<SetStateAction<DearLove[]>>;

    loveChatData: LoveGroupCard | null;
    setLoveChatData: Dispatch<SetStateAction<LoveGroupCard | null>>;

    toast: boolean;
    setToast: Dispatch<SetStateAction<boolean>>;

    login: boolean;
    setLogin: Dispatch<SetStateAction<boolean>>;

    /** 파생: 유저 + 자격증 */
    userWithCerts: UserWithCerts | null;
    /** 파생: 유저 + 자격증 + 애니멀 */
    userFull: UserFull | null;

    /** 로그아웃/리셋 등에 사용 */
    resetUser: () => void;
}

const UserStateCtx = createContext<UserContext | undefined>(undefined);

export const UserStateProvider = ({ children }: { children: ReactNode }) => {
    const [userState, setUserState] = useState<UserStateType>('guest');

    const [getUser, setGetUser] = useState<User | null>(null);
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [dearLoves, setDearLoves] = useState<DearLove[]>([]);
    const [loveChatData, setLoveChatData] = useState<LoveGroupCard | null>(null);
    const [toast, setToast] = useState<boolean>(false);
    const [login, setLogin] = useState<boolean>(false);

    const userWithCerts = useMemo<UserWithCerts | null>(() => {
        if (!getUser) return null;
        return { ...getUser, certificates };
    }, [getUser, certificates, toast]);

    const userFull = useMemo<UserFull | null>(() => {
        if (!getUser) return null;
        return { ...getUser, certificates, animals, dearLoves };
    }, [getUser, certificates, animals, dearLoves, toast]);

    const resetUser = () => {
        setGetUser(null);
        setCertificates([]);
        setAnimals([]);
        setDearLoves([]);

        setUserState('guest');
    };

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(false), 1000);
        return () => clearTimeout(t);
    }, [toast]);

    return (
        <UserStateCtx.Provider
            value={{
                userState,
                setUserState,
                getUser,
                setGetUser,
                certificates,
                setCertificates,
                animals,
                setAnimals,
                dearLoves,
                setDearLoves,
                loveChatData,
                setLoveChatData,
                toast,
                setToast,
                login,
                setLogin,

                userWithCerts,
                userFull,
                resetUser,
            }}
        >
            {children}
        </UserStateCtx.Provider>
    );
};

export const useUserState = () => {
    const ctx = useContext(UserStateCtx);
    if (!ctx) throw new Error('useUserState must be used within a UserStateProvider');
    return ctx;
};
