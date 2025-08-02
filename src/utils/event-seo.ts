import { SalsaEvent } from '@/types/event';

export function generateEventStructuredData(event: SalsaEvent) {
    const baseUrl = 'https://salsaevents-amsterdam.com';

    return {
        '@context': 'https://schema.org',
        '@type': 'Event',
        'name': event.title,
        'description':
            event.description ||
            `${event.type} at ${event.venue} in ${event.city}`,
        'startDate': `${event.date}T${event.time?.split('-')[0] || '20:00'}`,
        'endDate': `${event.date}T${event.time?.split('-')[1] || '23:00'}`,
        'eventStatus': 'https://schema.org/EventScheduled',
        'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode',
        'location': {
            '@type': 'Place',
            'name': event.venue,
            'address': {
                '@type': 'PostalAddress',
                'addressLocality': event.city,
                'addressCountry': 'NL',
            },
        },
        'organizer': {
            '@type': 'Organization',
            'name': 'SalsaEvents Amsterdam',
            'url': baseUrl,
        },
        'performer': {
            '@type': 'Organization',
            'name': event.venue,
        },
        'offers': event.price
            ? {
                  '@type': 'Offer',
                  'price': event.price,
                  'priceCurrency': 'EUR',
                  'availability': 'https://schema.org/InStock',
                  'url': event.url || `${baseUrl}/event/${event.id}`,
              }
            : undefined,
        'url': event.url || `${baseUrl}/event/${event.id}`,
        'image': event.imageUrl || `${baseUrl}/salsaeventsamsterdam.jpg`,
        'keywords': [
            'Cuban salsa',
            'salsa cubana',
            event.type,
            event.city,
            ...event.tags,
        ].join(', '),
        'genre':
            event.type === 'workshop' ? 'Dance Workshop' : 'Cuban Salsa Dance',
        'doorTime': event.time?.split('-')[0] || '20:00',
        'isAccessibleForFree':
            !event.price ||
            event.price.toLowerCase().includes('free') ||
            event.price.toLowerCase().includes('gratis'),
    };
}

export function generateEventMetadata(event: SalsaEvent) {
    const baseUrl = 'https://salsaevents-amsterdam.com';

    return {
        title: `${event.title} - ${event.venue}, ${event.city} | SalsaEvents Amsterdam`,
        description:
            event.description ||
            `Join us for ${event.type} at ${event.venue} in ${event.city}. ${event.vibe || 'Authentic Cuban salsa experience.'}`,
        openGraph: {
            title: event.title,
            description: event.description || `${event.type} at ${event.venue}`,
            images: [
                {
                    url:
                        event.imageUrl || `${baseUrl}/salsaeventsamsterdam.jpg`,
                    width: 1200,
                    height: 630,
                    alt: `${event.title} - Cuban Salsa Event in ${event.city}`,
                },
            ],
            type: 'website',
            locale: 'en_US',
            siteName: 'SalsaEvents Amsterdam',
        },
        twitter: {
            card: 'summary_large_image',
            title: event.title,
            description: event.description || `${event.type} at ${event.venue}`,
            images: [event.imageUrl || `${baseUrl}/salsaeventsamsterdam.jpg`],
        },
        keywords: [
            'Cuban salsa',
            'salsa cubana',
            event.type,
            event.city,
            event.venue,
            ...event.tags,
        ],
    };
}
