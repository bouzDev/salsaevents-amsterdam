'use client';

import { useState } from 'react';
import { Menu, X, Calendar, Music, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className='bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg sticky top-0 z-50'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between items-center h-16'>
                    {/* Logo */}
                    <Link
                        href='/'
                        className='flex items-center space-x-2 group'
                    >
                        <Music className='w-8 h-8 group-hover:rotate-12 transition-transform' />
                        <span className='text-xl font-bold'>SalsaEvents</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className='hidden md:flex items-center space-x-8'>
                        <Link
                            href='/'
                            className='flex items-center space-x-1 hover:text-yellow-200 transition-colors'
                        >
                            <Calendar className='w-4 h-4' />
                            <span>Events</span>
                        </Link>
                        <Link
                            href='/festivals'
                            className='flex items-center space-x-1 hover:text-yellow-200 transition-colors'
                        >
                            <Music className='w-4 h-4' />
                            <span>Festivals</span>
                        </Link>
                        <Link
                            href='/locaties'
                            className='flex items-center space-x-1 hover:text-yellow-200 transition-colors'
                        >
                            <MapPin className='w-4 h-4' />
                            <span>Locaties</span>
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className='md:hidden'>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className='text-white hover:text-yellow-200 transition-colors'
                        >
                            {isOpen ? (
                                <X className='w-6 h-6' />
                            ) : (
                                <Menu className='w-6 h-6' />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className='md:hidden'>
                        <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-red-700/50 rounded-lg mb-4'>
                            <Link
                                href='/'
                                className='flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-white/10 transition-colors'
                                onClick={() => setIsOpen(false)}
                            >
                                <Calendar className='w-4 h-4' />
                                <span>Events</span>
                            </Link>
                            <Link
                                href='/festivals'
                                className='flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-white/10 transition-colors'
                                onClick={() => setIsOpen(false)}
                            >
                                <Music className='w-4 h-4' />
                                <span>Festivals</span>
                            </Link>
                            <Link
                                href='/locaties'
                                className='flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-white/10 transition-colors'
                                onClick={() => setIsOpen(false)}
                            >
                                <MapPin className='w-4 h-4' />
                                <span>Locaties</span>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
