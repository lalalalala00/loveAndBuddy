import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { UserStateProvider } from '@/context/useUserContext';
import MainLayout from '@/common/Layout';

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
                <div className={`antialiased`}>
                    <UserStateProvider>{children}</UserStateProvider>
                </div>
            </body>
        </html>
    );
}
