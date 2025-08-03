'use client';

import React, { useState, useEffect } from 'react';

interface User {
    id: string;
    displayName: string;
    favoriteEventTypes?: string[];
}

interface Event {
    id: string;
    title: string;
    date: string;
    time?: string;
    venue: string;
    city: string;
    type?: string;
    url?: string;
    price?: string;
    imageUrl?: string;
}

interface EventAttendance {
    id: string;
    event: Event;
    status: 'going' | 'maybe' | 'not-going';
    notes?: string;
    publicComment?: string;
    createdAt: string;
}

interface MyEventsProps {
    user: User;
}

const MyEvents: React.FC<MyEventsProps> = () => {
    const [attendances, setAttendances] = useState<EventAttendance[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<
        'all' | 'going' | 'maybe' | 'not-going'
    >('all');

    useEffect(() => {
        loadMyEvents();
    }, []);

    const loadMyEvents = async () => {
        try {
            const response = await fetch('/api/event-attendances/my-events');
            if (response.ok) {
                const data = await response.json();
                setAttendances(data.docs || []);
            }
        } catch (error) {
            console.error('Failed to load events:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'going':
                return 'Going';
            case 'maybe':
                return 'Maybe';
            case 'not-going':
                return 'Not Going';
            default:
                return 'Event';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'going':
                return 'bg-green-50 text-green-800 border-green-200';
            case 'maybe':
                return 'bg-yellow-50 text-yellow-800 border-yellow-200';
            case 'not-going':
                return 'bg-red-50 text-red-800 border-red-200';
            default:
                return 'bg-gray-50 text-gray-800 border-gray-200';
        }
    };

    const filteredAttendances = attendances.filter(
        (attendance) => filter === 'all' || attendance.status === filter
    );

    const upcomingEvents = filteredAttendances.filter(
        (attendance) => new Date(attendance.event.date) >= new Date()
    );

    const pastEvents = filteredAttendances.filter(
        (attendance) => new Date(attendance.event.date) < new Date()
    );

    if (isLoading) {
        return (
            <div className='bg-white shadow rounded-lg p-6'>
                <div className='animate-pulse space-y-4'>
                    <div className='h-4 bg-gray-200 rounded w-1/4'></div>
                    <div className='space-y-3'>
                        <div className='h-4 bg-gray-200 rounded'></div>
                        <div className='h-4 bg-gray-200 rounded w-5/6'></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            {/* Header with filters */}
            <div className='bg-white shadow rounded-lg p-6'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-xl font-semibold text-gray-900'>
                        My Events
                    </h2>
                    <div className='flex space-x-2'>
                        {[
                            {
                                value: 'all',
                                label: 'All',
                                count: attendances.length,
                            },
                            {
                                value: 'going',
                                label: 'Going',
                                count: attendances.filter(
                                    (a) => a.status === 'going'
                                ).length,
                            },
                            {
                                value: 'maybe',
                                label: 'Maybe',
                                count: attendances.filter(
                                    (a) => a.status === 'maybe'
                                ).length,
                            },
                        ].map((filterOption) => (
                            <button
                                key={filterOption.value}
                                onClick={() =>
                                    setFilter(filterOption.value as any)
                                }
                                className={`px-3 py-1 rounded-full text-sm ${
                                    filter === filterOption.value
                                        ? 'bg-indigo-100 text-indigo-800'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {filterOption.label} ({filterOption.count})
                            </button>
                        ))}
                    </div>
                </div>

                {attendances.length === 0 && (
                    <div className='text-center py-8'>
                        <div className='text-4xl mb-4'>🎭</div>
                        <h3 className='text-lg font-medium text-gray-900 mb-2'>
                            Nog geen events
                        </h3>
                        <p className='text-gray-600 mb-4'>
                            Je hebt je nog niet ingeschreven voor events. Ontdek
                            geweldige salsa events!
                        </p>
                        <a
                            href='/'
                            className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700'
                        >
                            Discover Events
                        </a>
                    </div>
                )}
            </div>

            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
                <div className='bg-white shadow rounded-lg p-6'>
                    <h3 className='text-lg font-medium text-gray-900 mb-4'>
                        🔜 Aankomende Events ({upcomingEvents.length})
                    </h3>
                    <div className='space-y-4'>
                        {upcomingEvents.map((attendance) => (
                            <EventCard
                                key={attendance.id}
                                attendance={attendance}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Past Events */}
            {pastEvents.length > 0 && (
                <div className='bg-white shadow rounded-lg p-6'>
                    <h3 className='text-lg font-medium text-gray-900 mb-4'>
                        Past Events ({pastEvents.length})
                    </h3>
                    <div className='space-y-4'>
                        {pastEvents.map((attendance) => (
                            <EventCard
                                key={attendance.id}
                                attendance={attendance}
                                isPast={true}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

interface EventCardProps {
    attendance: EventAttendance;
    isPast?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({
    attendance,
    isPast = false,
}) => {
    const event = attendance.event;
    const eventDate = new Date(event.date);

    return (
        <div className={`border rounded-lg p-4 ${isPast ? 'opacity-75' : ''}`}>
            <div className='flex items-start justify-between'>
                <div className='flex-1'>
                    <div className='flex items-center space-x-2 mb-2'>
                        <h4 className='text-lg font-medium text-gray-900'>
                            {event.title}
                        </h4>
                        <span
                            className={`px-2 py-1 text-xs rounded-full border ${
                                isPast
                                    ? 'bg-gray-50 text-gray-600 border-gray-200'
                                    : attendance.status === 'going'
                                      ? 'bg-green-50 text-green-800 border-green-200'
                                      : attendance.status === 'maybe'
                                        ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
                                        : 'bg-red-50 text-red-800 border-red-200'
                            }`}
                        >
                            {attendance.status === 'going'
                                ? 'Going'
                                : attendance.status === 'maybe'
                                  ? 'Maybe'
                                  : 'Not Going'}
                        </span>
                    </div>

                    <div className='text-sm text-gray-600 space-y-1'>
                        <div>
                            📅{' '}
                            {eventDate.toLocaleDateString('nl-NL', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </div>
                        {event.time && <div>{event.time}</div>}
                        <div>
                            {event.venue}, {event.city}
                        </div>
                        {event.type && <div>{event.type}</div>}
                        {event.price && <div>{event.price}</div>}
                    </div>

                    {attendance.publicComment && (
                        <div className='mt-3 p-3 bg-gray-50 rounded text-sm'>
                            <strong>My comment:</strong>{' '}
                            {attendance.publicComment}
                        </div>
                    )}

                    {attendance.notes && (
                        <div className='mt-3 p-3 bg-blue-50 rounded text-sm'>
                            <strong>Privé notities:</strong> {attendance.notes}
                        </div>
                    )}
                </div>

                <div className='ml-4 flex flex-col space-y-2'>
                    {event.url && (
                        <a
                            href={event.url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-indigo-600 hover:text-indigo-800 text-sm'
                        >
                            🔗 Event info
                        </a>
                    )}
                    <a
                        href={`/events/${event.id}`}
                        className='text-indigo-600 hover:text-indigo-800 text-sm'
                    >
                        👥 Details & Comments
                    </a>
                </div>
            </div>
        </div>
    );
};

export default MyEvents;
