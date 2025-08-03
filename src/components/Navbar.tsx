'use client';

import { useState, useEffect } from 'react';
import { Menu, X, User } from 'lucide-react';
import Link from 'next/link';

interface User {
    id: string;
    displayName: string;
}

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showUserMenu, setShowUserMenu] = useState(false);

    useEffect(() => {
        checkUserAuth();
    }, []);

    const checkUserAuth = async () => {
        try {
            const response = await fetch('/api/public-users/me');
            if (response.ok) {
                const userData = await response.json();
                setUser(userData.user);
            }
        } catch {
            // User not authenticated, that's fine
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/public-users/logout', { method: 'POST' });
            setUser(null);
            setShowUserMenu(false);
            window.location.href = '/';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

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
                            Home
                        </Link>
                        <Link
                            href='/events'
                            className='text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors'
                        >
                            All Events
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

                        {/* User Authentication */}
                        {isLoading ? (
                            <div className='w-6 h-6 bg-gray-200 rounded-full animate-pulse'></div>
                        ) : user ? (
                            <div className='relative'>
                                <button
                                    onClick={() =>
                                        setShowUserMenu(!showUserMenu)
                                    }
                                    className='flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors'
                                >
                                    <div className='w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center'>
                                        <span className='text-indigo-600 font-medium text-xs'>
                                            {user.displayName
                                                .charAt(0)
                                                .toUpperCase()}
                                        </span>
                                    </div>
                                    <span className='text-sm font-medium'>
                                        {user.displayName}
                                    </span>
                                </button>

                                {showUserMenu && (
                                    <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border'>
                                        <Link
                                            href='/dashboard'
                                            className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                                            onClick={() =>
                                                setShowUserMenu(false)
                                            }
                                        >
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className='flex items-center space-x-3'>
                                <Link
                                    href='/login'
                                    className='text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors'
                                >
                                    Login
                                </Link>
                                <Link
                                    href='/register'
                                    className='bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors'
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
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
                    <div className='md:hidden pb-4 pt-2 border-t border-gray-200'>
                        <div className='space-y-2'>
                            <Link
                                href='/'
                                className='block px-3 py-2 text-gray-700 hover:text-gray-900 text-sm font-medium'
                                onClick={() => setIsOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                href='/events'
                                className='block px-3 py-2 text-gray-700 hover:text-gray-900 text-sm font-medium'
                                onClick={() => setIsOpen(false)}
                            >
                                All Events
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

                            {/* Mobile User Authentication */}
                            <div className='pt-2 border-t border-gray-200'>
                                {user ? (
                                    <>
                                        <div className='px-3 py-2 text-sm text-gray-500'>
                                            Welcome, {user.displayName}!
                                        </div>
                                        <Link
                                            href='/dashboard'
                                            className='block px-3 py-2 text-gray-700 hover:text-gray-900 text-sm font-medium'
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className='block w-full text-left px-3 py-2 text-gray-700 hover:text-gray-900 text-sm font-medium'
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href='/login'
                                            className='block px-3 py-2 text-gray-700 hover:text-gray-900 text-sm font-medium'
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href='/register'
                                            className='block px-3 py-2 bg-indigo-600 text-white rounded-md mx-3 text-center text-sm font-medium'
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
