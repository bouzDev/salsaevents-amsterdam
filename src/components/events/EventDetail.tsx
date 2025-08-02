'use client';

import React, { useState, useEffect } from 'react';
import EventRSVP from './EventRSVP';
import EventComments from './EventComments';

interface Event {
    id: string;
    title: string;
    description?: string;
    date: string;
    time?: string;
    venue: string;
    city: string;
    type?: string;
    url?: string;
    price?: string;
    tags?: string[];
    vibe?: string;
    imageUrl?: string;
    isRecurring?: boolean;
    frequency?: string;
}

interface EventDetailProps {
    event: Event;
}

const EventDetail: React.FC<EventDetailProps> = ({ event }) => {
    const [user, setUser] = useState<any>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);

    useEffect(() => {
        checkUserAuth();
    }, []);

    const checkUserAuth = async () => {
        try {
            const response = await fetch('/api/public-users/me');
            if (response.ok) {
                const userData = await response.json();
                setUser(userData.user);
            }
        } catch (error) {
            // User not authenticated, that's fine
        } finally {
            setIsLoadingUser(false);
        }
    };

    const eventDate = new Date(event.date);
    const isUpcoming = eventDate >= new Date();

    return (
        <div className='min-h-screen bg-gray-50'>
            {/* Hero Section */}
            <div className='relative'>
                {/* Header Navigation */}
                <div className='absolute top-0 left-0 right-0 z-10 bg-black bg-opacity-50'>
                    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                        <div className='flex justify-between items-center py-4'>
                            <a
                                href='/'
                                className='text-white hover:text-gray-300 flex items-center'
                            >
                                ← Terug naar events
                            </a>
                            {user ? (
                                <a
                                    href='/dashboard'
                                    className='text-white hover:text-gray-300'
                                >
                                    Dashboard →
                                </a>
                            ) : (
                                <div className='space-x-4'>
                                    <a
                                        href='/login'
                                        className='text-white hover:text-gray-300'
                                    >
                                        Login
                                    </a>
                                    <a
                                        href='/register'
                                        className='bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded'
                                    >
                                        Registreren
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Hero Image/Background */}
                <div className='h-96 bg-gradient-to-br from-purple-600 to-pink-600 relative'>
                    {event.imageUrl ? (
                        <img
                            src={event.imageUrl}
                            alt={event.title}
                            className='w-full h-full object-cover'
                        />
                    ) : (
                        <div className='w-full h-full flex items-center justify-center text-white'>
                            <div className='text-8xl'>
                                {event.type === 'party'
                                    ? '🎉'
                                    : event.type === 'workshop'
                                      ? '🎓'
                                      : event.type === 'festival'
                                        ? '🎪'
                                        : event.type === 'social'
                                          ? '🤝'
                                          : '🕺'}
                            </div>
                        </div>
                    )}
                    <div className='absolute inset-0 bg-black bg-opacity-40'></div>
                </div>

                {/* Event Title Overlay */}
                <div className='absolute bottom-0 left-0 right-0 p-8'>
                    <div className='max-w-7xl mx-auto'>
                        <div className='text-white'>
                            <div className='flex items-center space-x-3 mb-2'>
                                {event.type && (
                                    <span className='bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm'>
                                        {event.type}
                                    </span>
                                )}
                                {isUpcoming && (
                                    <span className='bg-green-500 px-3 py-1 rounded-full text-sm'>
                                        Aankomend
                                    </span>
                                )}
                            </div>
                            <h1 className='text-4xl md:text-5xl font-bold mb-2'>
                                {event.title}
                            </h1>
                            <p className='text-xl opacity-90'>
                                📅{' '}
                                {eventDate.toLocaleDateString('nl-NL', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                                {event.time && ` • 🕐 ${event.time}`}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    {/* Main Content */}
                    <div className='lg:col-span-2 space-y-8'>
                        {/* Event Description */}
                        <div className='bg-white rounded-lg shadow p-6'>
                            <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                                📋 Over dit event
                            </h2>
                            {event.description ? (
                                <div className='prose max-w-none'>
                                    <p className='text-gray-700 leading-relaxed'>
                                        {event.description}
                                    </p>
                                </div>
                            ) : (
                                <p className='text-gray-600 italic'>
                                    Geen beschrijving beschikbaar voor dit
                                    event.
                                </p>
                            )}

                            {event.tags &&
                                ((typeof event.tags === 'string' &&
                                    event.tags.trim()) ||
                                    (Array.isArray(event.tags) &&
                                        event.tags.length > 0)) && (
                                    <div className='mt-6'>
                                        <h3 className='text-sm font-medium text-gray-700 mb-2'>
                                            Tags:
                                        </h3>
                                        <div className='flex flex-wrap gap-2'>
                                            {(() => {
                                                // Handle both string and array formats for tags
                                                let tagsArray = [];
                                                if (
                                                    typeof event.tags ===
                                                    'string'
                                                ) {
                                                    tagsArray = event.tags
                                                        .split(',')
                                                        .map((tag) =>
                                                            tag.trim()
                                                        )
                                                        .filter((tag) => tag);
                                                } else if (
                                                    Array.isArray(event.tags)
                                                ) {
                                                    tagsArray = event.tags;
                                                }

                                                return tagsArray.map(
                                                    (tag, index) => (
                                                        <span
                                                            key={index}
                                                            className='bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm'
                                                        >
                                                            {tag}
                                                        </span>
                                                    )
                                                );
                                            })()}
                                        </div>
                                    </div>
                                )}

                            {event.vibe && (
                                <div className='mt-6'>
                                    <h3 className='text-sm font-medium text-gray-700 mb-2'>
                                        Sfeer:
                                    </h3>
                                    <p className='text-gray-600'>
                                        {event.vibe}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Comments Section */}
                        <EventComments eventId={event.id} user={user} />
                    </div>

                    {/* Sidebar */}
                    <div className='space-y-6'>
                        {/* Event Details Card */}
                        <div className='bg-white rounded-lg shadow p-6'>
                            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                                📍 Event Details
                            </h3>
                            <div className='space-y-3 text-sm'>
                                <div className='flex items-start'>
                                    <span className='text-gray-500 w-6'>
                                        📅
                                    </span>
                                    <div>
                                        <div className='font-medium'>
                                            {eventDate.toLocaleDateString(
                                                'nl-NL',
                                                {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                }
                                            )}
                                        </div>
                                        {event.time && (
                                            <div className='text-gray-600'>
                                                {event.time}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className='flex items-start'>
                                    <span className='text-gray-500 w-6'>
                                        📍
                                    </span>
                                    <div>
                                        <div className='font-medium'>
                                            {event.venue}
                                        </div>
                                        <div className='text-gray-600'>
                                            {event.city}
                                        </div>
                                    </div>
                                </div>

                                {event.price && (
                                    <div className='flex items-start'>
                                        <span className='text-gray-500 w-6'>
                                            💰
                                        </span>
                                        <div className='font-medium'>
                                            {event.price}
                                        </div>
                                    </div>
                                )}

                                {event.type && (
                                    <div className='flex items-start'>
                                        <span className='text-gray-500 w-6'>
                                            🎭
                                        </span>
                                        <div className='font-medium capitalize'>
                                            {event.type}
                                        </div>
                                    </div>
                                )}

                                {event.isRecurring && event.frequency && (
                                    <div className='flex items-start'>
                                        <span className='text-gray-500 w-6'>
                                            🔄
                                        </span>
                                        <div className='font-medium'>
                                            Recurring: {event.frequency}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {event.url && (
                                <div className='mt-6'>
                                    <a
                                        href={event.url}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md text-center block'
                                    >
                                        🔗 Meer informatie
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* RSVP Section */}
                        {isUpcoming && (
                            <EventRSVP
                                eventId={event.id}
                                user={user}
                                isLoadingUser={isLoadingUser}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
