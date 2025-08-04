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
            process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000';

        // First try to find by slug
        let response = await fetch(
            `${baseUrl}/api/events?where[slug][equals]=${slugOrId}&limit=1`,
            {
                next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
            }
        );

        if (response.ok) {
            const data = await response.json();
            if (data.docs && data.docs.length > 0) {
                return data.docs[0];
            }
        }

        // If slug not found, try by ID (backwards compatibility)
        response = await fetch(`${baseUrl}/api/events/${slugOrId}`, {
            next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch event:', error);
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
    const resolvedParams = await params;
    const event = await getEvent(resolvedParams.id);

    if (!event) {
        return {
            title: 'Event not found',
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
}

// Generate static params for all events (for static generation)
export async function generateStaticParams() {
    try {
        const events = await getSalsaEventsMain();
        return events.map((event) => ({
            id: event.slug || event.id.toString(),
        }));
    } catch (error) {
        console.error('Error generating static params:', error);
        return []; // Return empty array if error, will fallback to ISR
    }
}
