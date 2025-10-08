import { Suspense } from 'react';
import WriteLove from '../../_components/write.love';

export const dynamic = 'force-dynamic';

export default function Page(): React.ReactNode {
    return (
        <Suspense>
            <WriteLove />
        </Suspense>
    );
}
