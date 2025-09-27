import { Suspense } from 'react';
import { getSalsaEventsMain } from '@/data/events.server';
import LocationsContent from '@/components/LocationsContent';

export const metadata = {
    title: 'Cuban Salsa Locations Amsterdam - Best Venues & Cities',
    description:
        'Discover the best venues and cities for Cuban salsa in Amsterdam and Netherlands. Find your favorite spots for authentic Cuban salsa, rueda de casino, and social dancing.',
    keywords: [
        'Cuban salsa venues Amsterdam',
        'salsa locations Netherlands',
        'Cuban salsa venues',
        'salsa dance venues Amsterdam',
        'rueda de casino locations',
        'salsa clubs Amsterdam',
        'Cuban salsa spots',
        'Amsterdam salsa venues',
    ],
};

export default async function LocationsPage() {
    // Load events server-side from Payload CMS for SEO
    const allEvents = await getSalsaEventsMain();

    return (
        <Suspense
            fallback={
                <div className='bg-white min-h-screen'>
                    <div className='max-w-4xl mx-auto px-6 pt-16 pb-12 text-center'>
                        <h1 className='text-display text-gray-900 mb-4'>
                            Cuban Salsa Locations
                        </h1>
                        <p className='text-body text-gray-600 max-w-2xl mx-auto mb-8'>
                            Loading locations...
                        </p>
                    </div>
                </div>
            }
        >
            <LocationsContent initialEvents={allEvents} />
        </Suspense>
    );
}