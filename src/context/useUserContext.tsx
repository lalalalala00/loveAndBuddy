'use client';

import { createContext, useContext, useState, type ReactNode, type SetStateAction, type Dispatch } from 'react';

export type UserStateType = 'love' | 'buddy' | 'lovuddy' | 'guest';

interface UserContext {
    userState: string;
    setUserState: Dispatch<SetStateAction<UserStateType>>;
}

const UserState = createContext<UserContext | undefined>(undefined);

export const UserStateProvider = ({ children }: { children: ReactNode }) => {
    const [userState, setUserState] = useState<UserStateType>('love');

    return <UserState.Provider value={{ userState, setUserState }}>{children}</UserState.Provider>;
};

export const useUserState = () => {
    const context = useContext(UserState);
    if (context === undefined) {
        throw new Error('useUserState must be used within a UserStateProvider');
    }
    return context;
};
