'use client';

import React, { useState, useEffect } from 'react';

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

    const loadRecommendedEvents = async () => {
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
    };

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
            <div className='bg-white shadow rounded-lg p-6'>
                <h3 className='text-lg font-medium text-gray-900 mb-4'>
                    🎯 Aanbevolen voor jou
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className='animate-pulse'>
                            <div className='h-40 bg-gray-200 rounded-t-lg'></div>
                            <div className='p-4 space-y-3'>
                                <div className='h-4 bg-gray-200 rounded'></div>
                                <div className='h-4 bg-gray-200 rounded w-5/6'></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className='bg-white shadow rounded-lg p-6'>
            <div className='flex justify-between items-center mb-4'>
                <h3 className='text-lg font-medium text-gray-900'>
                    🎯 Aanbevolen voor jou
                </h3>
                <a
                    href='/'
                    className='text-indigo-600 hover:text-indigo-800 text-sm'
                >
                    Alle events bekijken →
                </a>
            </div>

            {recommendedEvents.length === 0 ? (
                <div className='text-center py-8'>
                    <div className='text-4xl mb-4'>🔍</div>
                    <p className='text-gray-600'>
                        Geen aanbevelingen gevonden. Pas je voorkeuren aan in je
                        profiel voor betere aanbevelingen!
                    </p>
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
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

    return (
        <div className='border rounded-lg overflow-hidden hover:shadow-md transition-shadow'>
            {/* Event Image */}
            <div className='h-40 bg-gradient-to-br from-purple-400 to-pink-400 relative'>
                {event.imageUrl ? (
                    <img
                        src={event.imageUrl}
                        alt={event.title}
                        className='w-full h-full object-cover'
                    />
                ) : (
                    <div className='w-full h-full flex items-center justify-center text-white text-4xl'>
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
                )}
                {event.type && (
                    <div className='absolute top-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium'>
                        {event.type}
                    </div>
                )}
            </div>

            {/* Event Info */}
            <div className='p-4'>
                <h4 className='font-medium text-gray-900 mb-2 line-clamp-2'>
                    {event.title}
                </h4>

                <div className='text-sm text-gray-600 space-y-1 mb-3'>
                    <div>
                        📅{' '}
                        {eventDate.toLocaleDateString('nl-NL', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                        })}
                    </div>
                    {event.time && <div>🕐 {event.time}</div>}
                    <div>📍 {event.venue}</div>
                    {event.price && <div>💰 {event.price}</div>}
                </div>

                {event.description && (
                    <p className='text-sm text-gray-600 mb-3 line-clamp-2'>
                        {event.description}
                    </p>
                )}

                {/* RSVP Buttons */}
                {isUpcoming && (
                    <div className='flex space-x-2'>
                        <button
                            onClick={() => onRSVP(event.id, 'going')}
                            className='flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-3 rounded'
                        >
                            ✅ Ga
                        </button>
                        <button
                            onClick={() => onRSVP(event.id, 'maybe')}
                            className='flex-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm py-2 px-3 rounded'
                        >
                            ❓ Misschien
                        </button>
                    </div>
                )}

                <div className='mt-2'>
                    <a
                        href={`/events/${event.id}`}
                        className='text-indigo-600 hover:text-indigo-800 text-sm'
                    >
                        Meer details →
                    </a>
                </div>
            </div>
        </div>
    );
};

export default EventRecommendations;
