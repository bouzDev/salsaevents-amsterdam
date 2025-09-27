import { Suspense } from 'react';
import { getSalsaEventsMain } from '@/data/events.server';
import WorkshopsContent from '@/components/WorkshopsContent';

export const metadata = {
    title: 'Cuban Salsa Workshops Amsterdam - Learn Cuban Salsa & Rueda de Casino',
    description:
        'Discover the best Cuban salsa workshops, classes and lessons in Amsterdam. Learn authentic Cuban salsa, rueda de casino, and salsa cubana from experienced instructors.',
    keywords: [
        'Cuban salsa workshops Amsterdam',
        'salsa cubana classes',
        'rueda de casino lessons',
        'Cuban salsa lessons Amsterdam',
        'salsa workshops Netherlands',
        'learn Cuban salsa',
        'salsa cubana workshops',
        'Amsterdam salsa classes',
    ],
};

export default async function WorkshopsPage() {
    // Load events server-side from Payload CMS for SEO
    const allEvents = await getSalsaEventsMain();

    // Filter for workshop events only
    const workshopEvents = allEvents.filter(
        (event) => event.type === 'workshop'
    );

    return (
        <Suspense
            fallback={
                <div className='bg-white min-h-screen'>
                    <div className='max-w-4xl mx-auto px-6 pt-16 pb-12 text-center'>
                        <h1 className='text-display text-gray-900 mb-4'>
                            Cuban Salsa Workshops in Amsterdam
                        </h1>
                        <p className='text-body text-gray-600 max-w-2xl mx-auto mb-8'>
                            Loading Cuban salsa workshops...
                        </p>
                    </div>
                </div>
            }
        >
            <WorkshopsContent initialEvents={workshopEvents} />
        </Suspense>
    );
}
