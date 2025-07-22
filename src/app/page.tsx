'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, Calendar, MapPin, Music, Heart } from 'lucide-react';
import EventCard from '@/components/EventCard';
import { salsaEvents } from '@/data/events';
import { SalsaEvent } from '@/types/event';

export default function Home() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedType, setSelectedType] = useState('');

    // Filter events
    const filteredEvents = useMemo(() => {
        return salsaEvents.filter((event) => {
            const matchesSearch =
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                event.venue.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCity =
                selectedCity === '' || event.city === selectedCity;
            const matchesType =
                selectedType === '' || event.type === selectedType;

            return matchesSearch && matchesCity && matchesType;
        });
    }, [searchTerm, selectedCity, selectedType]);

    // Get unique cities and types for filters
    const cities = [...new Set(salsaEvents.map((event) => event.city))];
    const types = [...new Set(salsaEvents.map((event) => event.type))];

    return (
        <div className='min-h-screen bg-gray-50'>
            {/* Hero Section */}
            <section className='bg-gradient-to-r from-red-600 via-orange-500 to-red-600 text-white'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
                    <div className='text-center'>
                        <h1 className='text-4xl md:text-6xl font-bold mb-4 animate-pulse'>
                            💃 SalsaEvents Amsterdam 🕺
                        </h1>
                        <p className='text-xl md:text-2xl mb-6 text-red-100'>
                            Waar dansen we salsa deze week?
                        </p>
                        <p className='text-lg mb-8 max-w-2xl mx-auto text-red-50'>
                            Ontdek de hotste salsa evenementen, parties,
                            workshops en festivals in Amsterdam en omgeving. Van
                            intieme socials tot grote festivals - vind jouw
                            perfecte dansavond!
                        </p>

                        {/* Quick Stats */}
                        <div className='flex justify-center items-center gap-8 text-sm'>
                            <div className='flex items-center gap-2'>
                                <Calendar className='w-5 h-5' />
                                <span>{salsaEvents.length} Events</span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <MapPin className='w-5 h-5' />
                                <span>{cities.length} Steden</span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <Music className='w-5 h-5' />
                                <span>{types.length} Types</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Search and Filters */}
            <section className='bg-white shadow-sm border-b border-gray-200'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
                    <div className='flex flex-col md:flex-row gap-4 items-center'>
                        {/* Search Bar */}
                        <div className='relative flex-1 max-w-md'>
                            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                            <input
                                type='text'
                                placeholder='Zoek events, venues, beschrijvingen...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent'
                            />
                        </div>

                        {/* Filters */}
                        <div className='flex gap-3'>
                            <select
                                value={selectedCity}
                                onChange={(e) =>
                                    setSelectedCity(e.target.value)
                                }
                                className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent'
                            >
                                <option value=''>Alle steden</option>
                                {cities.map((city) => (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={selectedType}
                                onChange={(e) =>
                                    setSelectedType(e.target.value)
                                }
                                className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent'
                            >
                                <option value=''>Alle types</option>
                                {types.map((type) => (
                                    <option key={type} value={type}>
                                        {type.charAt(0).toUpperCase() +
                                            type.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Results count */}
                    <div className='mt-4 text-gray-600 text-sm'>
                        {filteredEvents.length} event
                        {filteredEvents.length !== 1 ? 's' : ''} gevonden
                    </div>
                </div>
            </section>

            {/* Events Grid */}
            <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                {filteredEvents.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {filteredEvents.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                ) : (
                    <div className='text-center py-16'>
                        <Music className='mx-auto w-12 h-12 text-gray-400 mb-4' />
                        <h3 className='text-lg font-medium text-gray-900 mb-2'>
                            Geen events gevonden
                        </h3>
                        <p className='text-gray-500'>
                            Probeer je zoekopdracht of filters aan te passen.
                        </p>
                    </div>
                )}
            </section>

            {/* Footer */}
            <footer className='bg-gray-800 text-white py-8 mt-16'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='text-center'>
                        <div className='flex items-center justify-center gap-2 mb-4'>
                            <Music className='w-6 h-6' />
                            <span className='text-xl font-bold'>
                                SalsaEvents Amsterdam
                            </span>
                        </div>
                        <p className='text-gray-400 mb-4'>
                            Jouw gids voor de beste salsa evenementen in
                            Nederland
                        </p>
                        <p className='text-sm text-gray-500 flex items-center justify-center gap-1'>
                            Gemaakt met{' '}
                            <Heart className='w-4 h-4 text-red-500' /> voor de
                            salsa community
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
