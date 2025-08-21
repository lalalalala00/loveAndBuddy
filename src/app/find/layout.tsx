import Header from '@/common/header';
import { BookingProvider } from '@/context/useBookingContext';
import { AnimalAddStateProvider } from '@/context/useFindContext';

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <BookingProvider>
                <AnimalAddStateProvider>
                    <Header />
                    {children}
                </AnimalAddStateProvider>
            </BookingProvider>
        </div>
    );
}
