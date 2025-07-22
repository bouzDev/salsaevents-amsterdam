import { SalsaEvent } from '@/types/event';
import {
    Calendar,
    MapPin,
    Clock,
    ExternalLink,
    Music,
    Users,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';

interface EventCardProps {
    event: SalsaEvent;
}

const getEventTypeColor = (type: string) => {
    switch (type) {
        case 'party':
            return 'bg-red-500 text-white';
        case 'workshop':
            return 'bg-blue-500 text-white';
        case 'festival':
            return 'bg-purple-500 text-white';
        case 'social':
            return 'bg-green-500 text-white';
        default:
            return 'bg-gray-500 text-white';
    }
};

const getEventTypeIcon = (type: string) => {
    switch (type) {
        case 'party':
            return <Music className='w-3 h-3' />;
        case 'workshop':
            return <Users className='w-3 h-3' />;
        case 'festival':
            return <Calendar className='w-3 h-3' />;
        case 'social':
            return <Users className='w-3 h-3' />;
        default:
            return <Music className='w-3 h-3' />;
    }
};

export default function EventCard({ event }: EventCardProps) {
    const formattedDate = format(parseISO(event.date), 'EEEE d MMMM', {
        locale: nl,
    });

    return (
        <div className='bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-red-200 group'>
            {/* Header met gradient achtergrond */}
            <div className='bg-gradient-to-r from-red-500 to-orange-500 p-4 text-white'>
                <div className='flex justify-between items-start mb-2'>
                    <div
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(
                            event.type
                        )}`}
                    >
                        {getEventTypeIcon(event.type)}
                        {event.type.charAt(0).toUpperCase() +
                            event.type.slice(1)}
                    </div>
                    {event.isRecurring && (
                        <span className='bg-white/20 px-2 py-1 rounded-full text-xs'>
                            {event.frequency}
                        </span>
                    )}
                </div>
                <h3 className='text-xl font-bold mb-1 group-hover:text-yellow-100 transition-colors'>
                    {event.title}
                </h3>
                {event.description && (
                    <p className='text-red-100 text-sm'>{event.description}</p>
                )}
            </div>

            <div className='p-4'>
                {/* Datum en tijd */}
                <div className='flex items-center gap-2 mb-3 text-gray-700'>
                    <Calendar className='w-4 h-4 text-red-500' />
                    <span className='font-medium'>{formattedDate}</span>
                    {event.time && (
                        <>
                            <Clock className='w-4 h-4 text-red-500 ml-2' />
                            <span>{event.time}</span>
                        </>
                    )}
                </div>

                {/* Locatie */}
                <div className='flex items-center gap-2 mb-3 text-gray-700'>
                    <MapPin className='w-4 h-4 text-red-500' />
                    <span>
                        {event.venue}, {event.city}
                    </span>
                </div>

                {/* Vibe */}
                {event.vibe && (
                    <div className='mb-3'>
                        <p className='text-sm text-gray-600 italic bg-gray-50 p-2 rounded-lg'>
                            "{event.vibe}"
                        </p>
                    </div>
                )}

                {/* Tags */}
                <div className='flex flex-wrap gap-1 mb-4'>
                    {event.tags.map((tag, index) => (
                        <span
                            key={index}
                            className='bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium'
                        >
                            #{tag}
                        </span>
                    ))}
                </div>

                {/* Link naar event */}
                {event.url && (
                    <a
                        href={event.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors group'
                    >
                        Meer info
                        <ExternalLink className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                    </a>
                )}
            </div>
        </div>
    );
}
