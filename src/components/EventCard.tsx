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
        gtag?: (command: string, targetId: string, parameters?: Record<string, unknown>) => void;
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
    const formattedDate = format(parseISO(event.date), 'EEEE, MMMM do', {
        locale: enUS,
    });

    const handleMoreInfoClick = () => {
        if (event.url) {
            trackEventClick(event.title, event.type, event.url);
        }
    };

    return (
        <div className='card p-6 hover:shadow-sm'>
            <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>
                {/* Left Content */}
                <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-2'>
                        <h3 className='text-title text-gray-900'>
                            {event.title}
                        </h3>
                        <span
                            className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getEventTypeColor(
                                event.type
                            )}`}
                        >
                            {event.type.charAt(0).toUpperCase() +
                                event.type.slice(1)}
                        </span>
                        {event.isRecurring && (
                            <span className='text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md'>
                                {event.frequency}
                            </span>
                        )}
                    </div>

                    {event.description && (
                        <p className='text-body text-gray-600 mb-3'>
                            {event.description}
                        </p>
                    )}

                    {/* Date and Time */}
                    <div className='flex items-center gap-6 text-caption text-gray-500 mb-2'>
                        <div className='flex items-center gap-2'>
                            <Calendar className='w-4 h-4' />
                            <span>{formattedDate}</span>
                        </div>
                        {event.time && (
                            <div className='flex items-center gap-2'>
                                <Clock className='w-4 h-4' />
                                <span>{event.time}</span>
                            </div>
                        )}
                    </div>

                    {/* Location */}
                    <div className='flex items-center gap-2 text-caption text-gray-500 mb-3'>
                        <MapPin className='w-4 h-4' />
                        <span>
                            {event.venue}, {event.city}
                        </span>
                    </div>

                    {/* Vibe */}
                    {event.vibe && (
                        <p className='text-caption text-gray-600 italic mb-3'>
                            &ldquo;{event.vibe}&rdquo;
                        </p>
                    )}

                    {/* Tags */}
                    {event.tags.length > 0 && (
                        <div className='flex flex-wrap gap-2'>
                            {event.tags.slice(0, 4).map((tag, index) => (
                                <span
                                    key={index}
                                    className='text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md'
                                >
                                    #{tag}
                                </span>
                            ))}
                            {event.tags.length > 4 && (
                                <span className='text-xs text-gray-400'>
                                    +{event.tags.length - 4} more
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Content */}
                <div className='flex-shrink-0'>
                    {event.url && (
                        <a
                            href={event.url}
                            target='_blank'
                            rel='noopener noreferrer'
                            onClick={handleMoreInfoClick}
                            className='btn-secondary inline-flex items-center gap-2 px-4 py-2 text-sm'
                        >
                            More info
                            <ExternalLink className='w-4 h-4' />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
