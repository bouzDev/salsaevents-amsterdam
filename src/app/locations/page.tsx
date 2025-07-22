'use client';

import { useMemo } from 'react';
import { MapPin, Clock, Music } from 'lucide-react';
import { salsaEvents } from '@/data/events';

export default function LocationsPage() {
    // Group events by city
    const eventsByCity = useMemo(() => {
        const cities: { [key: string]: typeof salsaEvents } = {};
        salsaEvents.forEach((event) => {
            if (!cities[event.city]) {
                cities[event.city] = [];
            }
            cities[event.city].push(event);
        });
        return cities;
    }, []);

    // Get unique venues
    const venues = useMemo(() => {
        const venueMap: {
            [key: string]: {
                name: string;
                city: string;
                location: string;
                events: typeof salsaEvents;
            };
        } = {};
        salsaEvents.forEach((event) => {
            const key = `${event.venue}-${event.city}`;
            if (!venueMap[key]) {
                venueMap[key] = {
                    name: event.venue,
                    city: event.city,
                    location: event.location,
                    events: [],
                };
            }
            venueMap[key].events.push(event);
        });
        return Object.values(venueMap);
    }, []);

    return (
        <div className='bg-white min-h-screen'>
            {/* Hero Section */}
            <section className='max-w-4xl mx-auto px-6 pt-16 pb-12 text-center'>
                <h1 className='text-display text-gray-900 mb-4'>
                    Salsa Locations
                </h1>
                <p className='text-body text-gray-600 max-w-2xl mx-auto mb-8'>
                    From intimate cafés to grand event halls - here you&apos;ll find
                    all the hotspots where you can dance in the Netherlands.
                </p>

                {/* Stats */}
                <div className='flex justify-center items-center gap-8 text-caption text-gray-500 mb-12'>
                    <div className='flex items-center gap-2'>
                        <MapPin className='w-4 h-4' />
                        <span>{Object.keys(eventsByCity).length} Cities</span>
                    </div>
                    <span>•</span>
                    <div className='flex items-center gap-2'>
                        <Music className='w-4 h-4' />
                        <span>{venues.length} Venues</span>
                    </div>
                </div>
            </section>

            {/* Cities Section */}
            <section className='max-w-4xl mx-auto px-6 pb-12'>
                <h2 className='text-headline text-gray-900 mb-8 text-center'>
                    Cities
                </h2>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16'>
                    {Object.entries(eventsByCity).map(([city, cityEvents]) => (
                        <div key={city} className='card p-6'>
                            <div className='flex items-center gap-3 mb-3'>
                                <MapPin className='w-5 h-5 text-green-500' />
                                <h3 className='text-title text-gray-900'>
                                    {city}
                                </h3>
                            </div>
                            <p className='text-body text-gray-600 mb-3'>
                                {cityEvents.length} event
                                {cityEvents.length !== 1 ? 's' : ''} this week
                            </p>
                            <div className='flex flex-wrap gap-2'>
                                {[
                                    ...new Set(cityEvents.map((e) => e.type)),
                                ].map((type) => (
                                    <span
                                        key={type}
                                        className='text-xs text-green-600 bg-green-50 border border-green-200 px-2 py-1 rounded-md'
                                    >
                                        {type}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Venues Section */}
            <section className='bg-gray-50 py-16'>
                <div className='max-w-4xl mx-auto px-6'>
                    <h2 className='text-headline text-gray-900 mb-8 text-center'>
                        Popular Venues
                    </h2>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {venues.map((venue, index) => (
                            <div
                                key={index}
                                className='bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-sm transition-all'
                            >
                                <div className='flex items-start justify-between mb-4'>
                                    <div>
                                        <h3 className='text-title text-gray-900 mb-1'>
                                            {venue.name}
                                        </h3>
                                        <div className='flex items-center gap-1 text-caption text-gray-500'>
                                            <MapPin className='w-4 h-4' />
                                            <span>{venue.city}</span>
                                        </div>
                                    </div>
                                    <div className='text-blue-500 bg-blue-50 border border-blue-200 rounded-md px-2 py-1'>
                                        <span className='text-xs font-medium'>
                                            {venue.events.length}
                                        </span>
                                    </div>
                                </div>

                                <p className='text-caption text-gray-600 mb-4'>
                                    {venue.events.length} upcoming event
                                    {venue.events.length !== 1 ? 's' : ''}
                                </p>

                                <div className='space-y-2'>
                                    {venue.events.slice(0, 3).map((event) => (
                                        <div
                                            key={event.id}
                                            className='flex items-center gap-2 text-caption text-gray-500'
                                        >
                                            <Clock className='w-3 h-3' />
                                            <span>{event.title}</span>
                                        </div>
                                    ))}
                                    {venue.events.length > 3 && (
                                        <p className='text-caption text-gray-400'>
                                            +{venue.events.length - 3} more...
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tips Section */}
            <section className='py-16'>
                <div className='max-w-4xl mx-auto px-6 text-center'>
                    <h2 className='text-headline text-gray-900 mb-8'>
                        Tips for a great night
                    </h2>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                        <div>
                            <Clock className='mx-auto w-8 h-8 text-blue-500 mb-4' />
                            <h3 className='text-title text-gray-900 mb-2'>
                                Arrive on time
                            </h3>
                            <p className='text-body text-gray-600'>
                                Many events start with a workshop. Perfect to
                                warm up!
                            </p>
                        </div>
                        <div>
                            <Music className='mx-auto w-8 h-8 text-blue-500 mb-4' />
                            <h3 className='text-title text-gray-900 mb-2'>
                                Listen to the music
                            </h3>
                            <p className='text-body text-gray-600'>
                                Each venue has its own style and preference for
                                different salsa types.
                            </p>
                        </div>
                        <div>
                            <MapPin className='mx-auto w-8 h-8 text-blue-500 mb-4' />
                            <h3 className='text-title text-gray-900 mb-2'>
                                Check the location
                            </h3>
                            <p className='text-body text-gray-600'>
                                Some events move or have special access
                                instructions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
