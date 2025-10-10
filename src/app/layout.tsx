import type { Metadata } from 'next';

import './globals.css';
import { UserStateProvider } from '@/context/useUserContext';

import '@/styles/vendor/react-grid-layout.css';
import '@/styles/vendor/react-resizable.css';
import { AuthProvider } from './providers/AuthProvider';

export const metadata: Metadata = {
    title: 'soom',
    description: '기억을 남기고, 마음을 이어주는 동행자',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <div className={`max-w-[1280px]  m-auto`}>
                    <AuthProvider>
                        <UserStateProvider>{children}</UserStateProvider>
                    </AuthProvider>
                </div>
            </body>
        </html>
    );
}
