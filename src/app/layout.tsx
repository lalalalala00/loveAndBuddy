import type { Metadata } from 'next';

import './globals.css';
import { UserStateProvider } from '@/context/useUserContext';

import 'react-grid-layout/css/styles.css';
import '@/styles/vendor/react-resizable.css';

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
