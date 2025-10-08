import { Suspense } from 'react';
import Index from './_components';

export const dynamic = 'force-dynamic';

export default function Page(): React.ReactNode {
    return (
        <Suspense>
            <Index />
        </Suspense>
    );
}
