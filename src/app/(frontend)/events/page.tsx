import React from 'react';
import Link from 'next/link';
import EventCard from '../../../components/EventCard';
import { getSalsaEventsMain } from '../../../data/events.server';

export const metadata = {
    title: 'All Salsa Events | Salsa Events Amsterdam',
    description:
        'Discover all salsa events, workshops, festivals and social events in Amsterdam and surrounding areas.',
    openGraph: {
        title: 'All Salsa Events | Salsa Events Amsterdam',
        description:
            'Discover all salsa events, workshops, festivals and social events in Amsterdam and surrounding areas.',
    },
};

// Enable ISR for this page - regenerate every 60 seconds
export const revalidate = 60;

export default async function EventsPage() {
    const events = await getSalsaEventsMain();

    const upcomingEvents = events.filter(
        (event) => new Date(event.date) >= new Date()
    );

    const pastEvents = events.filter(
        (event) => new Date(event.date) < new Date()
    );

    return (
        <div className='min-h-screen bg-gray-50'>
            {/* Header */}
            <div className='bg-white shadow-sm'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                    <div className='text-center'>
                        <h1 className='text-4xl font-bold text-gray-900 mb-4'>
                            All Salsa Events
                        </h1>
                        <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
                            Discover all salsa events, workshops, festivals and
                            social events in Amsterdam and surrounding areas.
                            From beginner to advanced - there&apos;s something
                            for everyone!
                        </p>
                    </div>
                </div>
            </div>

            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                {/* Upcoming Events */}
                {upcomingEvents.length > 0 && (
                    <section className='mb-12'>
                        <div className='flex items-center justify-between mb-6'>
                            <h2 className='text-2xl font-bold text-gray-900'>
                                Upcoming Events ({upcomingEvents.length})
                            </h2>
                            <div className='text-sm text-gray-500'>
                                Click on an event for more details and RSVP!
                            </div>
                        </div>

                        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                            {upcomingEvents.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Past Events */}
                {pastEvents.length > 0 && (
                    <section>
                        <div className='flex items-center justify-between mb-6'>
                            <h2 className='text-2xl font-bold text-gray-900'>
                                Past Events ({pastEvents.length})
                            </h2>
                            <div className='text-sm text-gray-500'>
                                See what happened before
                            </div>
                        </div>

                        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                            {pastEvents.slice(0, 6).map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>

                        {pastEvents.length > 6 && (
                            <div className='text-center mt-6'>
                                <div className='text-gray-500'>
                                    And {pastEvents.length - 6} more past
                                    events...
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* No Events Message */}
                {events.length === 0 && (
                    <div className='text-center py-12'>
                        <div className='w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4'>
                            <span className='text-4xl text-gray-500 font-bold'>
                                ?
                            </span>
                        </div>
                        <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                            No events found
                        </h2>
                        <p className='text-gray-600 mb-6'>
                            There are currently no events available. Check back
                            soon!
                        </p>
                        <Link
                            href='/'
                            className='bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg'
                        >
                            Back to Home
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
