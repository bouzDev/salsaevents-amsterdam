import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'SalsaEvents Amsterdam - Waar dansen we salsa deze week?',
    description:
        'Ontdek de beste salsa evenementen, parties, workshops en festivals in Amsterdam en omgeving. Van rueda tot Cuban salsa, vind jouw perfecte dansavond!',
    keywords:
        'salsa, Amsterdam, events, parties, workshops, rueda, Cuban salsa, latin dance',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='nl'>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen`}
            >
                <Navbar />
                <main>{children}</main>
            </body>
        </html>
    );
}
