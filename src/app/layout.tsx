import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
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

// GA4 ID - in production, use environment variables
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || 'G-Q9G97ZV7QT';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <head>
                {/* Google Analytics 4 (gtag.js) */}
                <Script
                    src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
                    strategy='afterInteractive'
                />
                <Script
                    id='google-analytics'
                    strategy='afterInteractive'
                    dangerouslySetInnerHTML={{
                        __html: `
                          window.dataLayer = window.dataLayer || [];
                          function gtag(){dataLayer.push(arguments);}
                          gtag('js', new Date());
                          gtag('config', '${GA4_ID}');
                        `,
                    }}
                />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
            >
                <Navbar />
                <main>{children}</main>
            </body>
        </html>
    );
}
