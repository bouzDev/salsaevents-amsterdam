import HomeContent from '@/components/HomeContent';
import Script from 'next/script';
import { Suspense } from 'react';
import { getSalsaEventsServer } from '@/data/events.server';

export const revalidate = 3600; // Pre-render statisch en herbouw elk uur

export default async function Home() {
    // Load events server-side voor SEO
    const events = await getSalsaEventsServer();

    return (
        <>
            {/* Structured data voor betere SEO/AI indexatie */}
            <Script
                id='events-structured-data'
                type='application/ld+json'
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'ItemList',
                        'name': 'Cuban Salsa Events in Amsterdam',
                        'itemListElement': events.map((e, index) => ({
                            '@type': 'ListItem',
                            'position': index + 1,
                            'item': {
                                '@type': 'Event',
                                'name': e.title,
                                'description': e.description || undefined,
                                'startDate': e.date,
                                'eventStatus':
                                    'https://schema.org/EventScheduled',
                                'eventAttendanceMode':
                                    'https://schema.org/OfflineEventAttendanceMode',
                                'location': {
                                    '@type': 'Place',
                                    'name': e.venue,
                                    'address': {
                                        '@type': 'PostalAddress',
                                        'addressLocality': e.city,
                                        'addressCountry': 'Netherlands',
                                    },
                                },
                                'organizer': {
                                    '@type': 'Organization',
                                    'name': 'SalsaEvents Amsterdam',
                                },
                                'url':
                                    e.url ||
                                    'https://salsaevents-amsterdam.com',
                            },
                        })),
                    }),
                }}
            />
            <Suspense fallback={null}>
                <HomeContent initialEvents={events} />
            </Suspense>
        </>
    );
}
