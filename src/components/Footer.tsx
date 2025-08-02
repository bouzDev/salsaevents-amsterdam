import Link from 'next/link';
import { Instagram } from 'lucide-react';

export default function Footer() {
    return (
        <footer className='bg-gray-50 border-t border-gray-200'>
            <div className='max-w-4xl mx-auto px-6 py-8'>
                {/* Main Footer Content */}
                <div className='flex flex-col md:flex-row justify-between items-center gap-6'>
                    {/* Instagram Link */}
                    <div className='flex items-center gap-3'>
                        <a
                            href='https://www.instagram.com/salsaeventsamsterdam/'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors'
                        >
                            <Instagram className='w-5 h-5' />
                            <span className='font-medium'>
                                @salsaeventsamsterdam
                            </span>
                        </a>
                    </div>

                    {/* Credits */}
                    <div className='text-center text-caption text-gray-700'>
                        Made by{' '}
                        <a
                            href='https://www.instagram.com/salnaityte/'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-600 hover:text-blue-800 transition-colors'
                        >
                            Ieva
                        </a>
                        {' & '}
                        <a
                            href='https://www.instagram.com/bouz.svg/'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-600 hover:text-blue-800 transition-colors'
                        >
                            Anwar
                        </a>
                    </div>

                    {/* Legal Links */}
                    <div className='flex gap-4 text-caption text-gray-700'>
                        <Link
                            href='/privacy'
                            className='hover:text-blue-600 transition-colors'
                        >
                            Privacy
                        </Link>
                        <Link
                            href='/terms'
                            className='hover:text-blue-600 transition-colors'
                        >
                            Terms
                        </Link>
                    </div>
                </div>

                {/* Copyright */}
                <div className='mt-6 pt-6 border-t border-gray-200 text-center text-caption text-gray-700'>
                    © {new Date().getFullYear()} SalsaEvents Amsterdam. All
                    rights reserved.
                </div>
            </div>
        </footer>
    );
}
