import { Suspense } from 'react';
import HomeContent from '@/components/HomeContent';
import { getSalsaEventsMain } from '@/data/events.server';

export default async function Home() {
    // Load events server-side vanuit Payload CMS voor SEO
    const events = await getSalsaEventsMain();

    return (
        <Suspense
            fallback={
                <div className='bg-white min-h-screen'>
                    <div className='max-w-4xl mx-auto px-6 pt-16 pb-12 text-center'>
                        <h1 className='text-display text-gray-900 mb-4'>
                            Where are we dancing Cuban salsa this week?
                        </h1>
                        <p className='text-body text-gray-600 max-w-2xl mx-auto mb-8'>
                            Loading Cuban salsa events...
                        </p>
                    </div>
                </div>
            }
        >
            <HomeContent initialEvents={events} />
        </Suspense>
    );
}
