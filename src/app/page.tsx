import { Suspense } from 'react';
import HomeContent from '@/components/HomeContent';

export default function Home() {
    return (
        <Suspense
            fallback={
                <div className='bg-white min-h-screen'>
                    <div className='max-w-4xl mx-auto px-6 pt-16 pb-12 text-center'>
                        <h1 className='text-display text-gray-900 mb-4'>
                            Where are we dancing salsa this week?
                        </h1>
                        <p className='text-body text-gray-600 max-w-2xl mx-auto mb-8'>
                            Loading events...
                        </p>
                    </div>
                </div>
            }
        >
            <HomeContent />
        </Suspense>
    );
}
