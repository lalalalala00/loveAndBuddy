// app/find/write/love/page.tsx
import { Suspense } from 'react';
import WriteBuddy from '../../_components/write.buddy';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Page() {
    return (
        <Suspense fallback={<div className="p-6">Loading...</div>}>
            <WriteBuddy />
        </Suspense>
    );
}
