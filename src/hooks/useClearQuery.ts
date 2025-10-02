'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export function useClearQuery() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    return (keys: string[] = ['id']) => {
        const params = new URLSearchParams(searchParams?.toString() ?? '');
        keys.forEach((k) => params.delete(k));
        const q = params.toString();
        router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
    };
}
