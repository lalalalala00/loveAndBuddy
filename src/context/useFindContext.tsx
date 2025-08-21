'use client';

import { Animal } from '@/common/animal.card.vertical';
import React, { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type AddAnimalListContext = {
    animalAddList: Animal[];
    setAnimalAddList: React.Dispatch<React.SetStateAction<Animal[]>>;

    add: (a: Animal | Animal[]) => void;
    removeByName: (name: string) => void;
    toggleByName: (a: Animal) => void;
    clear: () => void;
};

const AnimalAddState = createContext<AddAnimalListContext | undefined>(undefined);

export function AnimalAddStateProvider({ children }: { children: ReactNode }) {
    const [animalAddList, setAnimalAddList] = useState<Animal[]>([]);

    const actions = useMemo<AddAnimalListContext>(() => {
        const add = (input: Animal | Animal[]) => {
            const arr = Array.isArray(input) ? input : [input];
            setAnimalAddList((prev) => {
                const seen = new Set(prev.map((v) => v.name));
                const merged = [...prev];
                for (const a of arr) {
                    if (!seen.has(a.name)) {
                        merged.push(a);
                        seen.add(a.name);
                    }
                }
                return merged;
            });
        };

        const removeByName = (name: string) => setAnimalAddList((prev) => prev.filter((v) => v.name !== name));

        const toggleByName = (a: Animal) =>
            setAnimalAddList((prev) => {
                const exists = prev.some((v) => v.name === a.name);
                return exists ? prev.filter((v) => v.name !== a.name) : [...prev, a];
            });

        const clear = () => setAnimalAddList([]);

        return {
            animalAddList,
            setAnimalAddList,
            add,
            removeByName,
            toggleByName,
            clear,
        };
    }, [animalAddList]);

    return <AnimalAddState.Provider value={actions}>{children}</AnimalAddState.Provider>;
}

export function useAnimalAddState() {
    const ctx = useContext(AnimalAddState);
    if (!ctx) {
        throw new Error('useAnimalAddState must be used within an AnimalAddStateProvider');
    }
    return ctx;
}
