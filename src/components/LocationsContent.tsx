'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Clock, Music, Star, Building2 } from 'lucide-react';
import { SalsaEvent } from '@/types/event';

interface LocationsContentProps {
    initialEvents: SalsaEvent[];
}

export default function LocationsContent({
    initialEvents,
}: LocationsContentProps) {
    const router = useRouter();

    // Helper function to check if event is upcoming
    const isEventUpcoming = (startDate: string, endDate?: string): boolean => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of day

        // For single day events, check if start date is today or later
        if (!endDate) {
            const eventDate = new Date(startDate);
            return eventDate >= today;
        }

        // For multi-day events, check if end date is today or later
        const eventEndDate = new Date(endDate);
        return eventEndDate >= today;
    };

    // Helper function to get all dates for an event (for date picker)
    const getEventDates = (startDate: string, endDate?: string): string[] => {
        if (!endDate) {
            return [startDate];
        }

        const dates: string[] = [];
        const start = new Date(startDate);
        const end = new Date(endDate);

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            dates.push(d.toISOString().split('T')[0]);
        }

        return dates;
    };

    // Get only upcoming events
    const upcomingEvents = useMemo(() => {
        return initialEvents.filter((event) =>
            isEventUpcoming(event.startDate, event.endDate)
        );
    }, [initialEvents]);

    // Group upcoming events by city
    const eventsByCity = useMemo(() => {
        const cities: { [key: string]: typeof initialEvents } = {};
        upcomingEvents.forEach((event) => {
            if (!cities[event.city]) {
                cities[event.city] = [];
            }
            cities[event.city].push(event);
        });
        return cities;
    }, [upcomingEvents]);

    // Get unique venues from upcoming events
    const venues = useMemo(() => {
        const venueMap: {
            [key: string]: {
                name: string;
                city: string;
                eventCount: number;
                types: string[];
                upcomingEvents: typeof initialEvents;
            };
        } = {};

        upcomingEvents.forEach((event) => {
            const venueKey = `${event.venue}-${event.city}`;
            if (!venueMap[venueKey]) {
                venueMap[venueKey] = {
                    name: event.venue,
                    city: event.city,
                    eventCount: 0,
                    types: [],
                    upcomingEvents: [],
                };
            }
            venueMap[venueKey].eventCount++;
            venueMap[venueKey].upcomingEvents.push(event);
            if (!venueMap[venueKey].types.includes(event.type)) {
                venueMap[venueKey].types.push(event.type);
            }
        });

        return Object.values(venueMap).sort(
            (a, b) => b.eventCount - a.eventCount
        );
    }, [upcomingEvents]);

    const handleCityClick = (city: string) => {
        router.push(`/?city=${encodeURIComponent(city)}`);
    };

    return (
        <div className='bg-white min-h-screen'>
            {/* Locations Hero Section */}
            <section className='py-24'>
                <div className='max-w-5xl mx-auto px-6 text-center'>
                    <div className='inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-8'>
                        Explore & Discover
                    </div>

                    <h1 className='text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight'>
                        Cuban Salsa
                        <br />
                        <span className='text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600'>
                            Locations
                        </span>
                    </h1>

                    <p className='text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed'>
                        Discover the best venues and cities for Cuban salsa in
                        Amsterdam and beyond. Find your perfect spot for
                        authentic Cuban salsa experiences.
                    </p>

                    {/* Location Stats */}
                    <div className='flex justify-center items-center gap-12 text-gray-500'>
                        <div className='text-center'>
                            <div className='text-3xl font-bold text-emerald-600 mb-1'>
                                {venues.length}
                            </div>
                            <div className='text-sm font-medium'>Venues</div>
                        </div>
                        <div className='w-px h-12 bg-gray-200'></div>
                        <div className='text-center'>
                            <div className='text-3xl font-bold text-emerald-600 mb-1'>
                                {Object.keys(eventsByCity).length}
                            </div>
                            <div className='text-sm font-medium'>Cities</div>
                        </div>
                        <div className='w-px h-12 bg-gray-200'></div>
                        <div className='text-center'>
                            <div className='text-3xl font-bold text-emerald-600 mb-1'>
                                {upcomingEvents.length}
                            </div>
                            <div className='text-sm font-medium'>Events</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cities Section */}
            <section className='max-w-6xl mx-auto px-6 py-20'>
                <div className='text-center mb-16'>
                    <h2 className='text-4xl font-bold text-gray-900 mb-4 tracking-tight'>
                        Cities with Cuban Salsa
                    </h2>
                    <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
                        Explore vibrant Cuban salsa scenes across different
                        cities
                    </p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {Object.entries(eventsByCity).map(([city, events]) => (
                        <div
                            key={city}
                            onClick={() => handleCityClick(city)}
                            className='group bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 cursor-pointer hover:shadow-xl hover:border-emerald-300/50 transition-all duration-300 hover:scale-105'
                        >
                            <div className='flex items-center justify-between mb-4'>
                                <h3 className='text-xl font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors'>
                                    {city}
                                </h3>
                                <div className='p-2 bg-emerald-100 rounded-full group-hover:bg-emerald-200 transition-colors'>
                                    <MapPin className='w-5 h-5 text-emerald-600' />
                                </div>
                            </div>
                            <div className='space-y-3'>
                                <p className='text-gray-600'>
                                    {events.length} upcoming event
                                    {events.length !== 1 ? 's' : ''}
                                </p>
                                <div className='flex flex-wrap gap-2'>
                                    {[
                                        ...new Set(events.map((e) => e.type)),
                                    ].map((type) => (
                                        <span
                                            key={type}
                                            className='text-xs text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full font-medium'
                                        >
                                            {type.charAt(0).toUpperCase() +
                                                type.slice(1)}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Popular Venues Section */}
            <section className='bg-gray-50/50 py-20'>
                <div className='max-w-6xl mx-auto px-6'>
                    <div className='text-center mb-16'>
                        <h2 className='text-4xl font-bold text-gray-900 mb-4 tracking-tight'>
                            Popular Venues
                        </h2>
                        <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
                            The most active spots for Cuban salsa in the
                            community
                        </p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        {venues.slice(0, 8).map((venue, index) => (
                            <div
                                key={index}
                                className='bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 hover:shadow-xl hover:border-gray-300/50 transition-all duration-300'
                            >
                                <div className='flex items-start justify-between mb-4'>
                                    <div className='flex items-start gap-3'>
                                        <div className='p-2 bg-gray-100 rounded-full'>
                                            <Building2 className='w-5 h-5 text-gray-600' />
                                        </div>
                                        <div>
                                            <h3 className='text-xl font-semibold text-gray-900 mb-1'>
                                                {venue.name}
                                            </h3>
                                            <p className='text-gray-600 flex items-center gap-1'>
                                                <MapPin className='w-4 h-4' />
                                                {venue.city}
                                            </p>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full'>
                                        <Star className='w-4 h-4 text-yellow-500 fill-current' />
                                        <span className='text-sm font-medium text-yellow-700'>
                                            {venue.eventCount}
                                        </span>
                                    </div>
                                </div>

                                <div className='space-y-4'>
                                    <p className='text-gray-600'>
                                        {venue.eventCount} upcoming event
                                        {venue.eventCount !== 1 ? 's' : ''}
                                    </p>

                                    <div className='flex flex-wrap gap-2'>
                                        {venue.types.map((type) => (
                                            <span
                                                key={type}
                                                className='text-xs text-gray-700 bg-gray-100/80 px-3 py-1 rounded-full font-medium'
                                            >
                                                {type.charAt(0).toUpperCase() +
                                                    type.slice(1)}
                                            </span>
                                        ))}
                                    </div>

                                    <div className='pt-3 border-t border-gray-100'>
                                        <p className='text-sm font-medium text-gray-700 mb-2'>
                                            Upcoming Events:
                                        </p>
                                        <div className='space-y-1'>
                                            {venue.upcomingEvents
                                                .slice(0, 2)
                                                .map((event) => (
                                                    <div
                                                        key={event.id}
                                                        className='text-sm text-gray-600 flex items-center justify-between'
                                                    >
                                                        <span className='truncate mr-2'>
                                                            {event.title}
                                                        </span>
                                                        <span className='text-xs text-gray-500 flex-shrink-0'>
                                                            {new Date(
                                                                event.date
                                                            ).toLocaleDateString(
                                                                'en-US',
                                                                {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                }
                                                            )}
                                                        </span>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className='max-w-6xl mx-auto px-6 py-24'>
                <div className='bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl overflow-hidden relative'>
                    <div className='absolute inset-0 bg-black/10'></div>

                    <div className='relative px-8 py-16 text-center'>
                        <h2 className='text-4xl font-bold text-white mb-6 tracking-tight'>
                            Find Your Perfect Salsa Spot
                        </h2>
                        <p className='text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed'>
                            Every venue has its own unique atmosphere and
                            community. Explore them all and discover your
                            favorite place to dance.
                        </p>

                        <button
                            onClick={() => router.push('/')}
                            className='bg-white text-emerald-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-full transition-all duration-200 hover:scale-105 active:scale-95'
                        >
                            View All Events
                        </button>
                    </div>

                    {/* Decorative elements */}
                    <div className='absolute top-8 right-8 w-24 h-24 bg-white/10 rounded-full blur-xl'></div>
                    <div className='absolute bottom-8 left-8 w-32 h-32 bg-white/10 rounded-full blur-xl'></div>
                </div>
            </section>
        </div>
    );
}
