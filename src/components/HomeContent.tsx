'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import EventCard from '@/components/EventCard';
import DatePicker from '@/components/DatePicker';
import { SalsaEvent } from '@/types/event';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';

interface HomeContentProps {
    initialEvents: SalsaEvent[];
}

export default function HomeContent({ initialEvents }: HomeContentProps) {
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [salsaEvents] = useState<SalsaEvent[]>(initialEvents);
    const loading = false; // No loading since events are passed as props

    // Check for query parameters on load
    useEffect(() => {
        const cityParam = searchParams.get('city');
        if (cityParam) {
            setSelectedCity(cityParam);
        }
    }, [searchParams]);

    // Helper function to check if event is upcoming
    const isEventUpcoming = (date: string, endDate?: string): boolean => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of day

        // For single day events, check if start date is today or later
        if (!endDate) {
            const eventDate = new Date(date);
            return eventDate >= today;
        }

        // For multi-day events, check if end date is today or later
        const eventEndDate = new Date(endDate);
        return eventEndDate >= today;
    };

    // Helper function to check if a specific date falls within an event's date range
    const isDateInEventRange = (
        eventDate: string,
        eventEndDate: string | undefined,
        targetDate: string
    ): boolean => {
        const target = new Date(targetDate);
        const start = new Date(eventDate);

        if (!eventEndDate) {
            // Single day event - exact match
            return eventDate === targetDate;
        }

        const end = new Date(eventEndDate);
        return target >= start && target <= end;
    };

    // Helper function to get all dates for an event (for date picker)
    const getEventDates = (date: string, endDate?: string): string[] => {
        if (!endDate) {
            return [date];
        }

        const dates: string[] = [];
        const start = new Date(date);
        const end = new Date(endDate);

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            dates.push(d.toISOString().split('T')[0]);
        }

        return dates;
    };

    // Filter events - only show upcoming events
    const filteredEvents = useMemo(() => {
        return salsaEvents.filter((event) => {
            // First check if event is upcoming
            if (!isEventUpcoming(event.date, event.endDate)) {
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
            const matchesType =
                selectedType === '' || event.type === selectedType;
            const matchesDate =
                selectedDate === '' ||
                isDateInEventRange(
                    event.date,
                    event.endDate,
                    selectedDate
                );

            return matchesSearch && matchesCity && matchesType && matchesDate;
        });
    }, [searchTerm, selectedCity, selectedType, selectedDate, salsaEvents]);

    // Get unique cities, types and dates for filters (only from upcoming events)
    const upcomingEvents = useMemo(() => {
        return salsaEvents.filter((event) =>
            isEventUpcoming(event.date, event.endDate)
        );
    }, [salsaEvents]);

    const cities = [...new Set(upcomingEvents.map((event) => event.city))];
    const types = [...new Set(upcomingEvents.map((event) => event.type))];

    // Get all individual dates from all events (including date ranges)
    const dates = useMemo(() => {
        const allDates = upcomingEvents.flatMap((event) =>
            getEventDates(event.date, event.endDate)
        );
        return [...new Set(allDates)].sort();
    }, [upcomingEvents]);

    return (
        <div className='bg-white min-h-screen'>
            {/* Apple-style Hero Section */}
            <section className='max-w-5xl mx-auto px-6 pt-24 pb-16 text-center'>
                <h1 className='text-6xl md:text-7xl font-semibold text-gray-900 mb-8 tracking-tight leading-none'>
                    Cuban Salsa
                    <br />
                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500'>
                        This Week
                    </span>
                </h1>
                <p className='text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed'>
                    Discover authentic Cuban salsa, rueda de casino, and salsa
                    cubana events. Your guide to the vibrant Cuban salsa scene
                    in Amsterdam and beyond.
                </p>

                {/* Apple-style Stats */}
                <div className='flex justify-center items-center gap-12 text-gray-500 mb-16'>
                    <div className='text-center'>
                        <div className='text-3xl font-semibold text-gray-900 mb-1'>
                            {upcomingEvents.length}
                        </div>
                        <div className='text-sm font-medium'>Events</div>
                    </div>
                    <div className='w-px h-12 bg-gray-200'></div>
                    <div className='text-center'>
                        <div className='text-3xl font-semibold text-gray-900 mb-1'>
                            {cities.length}
                        </div>
                        <div className='text-sm font-medium'>Cities</div>
                    </div>
                    <div className='w-px h-12 bg-gray-200'></div>
                    <div className='text-center'>
                        <div className='text-3xl font-semibold text-gray-900 mb-1'>
                            {types.length}
                        </div>
                        <div className='text-sm font-medium'>Types</div>
                    </div>
                </div>
            </section>

            {/* Apple-style Search and Filters */}
            <section className='max-w-5xl mx-auto px-6 mb-20 relative z-50'>
                <div className='bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-xl p-8'>
                    <div className='flex flex-col space-y-6'>
                        {/* Search Bar */}
                        <div className='relative'>
                            <label htmlFor='search-events' className='sr-only'>
                                Search events, venues, and descriptions
                            </label>
                            <Search className='absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                            <input
                                id='search-events'
                                type='text'
                                placeholder='Search events, venues, descriptions...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className='w-full pl-14 pr-6 py-4 bg-gray-50/50 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-lg'
                            />
                        </div>

                        {/* Apple-style Filters */}
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
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
                                <label
                                    htmlFor='filter-type'
                                    className='block text-sm font-medium text-gray-700 mb-2'
                                >
                                    Type
                                </label>
                                <select
                                    id='filter-type'
                                    value={selectedType}
                                    onChange={(e) =>
                                        setSelectedType(e.target.value)
                                    }
                                    className='w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all'
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
                                {filteredEvents.length} event
                                {filteredEvents.length !== 1 ? 's' : ''} found
                            </p>
                            {(searchTerm ||
                                selectedCity ||
                                selectedType ||
                                selectedDate) && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedCity('');
                                        setSelectedType('');
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

            {/* Events List */}
            <section className='max-w-4xl mx-auto px-6 pb-16'>
                {loading ? (
                    <div className='text-center py-16'>
                        <p className='text-body text-gray-700'>
                            Loading events...
                        </p>
                    </div>
                ) : filteredEvents.length > 0 ? (
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
                        <p className='text-body text-gray-700 mb-6'>
                            Try adjusting your search or filters to find more
                            results.
                        </p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCity('');
                                setSelectedType('');
                                setSelectedDate('');
                            }}
                            className='btn-primary px-6 py-3 text-sm'
                            aria-label='Reset all search filters and show all events'
                        >
                            Reset filters
                        </button>
                    </div>
                )}
            </section>

            {/* Apple-style Call to Action */}
            <section className='max-w-6xl mx-auto px-6 py-24'>
                <div className='bg-black rounded-3xl overflow-hidden relative'>
                    {/* Background gradient */}
                    <div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800'></div>

                    {/* Content */}
                    <div className='relative z-10 px-8 py-16 text-center'>
                        <h2 className='text-5xl font-semibold text-white mb-6 tracking-tight'>
                            Discover More
                        </h2>
                        <p className='text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed'>
                            Explore workshops to master your technique or join
                            festivals for unforgettable experiences in the Cuban
                            salsa community.
                        </p>

                        <div className='flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto'>
                            <Link
                                href='/workshops'
                                className='bg-white text-black hover:bg-gray-100 font-medium py-4 px-8 rounded-full transition-all duration-200 hover:scale-105 active:scale-95'
                            >
                                Workshops
                            </Link>
                            <Link
                                href='/festivals'
                                className='border border-white/30 text-white hover:bg-white/10 font-medium py-4 px-8 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 backdrop-blur-sm'
                            >
                                Festivals
                            </Link>
                        </div>
                    </div>

                    {/* Subtle decoration */}
                    <div className='absolute top-8 right-8 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl'></div>
                    <div className='absolute bottom-8 left-8 w-24 h-24 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-xl'></div>
                </div>
            </section>

            {/* FAQ Section for SEO */}
            <section className='bg-gray-50 py-16'>
                <div className='max-w-4xl mx-auto px-6'>
                    <h2 className='text-headline text-gray-900 mb-8 text-center'>
                        Frequently Asked Questions about Cuban Salsa in
                        Amsterdam
                    </h2>

                    <div className='space-y-8'>
                        <div>
                            <h3 className='text-title text-gray-900 mb-3'>
                                What is Cuban Salsa and how is it different from
                                other salsa styles?
                            </h3>
                            <p className='text-body text-gray-700'>
                                Cuban salsa, also known as salsa cubana or
                                Casino, is the original form of salsa that
                                originated in Cuba. Unlike LA-style or New
                                York-style salsa that are danced in lines, Cuban
                                salsa is danced in a more circular motion. It
                                emphasizes the connection between partners,
                                improvisation, and includes the famous rueda de
                                casino where couples dance in a circle.
                            </p>
                        </div>

                        <div>
                            <h3 className='text-title text-gray-900 mb-3'>
                                What is Rueda de Casino?
                            </h3>
                            <p className='text-body text-gray-700'>
                                Rueda de Casino is a group dance where couples
                                form a circle and dance Cuban salsa together.
                                One person calls out moves, and all couples
                                perform them simultaneously, often switching
                                partners. It&apos;s a fun, social way to dance
                                Cuban salsa and is very popular in
                                Amsterdam&apos;s salsa scene.
                            </p>
                        </div>

                        <div>
                            <h3 className='text-title text-gray-900 mb-3'>
                                Where can I learn Cuban Salsa in Amsterdam?
                            </h3>
                            <p className='text-body text-gray-700'>
                                Amsterdam has a vibrant Cuban salsa scene with
                                many workshops and classes available.{' '}
                                <a
                                    href='https://salsategusta.com'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-blue-600 hover:text-blue-800 underline'
                                >
                                    Salsa te Gusta
                                </a>{' '}
                                is a leading academy offering lessons for all
                                levels in a warm community environment. Many
                                events also combine workshops with social
                                dancing, making them perfect for beginners and
                                experienced dancers alike.
                            </p>
                        </div>

                        <div>
                            <h3 className='text-title text-gray-900 mb-3'>
                                When are the best Cuban Salsa events in
                                Amsterdam?
                            </h3>
                            <p className='text-body text-gray-700'>
                                Cuban salsa events happen throughout the week in
                                Amsterdam. Popular recurring events include
                                weekly socials on Fridays, outdoor rueda
                                sessions, and themed parties. Summer months
                                often feature more outdoor events and festivals.
                                Check our weekly updated list to find the best
                                Cuban salsa events happening this week!
                            </p>
                        </div>

                        <div>
                            <h3 className='text-title text-gray-900 mb-3'>
                                Do I need a partner to attend Cuban Salsa
                                events?
                            </h3>
                            <p className='text-body text-gray-700'>
                                No! Most Cuban salsa events in Amsterdam are
                                very welcoming to solo dancers. The community is
                                friendly and partner rotation is common,
                                especially in rueda de casino. Many events start
                                with workshops where you&apos;ll learn with
                                different partners, followed by social dancing
                                where everyone mixes.
                            </p>
                        </div>

                        <div>
                            <h3 className='text-title text-gray-900 mb-3'>
                                What should I wear to Cuban Salsa events?
                            </h3>
                            <p className='text-body text-gray-700'>
                                Wear comfortable clothes that allow you to move
                                freely and shoes that let you turn easily. Many
                                dancers prefer leather-soled shoes or dance
                                sneakers. For outdoor events like the rueda
                                sessions in Noordermarkt, dress for the weather
                                but keep dance-ability in mind!
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
