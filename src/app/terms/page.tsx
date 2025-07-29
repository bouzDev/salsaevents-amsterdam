import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service - Cuban Salsa Events Amsterdam',
    description: 'Terms of service for SalsaEvents Amsterdam website',
};

export default function TermsPage() {
    return (
        <div className='bg-white min-h-screen py-16'>
            <div className='max-w-4xl mx-auto px-6'>
                <h1 className='text-display text-gray-900 mb-8'>
                    Terms of Service
                </h1>

                <div className='prose prose-gray max-w-none'>
                    <p className='text-body text-gray-600 mb-6'>
                        Last updated: {new Date().toLocaleDateString('nl-NL')}
                    </p>

                    <section className='mb-8'>
                        <h2 className='text-headline text-gray-900 mb-4'>
                            1. About This Service
                        </h2>
                        <p className='text-body text-gray-600 mb-4'>
                            SalsaEvents Amsterdam is a free community service
                            that aggregates and displays information about Cuban
                            salsa events, workshops, parties, and festivals in
                            Amsterdam and surrounding areas.
                        </p>
                    </section>

                    <section className='mb-8'>
                        <h2 className='text-headline text-gray-900 mb-4'>
                            2. Event Information Accuracy
                        </h2>
                        <p className='text-body text-gray-600 mb-4'>
                            While we strive to provide accurate and up-to-date
                            information:
                        </p>
                        <ul className='list-disc pl-6 text-body text-gray-600 mb-4'>
                            <li>Event details may change without notice</li>
                            <li>
                                We recommend verifying details with event
                                organizers
                            </li>
                            <li>
                                We are not responsible for cancelled or modified
                                events
                            </li>
                            <li>
                                Information is sourced from public listings and
                                may contain errors
                            </li>
                        </ul>
                    </section>

                    <section className='mb-8'>
                        <h2 className='text-headline text-gray-900 mb-4'>
                            3. Limitation of Liability
                        </h2>
                        <p className='text-body text-gray-600 mb-4'>
                            SalsaEvents Amsterdam is provided &quot;as is&quot;
                            without warranties. We are not liable for:
                        </p>
                        <ul className='list-disc pl-6 text-body text-gray-600 mb-4'>
                            <li>Inaccurate or outdated event information</li>
                            <li>Cancelled or changed events</li>
                            <li>Any issues arising from attending events</li>
                            <li>Website downtime or technical issues</li>
                        </ul>
                    </section>

                    <section className='mb-8'>
                        <h2 className='text-headline text-gray-900 mb-4'>
                            4. Intellectual Property
                        </h2>
                        <p className='text-body text-gray-600 mb-4'>
                            Event information displayed is sourced from public
                            listings. The website design and code are owned by
                            the creators. Event organizers retain rights to
                            their event information.
                        </p>
                    </section>

                    <section className='mb-8'>
                        <h2 className='text-headline text-gray-900 mb-4'>
                            5. Community Guidelines
                        </h2>
                        <p className='text-body text-gray-600 mb-4'>
                            This service is intended to promote the Cuban salsa
                            community in Amsterdam. Any misuse of the service or
                            information may result in access restrictions.
                        </p>
                    </section>

                    <section className='mb-8'>
                        <h2 className='text-headline text-gray-900 mb-4'>
                            6. Event Submission
                        </h2>
                        <p className='text-body text-gray-600 mb-4'>
                            If you organize Cuban salsa events and would like
                            them featured, please contact us via{' '}
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
                            7. Applicable Law
                        </h2>
                        <p className='text-body text-gray-600 mb-4'>
                            These terms are governed by Dutch law. Any disputes
                            will be handled in accordance with Dutch legal
                            procedures.
                        </p>
                    </section>

                    <section className='mb-8'>
                        <h2 className='text-headline text-gray-900 mb-4'>
                            8. Contact
                        </h2>
                        <p className='text-body text-gray-600 mb-4'>
                            For questions about these terms or to report issues,
                            contact us via{' '}
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
                            9. Changes to Terms
                        </h2>
                        <p className='text-body text-gray-600 mb-4'>
                            We may update these terms occasionally. Continued
                            use of the service constitutes acceptance of any
                            changes.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
