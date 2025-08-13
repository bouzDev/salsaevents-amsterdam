import HomeContent from '@/components/HomeContent';
import { getSalsaEventsServer } from '@/data/events.server';

export const revalidate = 3600; // Pre-render statisch en herbouw elk uur

export default async function Home({
    searchParams,
}: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    // Read query server-side (werkt met SSR/SSG en client navigations)
    const sp = searchParams ? await searchParams : undefined;
    const cityFromUrl = (() => {
        const value = sp?.city;
        if (typeof value === 'string') return value;
        if (Array.isArray(value)) return value[0];
        return undefined;
    })();

    // Load events server-side voor SEO
    const events = await getSalsaEventsServer();

    return (
        <>
            {/* Structured data (SSR inline, meerdere Events via @graph) */}
            <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@graph': events.map((e) => {
                            const startTime = (e.time || '')
                                .split('-')[0]
                                ?.trim();
                            const startDate = startTime
                                ? `${e.date}T${startTime}`
                                : e.date;
                            const endTime = (e.time || '').includes('-')
                                ? (e.time || '').split('-')[1]?.trim()
                                : undefined;
                            const endDate = endTime
                                ? `${e.date}T${endTime}`
                                : undefined;
                            const isFree =
                                Array.isArray(e.tags) &&
                                e.tags.some((t) => t.toLowerCase() === 'free');
                            const baseUrl = 'https://salsaevents-amsterdam.com';
                            const image = `${baseUrl}/salsaeventsamsterdam.jpg`;
                            return {
                                '@type': 'Event',
                                'name': e.title,
                                'description': e.description || undefined,
                                startDate,
                                endDate,
                                'eventStatus':
                                    'https://schema.org/EventScheduled',
                                'eventAttendanceMode':
                                    'https://schema.org/OfflineEventAttendanceMode',
                                'isAccessibleForFree': isFree || undefined,
                                image,
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
                                    'url': baseUrl,
                                },
                                'offers': isFree
                                    ? {
                                          '@type': 'Offer',
                                          'price': '0',
                                          'priceCurrency': 'EUR',
                                          'availability':
                                              'https://schema.org/InStock',
                                          'url': e.url || baseUrl,
                                      }
                                    : undefined,
                                'url': e.url || baseUrl,
                            };
                        }),
                    }),
                }}
            />
            <HomeContent initialEvents={events} initialCity={cityFromUrl} />
        </>
    );
}
