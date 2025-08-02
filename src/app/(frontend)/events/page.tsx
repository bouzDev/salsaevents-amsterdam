import React from 'react';
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
                            From beginner to advanced - there's something for
                            everyone!
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

                {/* Event Types Filter Info */}
                <div className='bg-white rounded-lg shadow-sm p-6 mb-8'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                        Event Types
                    </h3>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                        <div className='text-center p-3 bg-red-50 rounded-lg'>
                            <div className='text-2xl mb-2'>🎉</div>
                            <div className='font-medium text-red-700'>
                                Party
                            </div>
                            <div className='text-xs text-red-600'>
                                Dance & socialize
                            </div>
                        </div>
                        <div className='text-center p-3 bg-blue-50 rounded-lg'>
                            <div className='text-2xl mb-2'>🎓</div>
                            <div className='font-medium text-blue-700'>
                                Workshop
                            </div>
                            <div className='text-xs text-blue-600'>
                                Learn & improve
                            </div>
                        </div>
                        <div className='text-center p-3 bg-purple-50 rounded-lg'>
                            <div className='text-2xl mb-2'>🎪</div>
                            <div className='font-medium text-purple-700'>
                                Festival
                            </div>
                            <div className='text-xs text-purple-600'>
                                Multi-day events
                            </div>
                        </div>
                        <div className='text-center p-3 bg-green-50 rounded-lg'>
                            <div className='text-2xl mb-2'>🤝</div>
                            <div className='font-medium text-green-700'>
                                Social
                            </div>
                            <div className='text-xs text-green-600'>
                                Meet & greet
                            </div>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className='bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-8 text-center text-white mb-8'>
                    <h3 className='text-2xl font-bold mb-4'>
                        Create an Account!
                    </h3>
                    <p className='text-lg mb-6 opacity-90'>
                        Register to RSVP for events, leave comments and get
                        personalized recommendations.
                    </p>
                    <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                        <a
                            href='/register'
                            className='bg-white text-indigo-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition-colors'
                        >
                            Create Account
                        </a>
                        <a
                            href='/login'
                            className='bg-transparent border-2 border-white text-white hover:bg-white hover:text-indigo-600 font-semibold py-3 px-6 rounded-lg transition-colors'
                        >
                            Login
                        </a>
                    </div>
                </div>

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
                        <div className='text-6xl mb-4'>🕺</div>
                        <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                            No events found
                        </h2>
                        <p className='text-gray-600 mb-6'>
                            There are currently no events available. Check back
                            soon!
                        </p>
                        <a
                            href='/'
                            className='bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg'
                        >
                            Back to Home
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
