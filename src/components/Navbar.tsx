'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className='border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50'>
            <div className='max-w-6xl mx-auto px-6'>
                <div className='flex justify-between items-center h-12'>
                    {/* Logo */}
                    <Link
                        href='/'
                        className='font-semibold text-gray-900 text-lg'
                    >
                        SalsaEvents
                    </Link>

                    {/* Desktop Menu */}
                    <div className='hidden md:flex items-center space-x-8'>
                        <Link
                            href='/'
                            className='text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors'
                        >
                            Events
                        </Link>
                        <Link
                            href='/festivals'
                            className='text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors'
                        >
                            Festivals
                        </Link>
                        <Link
                            href='/locations'
                            className='text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors'
                        >
                            Locations
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className='md:hidden'>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className='text-gray-700 hover:text-gray-900 p-1'
                        >
                            {isOpen ? (
                                <X className='w-5 h-5' />
                            ) : (
                                <Menu className='w-5 h-5' />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className='md:hidden pb-4 pt-2'>
                        <div className='space-y-2'>
                            <Link
                                href='/'
                                className='block px-3 py-2 text-gray-700 hover:text-gray-900 text-sm font-medium'
                                onClick={() => setIsOpen(false)}
                            >
                                Events
                            </Link>
                            <Link
                                href='/festivals'
                                className='block px-3 py-2 text-gray-700 hover:text-gray-900 text-sm font-medium'
                                onClick={() => setIsOpen(false)}
                            >
                                Festivals
                            </Link>
                            <Link
                                href='/locations'
                                className='block px-3 py-2 text-gray-700 hover:text-gray-900 text-sm font-medium'
                                onClick={() => setIsOpen(false)}
                            >
                                Locations
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
