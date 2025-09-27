import { Suspense } from 'react';
import { getSalsaEventsMain } from '@/data/events.server';
import FestivalsContent from '@/components/FestivalsContent';

export const metadata = {
    title: 'Cuban Salsa Festivals Amsterdam - Dance Festivals & Events',
    description:
        'Discover the best Cuban salsa festivals, dance events and multi-day celebrations in Amsterdam and Netherlands. Experience live bands, competitions and social dancing.',
    keywords: [
        'Cuban salsa festivals Amsterdam',
        'salsa festivals Netherlands',
        'Cuban salsa events',
        'salsa dance festivals',
        'rueda de casino festivals',
        'salsa competitions Amsterdam',
        'Cuban music festivals',
        'salsa social dancing events',
    ],
};

export default async function FestivalsPage() {
    // Load events server-side from Payload CMS for SEO
    const allEvents = await getSalsaEventsMain();

    // Filter for festival events only
    const festivalEvents = allEvents.filter(
        (event) => event.type === 'festival'
    );

    return (
        <Suspense
            fallback={
                <div className='bg-white min-h-screen'>
                    <div className='max-w-4xl mx-auto px-6 pt-16 pb-12 text-center'>
                        <h1 className='text-display text-gray-900 mb-4'>
                            Cuban Salsa Festivals in Amsterdam
                        </h1>
                        <p className='text-body text-gray-600 max-w-2xl mx-auto mb-8'>
                            Loading Cuban salsa festivals...
                        </p>
                    </div>
                </div>
            }
        >
            <FestivalsContent initialEvents={festivalEvents} />
        </Suspense>
    );
}
