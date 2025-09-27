'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import EventCard from '@/components/EventCard';
import DatePicker from '@/components/DatePicker';
import { SalsaEvent } from '@/types/event';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';

interface WorkshopsContentProps {
    initialEvents: SalsaEvent[];
}

export default function WorkshopsContent({
    initialEvents,
}: WorkshopsContentProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [workshopEvents] = useState<SalsaEvent[]>(initialEvents);

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

    // Helper function to check if a specific date falls within an event's date range
    const isDateInEventRange = (
        eventStartDate: string,
        eventEndDate: string | undefined,
        targetDate: string
    ): boolean => {
        const target = new Date(targetDate);
        const start = new Date(eventStartDate);

        if (!eventEndDate) {
            // Single day event - exact match
            return eventStartDate === targetDate;
        }

        const end = new Date(eventEndDate);
        return target >= start && target <= end;
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

    // Filter events - only show upcoming workshop events
    const filteredEvents = useMemo(() => {
        return workshopEvents.filter((event) => {
            // First check if event is upcoming
            if (!isEventUpcoming(event.startDate, event.endDate)) {
                return false;
            }

            const matchesSearch =
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                event.venue.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCity =
                selectedCity === '' || event.city === selectedCity;
            const matchesDate =
                selectedDate === '' ||
                isDateInEventRange(
                    event.startDate,
                    event.endDate,
                    selectedDate
                );

            return matchesSearch && matchesCity && matchesDate;
        });
    }, [searchTerm, selectedCity, selectedDate, workshopEvents]);

    // Get unique cities and dates for filters (only from upcoming workshop events)
    const upcomingEvents = useMemo(() => {
        return workshopEvents.filter((event) =>
            isEventUpcoming(event.startDate, event.endDate)
        );
    }, [workshopEvents]);

    const cities = [...new Set(upcomingEvents.map((event) => event.city))];

    // Get all individual dates from all events (including date ranges)
    const dates = useMemo(() => {
        const allDates = upcomingEvents.flatMap((event) =>
            getEventDates(event.startDate, event.endDate)
        );
        return [...new Set(allDates)].sort();
    }, [upcomingEvents]);

    return (
        <div className='bg-white min-h-screen'>
            {/* Workshops Hero Section */}
            <section className='py-24'>
                <div className='max-w-5xl mx-auto px-6 text-center'>
                    <div className='inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-8'>
                        Learn & Master
                    </div>

                    <h1 className='text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight'>
                        Cuban Salsa
                        <br />
                        <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600'>
                            Workshops
                        </span>
                    </h1>

                    <p className='text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed'>
                        Master authentic Cuban salsa, rueda de casino, and salsa
                        cubana with experienced instructors. From beginner
                        basics to advanced techniques.
                    </p>

                    {/* Workshop Stats */}
                    <div className='flex justify-center items-center gap-12 text-gray-500'>
                        <div className='text-center'>
                            <div className='text-3xl font-bold text-blue-600 mb-1'>
                                {upcomingEvents.length}
                            </div>
                            <div className='text-sm font-medium'>Workshops</div>
                        </div>
                        <div className='w-px h-12 bg-gray-200'></div>
                        <div className='text-center'>
                            <div className='text-3xl font-bold text-blue-600 mb-1'>
                                {cities.length}
                            </div>
                            <div className='text-sm font-medium'>Cities</div>
                        </div>
                        <div className='w-px h-12 bg-gray-200'></div>
                        <div className='text-center'>
                            <div className='text-3xl font-bold text-blue-600 mb-1'>
                                All
                            </div>
                            <div className='text-sm font-medium'>Levels</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Apple-style Search and Filters */}
            <section className='max-w-5xl mx-auto px-6 mb-20 relative z-50'>
                <div className='bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-xl p-8'>
                    <div className='flex flex-col space-y-6'>
                        {/* Search Bar */}
                        <div className='relative'>
                            <label
                                htmlFor='search-workshops'
                                className='sr-only'
                            >
                                Search workshops, venues, and descriptions
                            </label>
                            <Search className='absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                            <input
                                id='search-workshops'
                                type='text'
                                placeholder='Search workshops, venues, instructors...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className='w-full pl-14 pr-6 py-4 bg-gray-50/50 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-lg'
                            />
                        </div>

                        {/* Apple-style Filters */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <label
                                    htmlFor='filter-city'
                                    className='block text-sm font-medium text-gray-700 mb-2'
                                >
                                    City
                                </label>
                                <select
                                    id='filter-city'
                                    value={selectedCity}
                                    onChange={(e) =>
                                        setSelectedCity(e.target.value)
                                    }
                                    className='w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all'
                                >
                                    <option value=''>All cities</option>
                                    {cities.map((city) => (
                                        <option key={city} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <DatePicker
                                    selectedDate={selectedDate}
                                    onDateChange={setSelectedDate}
                                    eventDates={dates}
                                    placeholder='All dates'
                                    accentColor='blue'
                                />
                            </div>
                        </div>

                        {/* Apple-style Results count */}
                        <div className='flex justify-between items-center pt-2'>
                            <p className='text-sm text-gray-600 font-medium'>
                                {filteredEvents.length} workshop
                                {filteredEvents.length !== 1 ? 's' : ''} found
                            </p>
                            {(searchTerm || selectedCity || selectedDate) && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedCity('');
                                        setSelectedDate('');
                                    }}
                                    className='text-sm text-blue-600 hover:text-blue-700 font-medium'
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Workshops List */}
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
                            No workshops found
                        </h3>
                        <p className='text-body text-gray-700 mb-6'>
                            Try adjusting your search or filters to find more
                            workshops.
                        </p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCity('');
                                setSelectedDate('');
                            }}
                            className='btn-primary px-6 py-3 text-sm'
                            aria-label='Reset all search filters and show all workshops'
                        >
                            Reset filters
                        </button>
                    </div>
                )}
            </section>

            {/* Call to Action */}
            <section className='max-w-4xl mx-auto px-6 py-16'>
                <div className='bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-8 text-center text-white'>
                    <h2 className='text-headline text-white mb-4'>
                        Ready to Learn Cuban Salsa?
                    </h2>
                    <p className='text-body text-white/90 mb-6 max-w-2xl mx-auto'>
                        Join a workshop and start your Cuban salsa journey! From
                        beginner basics to advanced rueda de casino moves.
                    </p>
                    <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                        <Link
                            href='/'
                            className='bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors'
                        >
                            All Events
                        </Link>
                        <Link
                            href='/festivals'
                            className='bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-3 px-8 rounded-lg transition-colors'
                        >
                            Festivals
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
