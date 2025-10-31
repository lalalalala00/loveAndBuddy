import './globals.css';

import type { Metadata } from 'next';
import { UserStateProvider } from '@/context/useUserContext';
import { AuthProvider } from './providers/AuthProvider';
import { Analytics } from '@vercel/analytics/react';

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
                        <Analytics />
                    </AuthProvider>
                </div>
            </body>
        </html>
    );
}
