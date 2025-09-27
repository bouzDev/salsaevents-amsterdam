'use client';

import { SalsaEvent } from '@/types/event';
import { Calendar, MapPin, Clock, ExternalLink } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';

interface EventCardProps {
    event: SalsaEvent;
}

// Extend Window interface for GTM
declare global {
    interface Window {
        gtag?: (
            command: string,
            targetId: string,
            parameters?: Record<string, unknown>
        ) => void;
        dataLayer?: Record<string, unknown>[];
    }
}

const getEventTypeColor = (type: string) => {
    switch (type) {
        case 'party':
            return 'bg-red-50 text-red-700 border-red-200';
        case 'workshop':
            return 'bg-blue-50 text-blue-700 border-blue-200';
        case 'festival':
            return 'bg-purple-50 text-purple-700 border-purple-200';
        case 'social':
            return 'bg-green-50 text-green-700 border-green-200';
        default:
            return 'bg-gray-50 text-gray-700 border-gray-200';
    }
};

// GTM tracking function
const trackEventClick = (
    eventTitle: string,
    eventType: string,
    url: string
) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'event_click', {
            event_category: 'engagement',
            event_label: eventTitle,
            event_type: eventType,
            destination_url: url,
        });
    }

    // Also push to dataLayer for GTM
    if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
            event: 'event_click',
            event_title: eventTitle,
            event_type: eventType,
            destination_url: url,
        });
    }
};

export default function EventCard({ event }: EventCardProps) {
    // Format date range
    const formatDateRange = () => {
        const startDate = parseISO(event.date);

        if (!event.endDate) {
            // Single day event
            return format(startDate, 'EEEE, MMMM do', { locale: enUS });
        }

        const endDate = parseISO(event.endDate);
        const isSameMonth = format(startDate, 'MM') === format(endDate, 'MM');
        const isSameYear =
            format(startDate, 'yyyy') === format(endDate, 'yyyy');

        if (isSameMonth && isSameYear) {
            // Same month: "Friday, March 15 - Sunday, March 17"
            return `${format(startDate, 'EEEE, MMMM do', { locale: enUS })} - ${format(endDate, 'EEEE do', { locale: enUS })}`;
        } else if (isSameYear) {
            // Different months, same year: "March 15 - April 17"
            return `${format(startDate, 'MMMM do', { locale: enUS })} - ${format(endDate, 'MMMM do', { locale: enUS })}`;
        } else {
            // Different years: "March 15, 2024 - January 17, 2025"
            return `${format(startDate, 'MMMM do, yyyy', { locale: enUS })} - ${format(endDate, 'MMMM do, yyyy', { locale: enUS })}`;
        }
    };

    const formattedDate = formatDateRange();

    const handleMoreInfoClick = () => {
        if (event.url) {
            trackEventClick(event.title, event.type, event.url);
        }
    };

    return (
        <div className='bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 hover:shadow-xl hover:border-gray-300/50 transition-all duration-300 hover:scale-[1.02]'>
            <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6'>
                {/* Main Content */}
                <div className='flex-1 space-y-4'>
                    {/* Header */}
                    <div className='flex flex-wrap items-center gap-3'>
                        <h3 className='text-xl font-semibold text-gray-900 tracking-tight'>
                            {event.title}
                        </h3>
                        <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getEventTypeColor(
                                event.type
                            )}`}
                        >
                            {event.type.charAt(0).toUpperCase() +
                                event.type.slice(1)}
                        </span>
                        {event.isRecurring && (
                            <span className='text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full font-medium'>
                                {event.frequency}
                            </span>
                        )}
                    </div>

                    {event.description && (
                        <p className='text-gray-600 leading-relaxed'>
                            {event.description}
                        </p>
                    )}

                    {/* Meta Information */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600'>
                        <div className='flex items-center gap-2'>
                            <Calendar className='w-4 h-4 text-gray-400' />
                            <span className='font-medium'>{formattedDate}</span>
                        </div>
                        {event.time && (
                            <div className='flex items-center gap-2'>
                                <Clock className='w-4 h-4 text-gray-400' />
                                <span>{event.time}</span>
                            </div>
                        )}
                        <div className='flex items-center gap-2 sm:col-span-2'>
                            <MapPin className='w-4 h-4 text-gray-400' />
                            <span>
                                {event.venue}, {event.city}
                            </span>
                        </div>
                    </div>

                    {/* Vibe */}
                    {event.vibe && (
                        <blockquote className='text-sm text-gray-600 italic border-l-2 border-gray-200 pl-4'>
                            "{event.vibe}"
                        </blockquote>
                    )}

                    {/* Tags */}
                    {event.tags.length > 0 && (
                        <div className='flex flex-wrap gap-2'>
                            {event.tags.slice(0, 4).map((tag, index) => (
                                <span
                                    key={index}
                                    className='text-xs text-gray-600 bg-gray-100/80 px-3 py-1 rounded-full font-medium'
                                >
                                    #{tag}
                                </span>
                            ))}
                            {event.tags.length > 4 && (
                                <span className='text-xs text-gray-400 px-2 py-1'>
                                    +{event.tags.length - 4} more
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Action Button */}
                {event.url && (
                    <div className='flex-shrink-0'>
                        <button
                            onClick={() => {
                                handleMoreInfoClick();
                                window.open(
                                    event.url,
                                    '_blank',
                                    'noopener,noreferrer'
                                );
                            }}
                            className='inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all duration-200 hover:scale-105 active:scale-95'
                        >
                            More Info
                            <ExternalLink className='w-4 h-4' />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
