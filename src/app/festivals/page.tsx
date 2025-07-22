'use client';

import { useMemo } from 'react';
import { Calendar, Music, Trophy, Users, Star } from 'lucide-react';
import EventCard from '@/components/EventCard';
import { salsaEvents } from '@/data/events';

export default function FestivalsPage() {
    // Filter alleen workshops en festivals
    const festivalsAndWorkshops = useMemo(() => {
        return salsaEvents.filter(
            (event) => event.type === 'festival' || event.type === 'workshop'
        );
    }, []);

    return (
        <div className='min-h-screen bg-gray-50'>
            {/* Hero Section */}
            <section className='bg-gradient-to-r from-purple-600 via-pink-500 to-red-600 text-white'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
                    <div className='text-center'>
                        <h1 className='text-4xl md:text-6xl font-bold mb-4'>
                            🎉 Festivals & Workshops
                        </h1>
                        <p className='text-xl md:text-2xl mb-6 text-purple-100'>
                            Leer, groei en vier de salsa!
                        </p>
                        <p className='text-lg mb-8 max-w-2xl mx-auto text-purple-50'>
                            Van intensive workshops tot spectaculaire festivals
                            - hier vind je alles om je salsa skills naar het
                            volgende niveau te brengen.
                        </p>

                        {/* Stats */}
                        <div className='flex justify-center items-center gap-8 text-sm'>
                            <div className='flex items-center gap-2'>
                                <Users className='w-5 h-5' />
                                <span>
                                    {
                                        festivalsAndWorkshops.filter(
                                            (e) => e.type === 'workshop'
                                        ).length
                                    }{' '}
                                    Workshops
                                </span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <Trophy className='w-5 h-5' />
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
                    </div>
                </div>
            </section>

            {/* Featured Events */}
            <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
                <h2 className='text-3xl font-bold text-gray-900 mb-8 text-center'>
                    Aankomende Highlights
                </h2>

                {festivalsAndWorkshops.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {festivalsAndWorkshops.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                ) : (
                    <div className='text-center py-16'>
                        <Music className='mx-auto w-12 h-12 text-gray-400 mb-4' />
                        <h3 className='text-lg font-medium text-gray-900 mb-2'>
                            Geen festivals of workshops gevonden
                        </h3>
                        <p className='text-gray-500'>
                            Check later terug voor nieuwe evenementen!
                        </p>
                    </div>
                )}
            </section>

            {/* Info Section */}
            <section className='bg-white py-16'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
                        {/* Workshops */}
                        <div className='text-center'>
                            <Users className='mx-auto w-12 h-12 text-blue-500 mb-4' />
                            <h3 className='text-2xl font-bold text-gray-900 mb-4'>
                                Workshops
                            </h3>
                            <p className='text-gray-600 mb-6'>
                                Verbeter je technieken met professionele
                                instructeurs. Van beginners tot gevorderden, er
                                is altijd iets nieuws te leren in de wereld van
                                salsa.
                            </p>
                            <div className='flex flex-wrap justify-center gap-2'>
                                <span className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm'>
                                    Rueda de Casino
                                </span>
                                <span className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm'>
                                    Cuban Salsa
                                </span>
                                <span className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm'>
                                    LA Style
                                </span>
                                <span className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm'>
                                    Bachata
                                </span>
                            </div>
                        </div>

                        {/* Festivals */}
                        <div className='text-center'>
                            <Trophy className='mx-auto w-12 h-12 text-purple-500 mb-4' />
                            <h3 className='text-2xl font-bold text-gray-900 mb-4'>
                                Festivals
                            </h3>
                            <p className='text-gray-600 mb-6'>
                                Ervaar de magie van salsa festivals! Meerdaagse
                                evenementen vol workshops, shows, competitions
                                en onvergetelijke social dances.
                            </p>
                            <div className='flex flex-wrap justify-center gap-2'>
                                <span className='bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm'>
                                    Live Bands
                                </span>
                                <span className='bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm'>
                                    Competitions
                                </span>
                                <span className='bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm'>
                                    Shows
                                </span>
                                <span className='bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm'>
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
