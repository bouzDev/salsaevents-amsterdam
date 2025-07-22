'use client';

import { useMemo } from 'react';
import { MapPin, Clock, Music, Star } from 'lucide-react';
import { salsaEvents } from '@/data/events';

export default function LocatiesPage() {
    // Groepeer events per stad
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

    // Krijg unieke venues
    const venues = useMemo(() => {
        const venueMap: { [key: string]: {
            name: string;
            city: string;
            location: string;
            events: typeof salsaEvents;
        } } = {};
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
        <div className='min-h-screen bg-gray-50'>
            {/* Hero Section */}
            <section className='bg-gradient-to-r from-green-600 via-teal-500 to-blue-600 text-white'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
                    <div className='text-center'>
                        <h1 className='text-4xl md:text-6xl font-bold mb-4'>
                            📍 Salsa Locaties
                        </h1>
                        <p className='text-xl md:text-2xl mb-6 text-green-100'>
                            Ontdek waar de salsa magie gebeurt
                        </p>
                        <p className='text-lg mb-8 max-w-2xl mx-auto text-green-50'>
                            Van intieme cafés tot grote evenementenhallen - hier
                            vind je alle hotspots waar je kunt dansen in
                            Nederland.
                        </p>

                        {/* Stats */}
                        <div className='flex justify-center items-center gap-8 text-sm'>
                            <div className='flex items-center gap-2'>
                                <MapPin className='w-5 h-5' />
                                <span>
                                    {Object.keys(eventsByCity).length} Steden
                                </span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <Music className='w-5 h-5' />
                                <span>{venues.length} Venues</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cities Section */}
            <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
                <h2 className='text-3xl font-bold text-gray-900 mb-8 text-center'>
                    Steden
                </h2>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16'>
                    {Object.entries(eventsByCity).map(([city, cityEvents]) => (
                        <div
                            key={city}
                            className='bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow'
                        >
                            <div className='flex items-center gap-3 mb-4'>
                                <MapPin className='w-6 h-6 text-green-500' />
                                <h3 className='text-xl font-bold text-gray-900'>
                                    {city}
                                </h3>
                            </div>
                            <p className='text-gray-600 mb-4'>
                                {cityEvents.length} event
                                {cityEvents.length !== 1 ? 's' : ''} deze week
                            </p>
                            <div className='flex flex-wrap gap-2'>
                                {[
                                    ...new Set(cityEvents.map((e) => e.type)),
                                ].map((type) => (
                                    <span
                                        key={type}
                                        className='bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium'
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
            <section className='bg-white py-16'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <h2 className='text-3xl font-bold text-gray-900 mb-8 text-center'>
                        Populaire Venues
                    </h2>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {venues.map((venue, index) => (
                            <div
                                key={index}
                                className='bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors'
                            >
                                <div className='flex items-start justify-between mb-4'>
                                    <div>
                                        <h3 className='text-lg font-bold text-gray-900 mb-1'>
                                            {venue.name}
                                        </h3>
                                        <div className='flex items-center gap-1 text-gray-600 text-sm'>
                                            <MapPin className='w-4 h-4' />
                                            <span>{venue.city}</span>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-1 text-orange-500'>
                                        <Star className='w-4 h-4 fill-current' />
                                        <span className='text-sm font-medium'>
                                            {venue.events.length}
                                        </span>
                                    </div>
                                </div>

                                <p className='text-gray-600 text-sm mb-4'>
                                    {venue.events.length} aankomende event
                                    {venue.events.length !== 1 ? 's' : ''}
                                </p>

                                <div className='space-y-2'>
                                    {venue.events
                                        .slice(0, 3)
                                        .map((event) => (
                                            <div
                                                key={event.id}
                                                className='flex items-center gap-2 text-xs text-gray-500'
                                            >
                                                <Clock className='w-3 h-3' />
                                                <span>{event.title}</span>
                                            </div>
                                        ))}
                                    {venue.events.length > 3 && (
                                        <p className='text-xs text-gray-400'>
                                            +{venue.events.length - 3} meer...
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tips Section */}
            <section className='bg-gradient-to-r from-blue-50 to-green-50 py-16'>
                <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
                    <h2 className='text-3xl font-bold text-gray-900 mb-8'>
                        Tips voor een geweldige avond
                    </h2>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                        <div>
                            <Clock className='mx-auto w-8 h-8 text-blue-500 mb-4' />
                            <h3 className='font-bold text-gray-900 mb-2'>
                                Kom op tijd
                            </h3>
                            <p className='text-gray-600 text-sm'>
                                Veel events beginnen met een workshop. Perfect
                                om warm te draaien!
                            </p>
                        </div>
                        <div>
                            <Music className='mx-auto w-8 h-8 text-blue-500 mb-4' />
                            <h3 className='font-bold text-gray-900 mb-2'>
                                Luister naar de muziek
                            </h3>
                            <p className='text-gray-600 text-sm'>
                                Elke venue heeft zijn eigen stijl en voorkeur
                                voor verschillende salsa types.
                            </p>
                        </div>
                        <div>
                            <MapPin className='mx-auto w-8 h-8 text-blue-500 mb-4' />
                            <h3 className='font-bold text-gray-900 mb-2'>
                                Check de locatie
                            </h3>
                            <p className='text-gray-600 text-sm'>
                                Sommige events verhuizen of hebben speciale
                                toegangsinstructies.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
