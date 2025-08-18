import Header from '@/common/header';
import { BookingProvider } from '@/context/useBookingContext';

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <BookingProvider>
                <Header />
                {children}
            </BookingProvider>
        </div>
    );
}
