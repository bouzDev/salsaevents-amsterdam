import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy - Cuban Salsa Events Amsterdam',
    description: 'Privacy policy for SalsaEvents Amsterdam website',
};

export default function PrivacyPage() {
    return (
        <div className='bg-white min-h-screen py-16'>
            <div className='max-w-4xl mx-auto px-6'>
                <h1 className='text-display text-gray-900 mb-8'>
                    Privacy Policy
                </h1>

                <div className='prose prose-gray max-w-none'>
                    <p className='text-body text-gray-600 mb-6'>
                        Last updated: {new Date().toLocaleDateString('nl-NL')}
                    </p>

                    <section className='mb-8'>
                        <h2 className='text-headline text-gray-900 mb-4'>
                            1. Information We Collect
                        </h2>
                        <p className='text-body text-gray-600 mb-4'>
                            SalsaEvents Amsterdam does not collect personal
                            information from visitors. We only display publicly
                            available information about Cuban salsa events in
                            Amsterdam.
                        </p>
                        <p className='text-body text-gray-600 mb-4'>
                            We use Google Analytics to understand website usage
                            patterns. This may collect:
                        </p>
                        <ul className='list-disc pl-6 text-body text-gray-600 mb-4'>
                            <li>Browser type and version</li>
                            <li>Operating system</li>
                            <li>Pages visited and time spent</li>
                            <li>Anonymized IP address</li>
                        </ul>
                    </section>

                    <section className='mb-8'>
                        <h2 className='text-headline text-gray-900 mb-4'>
                            2. How We Use Information
                        </h2>
                        <p className='text-body text-gray-600 mb-4'>
                            Any data collected is used solely to:
                        </p>
                        <ul className='list-disc pl-6 text-body text-gray-600 mb-4'>
                            <li>
                                Improve website performance and user experience
                            </li>
                            <li>
                                Understand which Cuban salsa events are most
                                popular
                            </li>
                            <li>Monitor website traffic and usage patterns</li>
                        </ul>
                    </section>

                    <section className='mb-8'>
                        <h2 className='text-headline text-gray-900 mb-4'>
                            3. Event Information
                        </h2>
                        <p className='text-body text-gray-600 mb-4'>
                            All event information displayed on this website is
                            publicly available. We aggregate Cuban salsa events
                            from various public sources including:
                        </p>
                        <ul className='list-disc pl-6 text-body text-gray-600 mb-4'>
                            <li>Public event listings</li>
                            <li>Venue websites</li>
                            <li>Social media announcements</li>
                            <li>Community submissions</li>
                        </ul>
                    </section>

                    <section className='mb-8'>
                        <h2 className='text-headline text-gray-900 mb-4'>
                            4. Cookies
                        </h2>
                        <p className='text-body text-gray-600 mb-4'>
                            We use minimal cookies for:
                        </p>
                        <ul className='list-disc pl-6 text-body text-gray-600 mb-4'>
                            <li>Google Analytics (anonymized tracking)</li>
                            <li>Remembering your filter preferences</li>
                        </ul>
                        <p className='text-body text-gray-600 mb-4'>
                            You can disable cookies in your browser settings at
                            any time.
                        </p>
                    </section>

                    <section className='mb-8'>
                        <h2 className='text-headline text-gray-900 mb-4'>
                            5. Your Rights (GDPR)
                        </h2>
                        <p className='text-body text-gray-600 mb-4'>
                            Under GDPR, you have the right to:
                        </p>
                        <ul className='list-disc pl-6 text-body text-gray-600 mb-4'>
                            <li>Request information about data processing</li>
                            <li>Request deletion of any personal data</li>
                            <li>Object to data processing</li>
                            <li>Data portability</li>
                        </ul>
                    </section>

                    <section className='mb-8'>
                        <h2 className='text-headline text-gray-900 mb-4'>
                            6. Contact
                        </h2>
                        <p className='text-body text-gray-600 mb-4'>
                            For any privacy-related questions or requests,
                            please contact us via{' '}
                            <a
                                href='https://www.instagram.com/salsaeventsamsterdam/'
                                className='text-blue-600 hover:text-blue-800'
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                Instagram @salsaeventsamsterdam
                            </a>
                        </p>
                    </section>

                    <section className='mb-8'>
                        <h2 className='text-headline text-gray-900 mb-4'>
                            7. Changes to This Policy
                        </h2>
                        <p className='text-body text-gray-600 mb-4'>
                            We may update this privacy policy from time to time.
                            Changes will be posted on this page with an updated
                            date.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
