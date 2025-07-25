'use client';

import { useMemo } from 'react';
import { Users, Trophy } from 'lucide-react';
import EventCard from '@/components/EventCard';
import { salsaEvents } from '@/data/events';

export default function FestivalsPage() {
    // Filter only workshops and festivals
    const festivalsAndWorkshops = useMemo(() => {
        return salsaEvents.filter(
            (event) => event.type === 'festival' || event.type === 'workshop'
        );
    }, []);

    return (
        <div className='bg-white min-h-screen'>
            {/* Hero Section */}
            <section className='max-w-4xl mx-auto px-6 pt-16 pb-12 text-center'>
                <h1 className='text-display text-gray-900 mb-4'>
                    Festivals & Workshops
                </h1>
                <p className='text-body text-gray-600 max-w-2xl mx-auto mb-8'>
                    From intensive workshops to spectacular festivals - here
                    you&apos;ll find everything to take your salsa skills to the next
                    level.
                </p>

                {/* Stats */}
                <div className='flex justify-center items-center gap-8 text-caption text-gray-500 mb-12'>
                    <div className='flex items-center gap-2'>
                        <Users className='w-4 h-4' />
                        <span>
                            {
                                festivalsAndWorkshops.filter(
                                    (e) => e.type === 'workshop'
                                ).length
                            }{' '}
                            Workshops
                        </span>
                    </div>
                    <span>•</span>
                    <div className='flex items-center gap-2'>
                        <Trophy className='w-4 h-4' />
                        <span>
                            {
                                festivalsAndWorkshops.filter(
                                    (e) => e.type === 'festival'
                                ).length
                            }{' '}
                            Festivals
                        </span>
                    </div>
                </div>
            </section>

            {/* Events List */}
            <section className='max-w-4xl mx-auto px-6 pb-16'>
                {festivalsAndWorkshops.length > 0 ? (
                    <div className='space-y-4'>
                        {festivalsAndWorkshops.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                ) : (
                    <div className='text-center py-16'>
                        <h3 className='text-title text-gray-900 mb-2'>
                            No festivals or workshops found
                        </h3>
                        <p className='text-body text-gray-600'>
                            Check back later for new events!
                        </p>
                    </div>
                )}
            </section>

            {/* Info Section */}
            <section className='bg-gray-50 py-16'>
                <div className='max-w-4xl mx-auto px-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
                        {/* Workshops */}
                        <div className='text-center'>
                            <Users className='mx-auto w-8 h-8 text-blue-500 mb-4' />
                            <h3 className='text-title text-gray-900 mb-4'>
                                Workshops
                            </h3>
                            <p className='text-body text-gray-600 mb-6'>
                                Improve your techniques with professional
                                instructors. From beginners to advanced, there&apos;s
                                always something new to learn in the world of
                                salsa.
                            </p>
                            <div className='flex flex-wrap justify-center gap-2'>
                                <span className='text-xs text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-md'>
                                    Rueda de Casino
                                </span>
                                <span className='text-xs text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-md'>
                                    Cuban Salsa
                                </span>
                                <span className='text-xs text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-md'>
                                    LA Style
                                </span>
                                <span className='text-xs text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-md'>
                                    Bachata
                                </span>
                            </div>
                        </div>

                        {/* Festivals */}
                        <div className='text-center'>
                            <Trophy className='mx-auto w-8 h-8 text-purple-500 mb-4' />
                            <h3 className='text-title text-gray-900 mb-4'>
                                Festivals
                            </h3>
                            <p className='text-body text-gray-600 mb-6'>
                                Experience the magic of salsa festivals!
                                Multi-day events full of workshops, shows,
                                competitions and unforgettable social dances.
                            </p>
                            <div className='flex flex-wrap justify-center gap-2'>
                                <span className='text-xs text-purple-600 bg-purple-50 border border-purple-200 px-3 py-1 rounded-md'>
                                    Live Bands
                                </span>
                                <span className='text-xs text-purple-600 bg-purple-50 border border-purple-200 px-3 py-1 rounded-md'>
                                    Competitions
                                </span>
                                <span className='text-xs text-purple-600 bg-purple-50 border border-purple-200 px-3 py-1 rounded-md'>
                                    Shows
                                </span>
                                <span className='text-xs text-purple-600 bg-purple-50 border border-purple-200 px-3 py-1 rounded-md'>
                                    Social Dancing
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
