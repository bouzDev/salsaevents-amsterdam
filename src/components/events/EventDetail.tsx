'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, ExternalLink, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import EventRSVP from './EventRSVP';
import EventComments from './EventComments';
import { format, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';
import Image from 'next/image';

interface Event {
    id: string;
    slug?: string;
    title: string;
    description?: string;
    date: string;
    time?: string;
    venue: string;
    city: string;
    type: string;
    url?: string;
    price?: string;
    tags?: string | string[];
    vibe?: string;
    imageUrl?: string;
    isRecurring?: boolean;
    frequency?: string;
}

interface EventDetailProps {
    event: Event;
}

const EventDetail: React.FC<EventDetailProps> = ({ event }) => {
    const [user, setUser] = useState<{
        id: string;
        displayName: string;
    } | null>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [currentUrl, setCurrentUrl] = useState('');

    useEffect(() => {
        checkUserAuth();
        // Set current URL on client side only
        if (typeof window !== 'undefined') {
            setCurrentUrl(window.location.href);
        }
    }, []);

    const checkUserAuth = async () => {
        try {
            const response = await fetch('/api/public-users/me');
            if (response.ok) {
                const userData = await response.json();
                setUser(userData.user);
            }
        } catch {
            // User not authenticated, that's fine
        } finally {
            setIsLoadingUser(false);
        }
    };

    const eventDate = new Date(event.date);
    const formattedDate = format(parseISO(event.date), 'EEEE, MMMM do, yyyy', {
        locale: enUS,
    });

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
        <div className='min-h-screen bg-gray-50'>
            {/* Hero Header */}
            <div className='bg-white border-b border-gray-200'>
                <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
                    {/* Back to Events Link */}
                    <div className='mb-6'>
                        <Link
                            href='/events'
                            className='inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors'
                        >
                            <ArrowLeft className='w-4 h-4' />
                            <span className='text-sm font-medium'>
                                Back to Events
                            </span>
                        </Link>
                    </div>

                    {/* Event Header */}
                    <div className='text-center'>
                        <div className='flex items-center justify-center space-x-3 mb-4'>
                            <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getEventTypeColor(
                                    event.type
                                )}`}
                            >
                                {event.type.charAt(0).toUpperCase() +
                                    event.type.slice(1)}
                            </span>
                            {event.isRecurring && (
                                <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200'>
                                    {event.frequency} event
                                </span>
                            )}
                        </div>

                        <h1 className='text-4xl font-bold text-gray-900 mb-4'>
                            {event.title}
                        </h1>

                        {/* Key Info */}
                        <div className='flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-gray-600'>
                            <div className='flex items-center space-x-2'>
                                <Calendar className='w-5 h-5' />
                                <span className='font-medium'>
                                    {formattedDate}
                                </span>
                            </div>
                            {event.time && (
                                <div className='flex items-center space-x-2'>
                                    <Clock className='w-5 h-5' />
                                    <span>{event.time}</span>
                                </div>
                            )}
                            <div className='flex items-center space-x-2'>
                                <MapPin className='w-5 h-5' />
                                <span>
                                    {event.venue}, {event.city}
                                </span>
                            </div>
                        </div>

                        {event.price && (
                            <div className='mt-4'>
                                <span className='inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 font-semibold'>
                                    {event.price}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    {/* Main Content */}
                    <div className='lg:col-span-2 space-y-6'>
                        {/* Event Image */}
                        {event.imageUrl && (
                            <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
                                <Image
                                    src={event.imageUrl}
                                    alt={event.title}
                                    width={800}
                                    height={400}
                                    className='w-full h-64 object-cover'
                                />
                            </div>
                        )}

                        {/* Description */}
                        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
                            <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                                About This Event
                            </h2>
                            {event.description ? (
                                <div className='prose prose-gray max-w-none'>
                                    <p className='text-gray-700 leading-relaxed'>
                                        {event.description}
                                    </p>
                                </div>
                            ) : (
                                <p className='text-gray-500 italic'>
                                    No description available for this event.
                                </p>
                            )}

                            {/* Vibe */}
                            {event.vibe && (
                                <div className='mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200'>
                                    <h3 className='text-sm font-medium text-indigo-900 mb-2'>
                                        Event Vibe
                                    </h3>
                                    <p className='text-indigo-800 text-sm'>
                                        {event.vibe}
                                    </p>
                                </div>
                            )}

                            {/* Tags */}
                            {event.tags &&
                                ((typeof event.tags === 'string' &&
                                    event.tags.trim()) ||
                                    (Array.isArray(event.tags) &&
                                        event.tags.length > 0)) && (
                                    <div className='mt-6'>
                                        <h3 className='text-sm font-medium text-gray-700 mb-3'>
                                            Tags
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
                                                            className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
                                                        >
                                                            {tag}
                                                        </span>
                                                    )
                                                );
                                            })()}
                                        </div>
                                    </div>
                                )}

                            {/* External Link */}
                            {event.url && (
                                <div className='mt-6 pt-6 border-t border-gray-200'>
                                    <a
                                        href={event.url}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='inline-flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium transition-colors'
                                    >
                                        <span>Visit Event Website</span>
                                        <ExternalLink className='w-4 h-4' />
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Comments Section */}
                        <div className='bg-white rounded-xl shadow-sm border border-gray-200'>
                            <EventComments eventId={event.id} user={user} />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className='space-y-6'>
                        {/* RSVP Card */}
                        <EventRSVP
                            eventId={event.id}
                            user={user}
                            isLoadingUser={isLoadingUser}
                        />

                        {/* Event Details Card */}
                        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
                            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                                Event Details
                            </h3>
                            <div className='space-y-4'>
                                <div className='flex items-start space-x-3'>
                                    <Calendar className='w-5 h-5 text-gray-400 mt-0.5' />
                                    <div>
                                        <div className='font-medium text-gray-900'>
                                            {formattedDate}
                                        </div>
                                        {event.time && (
                                            <div className='text-sm text-gray-600'>
                                                {event.time}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className='flex items-start space-x-3'>
                                    <MapPin className='w-5 h-5 text-gray-400 mt-0.5' />
                                    <div>
                                        <div className='font-medium text-gray-900'>
                                            {event.venue}
                                        </div>
                                        <div className='text-sm text-gray-600'>
                                            {event.city}
                                        </div>
                                    </div>
                                </div>

                                {event.price && (
                                    <div className='flex items-center space-x-3'>
                                        <div className='w-5 h-5 flex items-center justify-center'>
                                            <span className='text-gray-400'>
                                                Price:
                                            </span>
                                        </div>
                                        <div className='font-medium text-gray-900'>
                                            {event.price}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Share Card */}
                        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
                            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                                Share Event
                            </h3>
                            <div className='space-y-3'>
                                <button
                                    onClick={() => {
                                        if (
                                            typeof window !== 'undefined' &&
                                            navigator.clipboard
                                        ) {
                                            navigator.clipboard.writeText(
                                                currentUrl
                                            );
                                        }
                                    }}
                                    className='w-full bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2 rounded-lg font-medium transition-colors text-sm'
                                >
                                    Copy Link
                                </button>
                                <div className='flex space-x-2'>
                                    <a
                                        href={
                                            currentUrl
                                                ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(event.title)}&url=${encodeURIComponent(currentUrl)}`
                                                : '#'
                                        }
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors text-center'
                                    >
                                        Twitter
                                    </a>
                                    <a
                                        href={
                                            currentUrl
                                                ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`
                                                : '#'
                                        }
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors text-center'
                                    >
                                        Facebook
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
