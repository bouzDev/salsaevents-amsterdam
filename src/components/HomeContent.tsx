'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import EventCard from '@/components/EventCard';
import { SalsaEvent } from '@/types/event';

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

    // Helper function to check if event is in the future or today
    const isEventUpcoming = (eventDate: string): boolean => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day
        const eventDateObj = new Date(eventDate);
        return eventDateObj >= today;
    };

    // Filter events - only show upcoming events
    const filteredEvents = useMemo(() => {
        return salsaEvents.filter((event) => {
            // First check if event is upcoming
            if (!isEventUpcoming(event.date)) {
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
                selectedDate === '' || event.date === selectedDate;

            return matchesSearch && matchesCity && matchesType && matchesDate;
        });
    }, [searchTerm, selectedCity, selectedType, selectedDate, salsaEvents]);

    // Get unique cities, types and dates for filters (only from upcoming events)
    const upcomingEvents = useMemo(() => {
        return salsaEvents.filter((event) => isEventUpcoming(event.date));
    }, [salsaEvents]);

    const cities = [...new Set(upcomingEvents.map((event) => event.city))];
    const types = [...new Set(upcomingEvents.map((event) => event.type))];
    const dates = [
        ...new Set(upcomingEvents.map((event) => event.date)),
    ].sort();

    return (
        <div className='bg-white min-h-screen'>
            {/* Hero Section */}
            <section className='max-w-4xl mx-auto px-6 pt-16 pb-12 text-center'>
                <h2 className='text-display text-gray-900 mb-4'>
                    Where are we dancing Cuban salsa this week?
                </h2>
                <p className='text-body text-gray-700 max-w-2xl mx-auto mb-8'>
                    Discover the best spots to dance authentic Cuban salsa,
                    rueda de casino, and salsa cubana - events, parties,
                    workshops and festivals in Amsterdam and surrounding areas.
                    Your weekly guide to the Cuban salsa scene!
                </p>

                {/* Quick Stats */}
                <div className='flex justify-center items-center gap-8 text-caption text-gray-700 mb-12'>
                    <span>{upcomingEvents.length} Events</span>
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
                            <label htmlFor='search-events' className='sr-only'>
                                Search events, venues, and descriptions
                            </label>
                            <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                            <input
                                id='search-events'
                                type='text'
                                placeholder='Search events, venues, descriptions...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className='w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                            />
                        </div>

                        {/* Filters */}
                        <div className='flex gap-3'>
                            <div className='flex-1'>
                                <label
                                    htmlFor='filter-city'
                                    className='sr-only'
                                >
                                    Filter by city
                                </label>
                                <select
                                    id='filter-city'
                                    value={selectedCity}
                                    onChange={(e) =>
                                        setSelectedCity(e.target.value)
                                    }
                                    className='w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                >
                                    <option value=''>All cities</option>
                                    {cities.map((city) => (
                                        <option key={city} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className='flex-1'>
                                <label
                                    htmlFor='filter-type'
                                    className='sr-only'
                                >
                                    Filter by event type
                                </label>
                                <select
                                    id='filter-type'
                                    value={selectedType}
                                    onChange={(e) =>
                                        setSelectedType(e.target.value)
                                    }
                                    className='w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
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

                            <div className='flex-1'>
                                <label
                                    htmlFor='filter-date'
                                    className='sr-only'
                                >
                                    Filter by date
                                </label>
                                <select
                                    id='filter-date'
                                    value={selectedDate}
                                    onChange={(e) =>
                                        setSelectedDate(e.target.value)
                                    }
                                    className='w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                >
                                    <option value=''>All dates</option>
                                    {dates.map((date) => {
                                        const formattedDate = new Date(
                                            date
                                        ).toLocaleDateString('en-US', {
                                            weekday: 'short',
                                            month: 'short',
                                            day: 'numeric',
                                        });
                                        return (
                                            <option key={date} value={date}>
                                                {formattedDate}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>

                        {/* Results count */}
                        <p className='text-caption text-gray-700'>
                            {filteredEvents.length} event
                            {filteredEvents.length !== 1 ? 's' : ''} found
                        </p>
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
