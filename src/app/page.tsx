'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import EventCard from '@/components/EventCard';
import { salsaEvents } from '@/data/events';

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
        <div className='bg-white min-h-screen'>
            {/* Hero Section */}
            <section className='max-w-4xl mx-auto px-6 pt-16 pb-12 text-center'>
                <h1 className='text-display text-gray-900 mb-4'>
                    Where are we dancing salsa this week?
                </h1>
                <p className='text-body text-gray-600 max-w-2xl mx-auto mb-8'>
                    Discover the best salsa events, parties, workshops and
                    festivals in Amsterdam and surrounding areas.
                </p>

                {/* Quick Stats */}
                <div className='flex justify-center items-center gap-8 text-caption text-gray-500 mb-12'>
                    <span>{salsaEvents.length} Events</span>
                    <span>•</span>
                    <span>{cities.length} Cities</span>
                    <span>•</span>
                    <span>{types.length} Types</span>
                </div>
            </section>

            {/* Search and Filters */}
            <section className='max-w-4xl mx-auto px-6 mb-16'>
                <div className='bg-gray-50 rounded-xl p-6'>
                    <div className='flex flex-col space-y-4'>
                        {/* Search Bar */}
                        <div className='relative'>
                            <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                            <input
                                type='text'
                                placeholder='Search events, venues, descriptions...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className='w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                            />
                        </div>

                        {/* Filters */}
                        <div className='flex gap-3'>
                            <select
                                value={selectedCity}
                                onChange={(e) =>
                                    setSelectedCity(e.target.value)
                                }
                                className='flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            >
                                <option value=''>All cities</option>
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
                                className='flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            >
                                <option value=''>All types</option>
                                {types.map((type) => (
                                    <option key={type} value={type}>
                                        {type.charAt(0).toUpperCase() +
                                            type.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Results count */}
                        <p className='text-caption text-gray-500'>
                            {filteredEvents.length} event
                            {filteredEvents.length !== 1 ? 's' : ''} found
                        </p>
                    </div>
                </div>
            </section>

            {/* Events List */}
            <section className='max-w-4xl mx-auto px-6 pb-16'>
                {filteredEvents.length > 0 ? (
                    <div className='space-y-4'>
                        {filteredEvents.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                ) : (
                    <div className='text-center py-16'>
                        <h3 className='text-title text-gray-900 mb-2'>
                            No events found
                        </h3>
                        <p className='text-body text-gray-600 mb-6'>
                            Try adjusting your search or filters to find more
                            results.
                        </p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCity('');
                                setSelectedType('');
                            }}
                            className='btn-primary px-6 py-3 text-sm'
                        >
                            Reset filters
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
}
