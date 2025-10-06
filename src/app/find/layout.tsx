import Header from '@/common/header';

import { AnimalAddStateProvider } from '@/context/useFindContext';

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <AnimalAddStateProvider>
                <Header />
                {children}
            </AnimalAddStateProvider>
        </div>
    );
}
