'use client';

import { createContext, useContext, useReducer, useMemo, ReactNode, useEffect } from 'react';

export type UserRef = {
    id: string;
    name: string;
    profileImg?: string;
};

export type PetInfo = {
    name: string;
    age?: number;
    breed?: string; // 견/묘 종
    mannerScore?: number;
};

export type BookingStatus =
    | 'selecting' // 날짜/시간/상대/동물 선택 중
    | 'ready' // (내부 계산용) 버튼 노출 조건 충족
    | 'requested' // 예약하기 버튼 클릭(요청 보냄)
    | 'confirmed' // 채팅을 통해 확정(장소/동네 포함)
    | 'cancelled';

export type BookingDraft = {
    love?: UserRef | null; // 예약을 거는 사용자(러브, 마이)
    buddy?: UserRef | null; // 예약을 받는 대상(버디)
    pet?: PetInfo | null; // 예약하려는 반려동물 정보
    date?: string | null; // YYYY-MM-DD (ISO 부분)
    time?: string | null; // 'HH:mm' 혹은 슬롯 id
    note?: string | null; // 선택 메모
};

export type BookingConfirm = {
    neighborhood?: string | null; // 동네
    place?: string | null; // 장소
    chatId?: string | null; // 채팅방 id
};

export type BookingState = {
    status: BookingStatus;
    draft: BookingDraft;
    confirm: BookingConfirm;
};

// --- Actions ---------------------------------------------------------------
export type BookingAction =
    | { type: 'SET_LOVE'; payload: UserRef | null }
    | { type: 'SET_BUDDY'; payload: UserRef | null }
    | { type: 'SET_PET'; payload: PetInfo | null }
    | { type: 'SET_DATE'; payload: string | null }
    | { type: 'SET_TIME'; payload: string | null }
    | { type: 'SET_NOTE'; payload: string | null }
    | { type: 'SET_CONFIRM'; payload: Partial<BookingConfirm> }
    | { type: 'SET_STATUS'; payload: BookingStatus }
    | { type: 'RESET' };

const initialState: BookingState = {
    status: 'selecting',
    draft: { love: null, buddy: null, pet: null, date: null, time: null, note: null },
    confirm: { neighborhood: null, place: null, chatId: null },
};

function reducer(state: BookingState, action: BookingAction): BookingState {
    switch (action.type) {
        case 'SET_LOVE':
            return { ...state, draft: { ...state.draft, love: action.payload } };
        case 'SET_BUDDY':
            return { ...state, draft: { ...state.draft, buddy: action.payload } };
        case 'SET_PET':
            return { ...state, draft: { ...state.draft, pet: action.payload } };
        case 'SET_DATE':
            return { ...state, draft: { ...state.draft, date: action.payload } };
        case 'SET_TIME':
            return { ...state, draft: { ...state.draft, time: action.payload } };
        case 'SET_NOTE':
            return { ...state, draft: { ...state.draft, note: action.payload } };
        case 'SET_CONFIRM':
            return { ...state, confirm: { ...state.confirm, ...action.payload } };
        case 'SET_STATUS':
            return { ...state, status: action.payload };
        case 'RESET':
            return initialState;
        default:
            return state;
    }
}

// --- Context Value ---------------------------------------------------------
const BookingContext = createContext<{
    state: BookingState;
    // setters
    setLove: (u: UserRef | null) => void;
    setBuddy: (u: UserRef | null) => void;
    setPet: (p: PetInfo | null) => void;
    setDate: (d: string | null) => void;
    setTime: (t: string | null) => void;
    setNote: (n: string | null) => void;
    setConfirm: (c: Partial<BookingConfirm>) => void;
    // transitions
    requestBooking: () => void; // 예약하기 버튼 → 요청 상태로
    confirmBooking: (c?: Partial<BookingConfirm>) => void; // 채팅에서 확정
    cancelBooking: () => void; // 취소
    reset: () => void;
    // derived
    isReady: boolean; // love/buddy/pet/date/time 충족 시 true
    timeDate: boolean;
} | null>(null);

const STORAGE_KEY = 'bookingDraft_v1';

export function BookingProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    // (선택) 로컬 퍼시스트 -----------------------------------------------------
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved) as BookingState;
                // 안전하게 필드 반영
                if (parsed?.draft) {
                    dispatch({ type: 'SET_LOVE', payload: parsed.draft.love ?? null });
                    dispatch({ type: 'SET_BUDDY', payload: parsed.draft.buddy ?? null });
                    dispatch({ type: 'SET_PET', payload: parsed.draft.pet ?? null });
                    dispatch({ type: 'SET_DATE', payload: parsed.draft.date ?? null });
                    dispatch({ type: 'SET_TIME', payload: parsed.draft.time ?? null });
                    dispatch({ type: 'SET_NOTE', payload: parsed.draft.note ?? null });
                }
                if (parsed?.confirm) {
                    dispatch({ type: 'SET_CONFIRM', payload: parsed.confirm });
                }
                if (parsed?.status) {
                    dispatch({ type: 'SET_STATUS', payload: parsed.status });
                }
            }
        } catch {}
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch {}
    }, [state]);

    const isReady = !!(
        state.draft.love &&
        state.draft.buddy &&
        state.draft.pet?.name &&
        state.draft.date &&
        state.draft.time
    );

    const timeDate = !!(state.draft.date && state.draft.time);

    const value = useMemo(
        () => ({
            state,
            setLove: (u: UserRef | null) => dispatch({ type: 'SET_LOVE', payload: u }),
            setBuddy: (u: UserRef | null) => dispatch({ type: 'SET_BUDDY', payload: u }),
            setPet: (p: PetInfo | null) => dispatch({ type: 'SET_PET', payload: p }),
            setDate: (d: string | null) => dispatch({ type: 'SET_DATE', payload: d }),
            setTime: (t: string | null) => dispatch({ type: 'SET_TIME', payload: t }),
            setNote: (n: string | null) => dispatch({ type: 'SET_NOTE', payload: n }),
            setConfirm: (c: Partial<BookingConfirm>) => dispatch({ type: 'SET_CONFIRM', payload: c }),

            requestBooking: () => dispatch({ type: 'SET_STATUS', payload: 'requested' }),
            confirmBooking: (c?: Partial<BookingConfirm>) => {
                if (c) dispatch({ type: 'SET_CONFIRM', payload: c });
                dispatch({ type: 'SET_STATUS', payload: 'confirmed' });
            },
            cancelBooking: () => dispatch({ type: 'SET_STATUS', payload: 'cancelled' }),
            reset: () => dispatch({ type: 'RESET' }),

            isReady,
            timeDate,
        }),
        [state, isReady, timeDate],
    );

    return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
    const ctx = useContext(BookingContext);
    if (!ctx) throw new Error('useBooking must be used within BookingProvider');
    return ctx;
}

// --- Helper: ISO 포맷 유틸 (선택) -----------------------------------------
export function toISODate(d: Date) {
    return d.toISOString().slice(0, 10); // YYYY-MM-DD
}
