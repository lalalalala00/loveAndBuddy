import { useCallback, useEffect, useMemo, useState } from 'react';
import type { BuddyLite, DearLove } from '@/utils/data';

export function useBuddyCache(fetchById: (id: string) => Promise<BuddyLite | null>) {
    const [cache, setCache] = useState<Record<string, BuddyLite | null>>({});

    const get = useCallback(
        async (id: string) => {
            if (cache[id] !== undefined) return cache[id];
            const user = await fetchById(id).catch(() => null);
            setCache((prev) => ({ ...prev, [id]: user }));
            return user;
        },
        [cache, fetchById],
    );

    const prefetch = useCallback(
        async (ids: string[]) => {
            const idsToFetch = ids.filter((id) => cache[id] === undefined);
            if (!idsToFetch.length) return;
            let cancelled = false;
            const run = async () => {
                const results = await Promise.all(idsToFetch.map((id) => fetchById(id).catch(() => null)));
                if (cancelled) return;
                setCache((prev) => {
                    const next = { ...prev };
                    idsToFetch.forEach((id, i) => {
                        if (next[id] === undefined) next[id] = results[i];
                    });
                    return next;
                });
            };
            run();
            return () => {
                cancelled = true;
            };
        },
        [cache, fetchById],
    );

    return { cache, get, prefetch };
}

export function useDearLoveIndex(
    dearLoves: DearLove[] | undefined,
    getUserById: (id: string) => Promise<BuddyLite | null>,
) {
    const sortedDearLoves = useMemo(
        () => [...(dearLoves ?? [])].sort((a, b) => (b.date_at ?? '').localeCompare(a.date_at ?? '')),
        [dearLoves],
    );

    const uniqueBuddyIds = useMemo(() => {
        const ids = sortedDearLoves.map((d) => d.buddy_user_id).filter((v): v is string => !!v);
        return Array.from(new Set(ids));
    }, [sortedDearLoves]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const dearLove = sortedDearLoves[currentIndex] ?? null;
    const currentBuddyId = dearLove?.buddy_user_id ?? null;

    const { cache: buddyCache, get: getBuddy, prefetch } = useBuddyCache(getUserById);
    const [currentBuddy, setCurrentBuddy] = useState<BuddyLite | null>(null);

    useEffect(() => {
        setCurrentIndex(0);
    }, [sortedDearLoves.length]);

    useEffect(() => {
        if (!uniqueBuddyIds.length) return;
        const cleanup = prefetch(uniqueBuddyIds);
        return () => {
            if (typeof cleanup === 'function') cleanup();
        };
    }, [uniqueBuddyIds, prefetch]);

    useEffect(() => {
        let alive = true;
        (async () => {
            if (!currentBuddyId) {
                if (alive) setCurrentBuddy(null);
                return;
            }
            if (buddyCache[currentBuddyId] !== undefined) {
                if (alive) setCurrentBuddy(buddyCache[currentBuddyId]!);
                return;
            }
            const u = await getBuddy(currentBuddyId);
            if (alive) setCurrentBuddy(u);
        })();
        return () => {
            alive = false;
        };
    }, [currentBuddyId, buddyCache, getBuddy]);

    const selectByIndex = useCallback(
        (idx: number) => {
            setCurrentIndex((prev) => {
                if (idx < 0) return 0;
                if (idx >= sortedDearLoves.length) return sortedDearLoves.length - 1;
                return idx;
            });
        },
        [sortedDearLoves.length],
    );

    const selectByDear = useCallback(
        (target: DearLove) => {
            const idx = sortedDearLoves.findIndex((d) => d.id === target.id);
            if (idx >= 0) setCurrentIndex(idx);
        },
        [sortedDearLoves],
    );

    return {
        state: {
            sortedDearLoves,
            uniqueBuddyIds,
            dearLove,
            currentBuddyId,
            currentBuddy,
            currentIndex,
            buddyCache,
        },
        actions: {
            selectByIndex,
            selectByDear,
            prefetchBuddies: prefetch,
            getBuddy,
        },
    };
}
