import React from 'react';
import EventDetail from '../../../../components/events/EventDetail';
import { notFound } from 'next/navigation';
import { getSalsaEventsMain } from '../../../../data/events.server';

interface EventDetailPageProps {
    params: {
        id: string;
    };
}

async function getEvent(slugOrId: string) {
    try {
        const baseUrl =
            process.env.PAYLOAD_PUBLIC_SERVER_URL || process.env.VERCEL_URL
                ? `https://${process.env.VERCEL_URL}`
                : 'http://localhost:3000';

        console.log(`Fetching event: ${slugOrId} from ${baseUrl}`);

        // First try to find by slug
        let response = await fetch(
            `${baseUrl}/api/events?where[slug][equals]=${slugOrId}&limit=1`,
            {
                next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
            }
        );

        console.log(`Slug search response status: ${response.status}`);

        if (response.ok) {
            const data = await response.json();
            console.log(`Slug search found ${data.docs?.length || 0} events`);
            if (data.docs && data.docs.length > 0) {
                return data.docs[0];
            }
        }

        // If slug not found, try by ID (backwards compatibility)
        console.log(`Trying ID search for: ${slugOrId}`);
        response = await fetch(`${baseUrl}/api/events/${slugOrId}`, {
            next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
        });

        console.log(`ID search response status: ${response.status}`);

        if (!response.ok) {
            console.log(`No event found for ${slugOrId}`);
            return null;
        }

        const data = await response.json();
        console.log(`Found event by ID: ${data.title || 'Unknown'}`);
        return data;
    } catch (error) {
        console.error('Failed to fetch event via API:', error);

        // Fallback: try to get event directly from server data
        try {
            console.log('Attempting server-side fallback...');
            const events = await getSalsaEventsMain();
            const event = events.find(
                (e) =>
                    e.slug === slugOrId ||
                    e.id === slugOrId ||
                    e.id.toString() === slugOrId
            );

            if (event) {
                console.log(`Found event via server fallback: ${event.title}`);
                return event;
            }
        } catch (fallbackError) {
            console.error('Server fallback also failed:', fallbackError);
        }

        return null;
    }
}

export default async function EventDetailPage({
    params,
}: EventDetailPageProps) {
    const resolvedParams = await params;
    const event = await getEvent(resolvedParams.id);

    if (!event) {
        notFound();
    }

    return <EventDetail event={event} />;
}

export async function generateMetadata({ params }: EventDetailPageProps) {
    try {
        const resolvedParams = await params;
        const event = await getEvent(resolvedParams.id);

        if (!event) {
            return {
                title: 'Event not found | Salsa Events Amsterdam',
                description: 'The requested event could not be found.',
            };
        }

        return {
            title: `${event.title} | Salsa Events Amsterdam`,
            description:
                event.description ||
                `Join us for ${event.title} at ${event.venue} in ${event.city}`,
            openGraph: {
                title: event.title,
                description:
                    event.description ||
                    `Join us for ${event.title} at ${event.venue} in ${event.city}`,
                images: event.imageUrl ? [event.imageUrl] : [],
            },
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: 'Event | Salsa Events Amsterdam',
            description: 'Salsa event in Amsterdam',
        };
    }
}

// Allow dynamic params when static generation fails
export const dynamicParams = true;

// Generate static params for all events (for static generation)
export async function generateStaticParams() {
    try {
        // Skip static generation during build if no database access
        if (
            process.env.NODE_ENV === 'production' &&
            !process.env.DATABASE_URI
        ) {
            console.log(
                'Skipping static generation - no database access during build'
            );
            return [];
        }

        const events = await getSalsaEventsMain();
        console.log(`Generating static params for ${events.length} events`);

        return events.map((event) => ({
            id: event.slug || event.id.toString(),
        }));
    } catch (error) {
        console.error('Error generating static params:', error);
        return []; // Return empty array if error, will fallback to dynamic rendering
    }
}
