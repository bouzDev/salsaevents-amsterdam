'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface User {
    id: string;
    favoriteEventTypes?: string[];
    experienceLevel?: string;
}

interface Event {
    id: string;
    title: string;
    date: string;
    time?: string;
    venue: string;
    city: string;
    type?: string;
    price?: string;
    imageUrl?: string;
    description?: string;
}

interface EventRecommendationsProps {
    user: User;
}

const EventRecommendations: React.FC<EventRecommendationsProps> = ({
    user,
}) => {
    const [recommendedEvents, setRecommendedEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadRecommendedEvents();
    }, [user.favoriteEventTypes, user.experienceLevel]);

    const loadRecommendedEvents = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            if (user.favoriteEventTypes && user.favoriteEventTypes.length > 0) {
                params.append('types', user.favoriteEventTypes.join(','));
            }
            if (user.experienceLevel) {
                params.append('level', user.experienceLevel);
            }
            params.append('upcoming', 'true');
            params.append('limit', '6');

            const response = await fetch(`/api/events?${params.toString()}`);
            if (response.ok) {
                const data = await response.json();
                setRecommendedEvents(data.docs || []);
            }
        } catch (error) {
            console.error('Failed to load recommended events:', error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    const handleRSVP = async (eventId: string, status: 'going' | 'maybe') => {
        try {
            const response = await fetch('/api/event-attendances', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    event: eventId,
                    status: status,
                }),
            });

            if (response.ok) {
                // Remove event from recommendations since user has RSVP'd
                setRecommendedEvents((prev) =>
                    prev.filter((event) => event.id !== eventId)
                );
            }
        } catch (error) {
            console.error('RSVP failed:', error);
        }
    };

    if (isLoading) {
        return (
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
                <h3 className='text-xl font-semibold text-gray-900 mb-6'>
                    Recommended for You
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className='animate-pulse'>
                            <div className='h-48 bg-gray-200 rounded-xl mb-4'></div>
                            <div className='space-y-3'>
                                <div className='h-4 bg-gray-200 rounded'></div>
                                <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                                <div className='h-3 bg-gray-200 rounded w-1/2'></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
            <div className='flex justify-between items-center mb-6'>
                <h3 className='text-xl font-semibold text-gray-900'>
                    Recommended for You
                </h3>
                <Link
                    href='/events'
                    className='text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors'
                >
                    Browse all events →
                </Link>
            </div>

            {recommendedEvents.length === 0 ? (
                <div className='text-center py-12'>
                    <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <svg
                            className='w-8 h-8 text-gray-400'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                            />
                        </svg>
                    </div>
                    <h4 className='text-lg font-medium text-gray-900 mb-2'>
                        No recommendations yet
                    </h4>
                    <p className='text-gray-600 max-w-sm mx-auto'>
                        Adjust your preferences in your profile to get
                        personalized event recommendations!
                    </p>
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {recommendedEvents.map((event) => (
                        <EventRecommendationCard
                            key={event.id}
                            event={event}
                            onRSVP={handleRSVP}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

interface EventRecommendationCardProps {
    event: Event;
    onRSVP: (eventId: string, status: 'going' | 'maybe') => void;
}

const EventRecommendationCard: React.FC<EventRecommendationCardProps> = ({
    event,
    onRSVP,
}) => {
    const eventDate = new Date(event.date);
    const isUpcoming = eventDate >= new Date();

    const getEventTypeColor = (type: string) => {
        switch (type) {
            case 'party':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'workshop':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'festival':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'social':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <Link href={`/events/${event.id}`} className='group block'>
            <div className='bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-200'>
                {/* Event Image */}
                <div className='h-48 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 relative overflow-hidden'>
                    {event.imageUrl ? (
                        <img
                            src={event.imageUrl}
                            alt={event.title}
                            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-200'
                        />
                    ) : (
                        <div className='w-full h-full flex items-center justify-center text-white'>
                            <div className='text-center'>
                                <div className='text-4xl font-bold mb-2'>
                                    {event.type === 'party'
                                        ? 'P'
                                        : event.type === 'workshop'
                                          ? 'W'
                                          : event.type === 'festival'
                                            ? 'F'
                                            : event.type === 'social'
                                              ? 'S'
                                              : 'E'}
                                </div>
                                <div className='text-sm font-medium opacity-90'>
                                    {event.type || 'Event'}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Event Type Badge */}
                    {event.type && (
                        <div className='absolute top-3 left-3'>
                            <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getEventTypeColor(event.type)}`}
                            >
                                {event.type.charAt(0).toUpperCase() +
                                    event.type.slice(1)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Event Info */}
                <div className='p-5'>
                    <h4 className='font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors'>
                        {event.title}
                    </h4>

                    <div className='space-y-2 mb-4'>
                        <div className='flex items-center text-sm text-gray-600'>
                            <svg
                                className='w-4 h-4 mr-2 flex-shrink-0'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                                />
                            </svg>
                            <span className='font-medium'>
                                {eventDate.toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </span>
                            {event.time && (
                                <span className='ml-2 text-gray-500'>
                                    at {event.time}
                                </span>
                            )}
                        </div>

                        <div className='flex items-center text-sm text-gray-600'>
                            <svg
                                className='w-4 h-4 mr-2 flex-shrink-0'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                                />
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                                />
                            </svg>
                            <span>{event.venue}</span>
                        </div>

                        {event.price && (
                            <div className='flex items-center text-sm text-gray-600'>
                                <svg
                                    className='w-4 h-4 mr-2 flex-shrink-0'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
                                    />
                                </svg>
                                <span className='font-medium text-green-600'>
                                    {event.price}
                                </span>
                            </div>
                        )}
                    </div>

                    {event.description && (
                        <p className='text-sm text-gray-600 mb-4 line-clamp-2'>
                            {event.description}
                        </p>
                    )}

                    {/* RSVP Buttons */}
                    {isUpcoming && (
                        <div
                            className='flex space-x-2 mb-3'
                            onClick={(e) => e.preventDefault()}
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRSVP(event.id, 'going');
                                }}
                                className='flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors'
                            >
                                I'm going
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRSVP(event.id, 'maybe');
                                }}
                                className='flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 text-sm font-medium py-2.5 px-4 rounded-lg transition-colors'
                            >
                                Maybe
                            </button>
                        </div>
                    )}

                    <div className='text-right'>
                        <span className='text-indigo-600 text-sm font-medium group-hover:text-indigo-700 transition-colors'>
                            View details →
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default EventRecommendations;
