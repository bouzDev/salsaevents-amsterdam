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
    title: 'SalsaEvents Amsterdam - Where are we dancing salsa this week?',
    description:
        'Discover the best salsa events, parties, workshops and festivals in Amsterdam and surrounding areas. From rueda to Cuban salsa, find your perfect dance night!',
    keywords:
        'salsa, Amsterdam, events, parties, workshops, rueda, Cuban salsa, latin dance',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
            >
                <Navbar />
                <main>{children}</main>
            </body>
        </html>
    );
}
