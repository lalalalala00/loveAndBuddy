import { Suspense } from 'react';
import Index from './_components';

export default function Page(): React.ReactNode {
    return (
        <Suspense fallback={null}>
            <Index />
        </Suspense>
    );
}
