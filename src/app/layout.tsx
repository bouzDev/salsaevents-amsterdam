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
    title: 'Cuban Salsa Events Amsterdam - Where to Dance Cuban Salsa This Week',
    description:
        'Discover the best Cuban salsa events, parties, workshops and festivals in Amsterdam and surrounding areas. Find authentic Cuban salsa, rueda de casino, and salsa cubana events every week.',
    keywords: [
        'Cuban salsa Amsterdam',
        'salsa cubana events',
        'rueda de casino Amsterdam',
        'Cuban salsa parties',
        'salsa cubana workshops',
        'Amsterdam Cuban salsa',
        'salsa events Netherlands',
        'Cuban salsa festivals',
        'salsa cubana social',
        'Amsterdam Latin dance',
    ],
    authors: [{ name: 'SalsaEvents Amsterdam' }],
    creator: 'SalsaEvents Amsterdam',
    publisher: 'SalsaEvents Amsterdam',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL('https://salsaevents-amsterdam.com'),
    icons: {
        icon: [
            {
                url: '/my-favicon/favicon.ico',
                sizes: '32x32',
                type: 'image/x-icon',
            },
            { url: '/my-favicon/favicon.svg', type: 'image/svg+xml' },
            {
                url: '/my-favicon/favicon-96x96.png',
                sizes: '96x96',
                type: 'image/png',
            },
        ],
        shortcut: '/my-favicon/favicon.ico',
        apple: '/my-favicon/apple-touch-icon.png',
    },
    manifest: '/my-favicon/site.webmanifest',
    appleWebApp: {
        title: 'Salsa Events',
        statusBarStyle: 'default',
        capable: true,
    },
    openGraph: {
        title: 'Cuban Salsa Events Amsterdam - Where to Dance Cuban Salsa This Week',
        description:
            'Discover the best Cuban salsa events, parties, workshops and festivals in Amsterdam and surrounding areas. Find authentic Cuban salsa every week!',
        url: 'https://salsaevents-amsterdam.com',
        siteName: 'SalsaEvents Amsterdam',
        images: [
            {
                url: '/salsaeventsamsterdam.jpg',
                width: 1200,
                height: 630,
                alt: 'Cuban Salsa Events Amsterdam - Dance Cuban Salsa This Week',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Cuban Salsa Events Amsterdam - Where to Dance Cuban Salsa This Week',
        description:
            'Discover the best Cuban salsa events, parties, workshops and festivals in Amsterdam and surrounding areas. Find authentic Cuban salsa every week!',
        images: ['/salsaeventsamsterdam.jpg'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            'index': true,
            'follow': true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: 'your-google-verification-code', // Add your Google Search Console verification
    },
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

                {/* Structured Data for Cuban Salsa Events */}
                <Script
                    id='structured-data'
                    type='application/ld+json'
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'WebSite',
                            'name': 'SalsaEvents Amsterdam',
                            'description':
                                'The best Cuban salsa events, parties, workshops and festivals in Amsterdam and surrounding areas',
                            'url': 'https://salsaevents-amsterdam.com',
                            'potentialAction': {
                                '@type': 'SearchAction',
                                'target': {
                                    '@type': 'EntryPoint',
                                    'urlTemplate':
                                        'https://salsaevents-amsterdam.com/?city={search_term_string}',
                                },
                                'query-input':
                                    'required name=search_term_string',
                            },
                            'mainEntity': {
                                '@type': 'ItemList',
                                'name': 'Cuban Salsa Events in Amsterdam',
                                'description':
                                    'Weekly updated list of Cuban salsa events, workshops, parties and festivals',
                                'itemListElement': [
                                    {
                                        '@type': 'Event',
                                        'name': 'Cuban Salsa Events Amsterdam',
                                        'description':
                                            'Regular Cuban salsa events, rueda de casino, and salsa cubana parties',
                                        'location': {
                                            '@type': 'Place',
                                            'name': 'Amsterdam',
                                            'address': {
                                                '@type': 'PostalAddress',
                                                'addressLocality': 'Amsterdam',
                                                'addressCountry': 'Netherlands',
                                            },
                                        },
                                        'organizer': {
                                            '@type': 'Organization',
                                            'name': 'SalsaEvents Amsterdam',
                                        },
                                    },
                                ],
                            },
                        }),
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
