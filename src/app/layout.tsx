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

// GTM ID - in production, use environment variable
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-NPW3P6K6';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <head>
                {/* Google Tag Manager */}
                <Script
                    id='google-tag-manager'
                    strategy='afterInteractive'
                    dangerouslySetInnerHTML={{
                        __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
                    }}
                />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
            >
                {/* Google Tag Manager (noscript) */}
                <noscript>
                    <iframe
                        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                        height='0'
                        width='0'
                        style={{ display: 'none', visibility: 'hidden' }}
                    />
                </noscript>

                <Navbar />
                <main>{children}</main>
            </body>
        </html>
    );
}
