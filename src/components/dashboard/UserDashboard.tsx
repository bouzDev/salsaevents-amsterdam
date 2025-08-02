'use client';

import React, { useState, useEffect } from 'react';
import UserProfile from './UserProfile';
import MyEvents from './MyEvents';
import EventRecommendations from './EventRecommendations';

interface User {
    id: string;
    displayName: string;
    email: string;
    avatar?: any;
    bio?: string;
    experienceLevel?: string;
    favoriteEventTypes?: string[];
    notifications?: {
        emailUpdates?: boolean;
        eventReminders?: boolean;
        commentReplies?: boolean;
    };
}

const UserDashboard: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState<
        'overview' | 'events' | 'profile'
    >('overview');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        try {
            const response = await fetch('/api/public-users/me');
            if (response.ok) {
                const userData = await response.json();
                setUser(userData.user);
            } else {
                // User not authenticated, redirect to login
                window.location.href = '/login';
            }
        } catch (error) {
            console.error('Failed to load user profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/public-users/logout', { method: 'POST' });
            window.location.href = '/';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (isLoading) {
        return (
            <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto'></div>
                    <p className='mt-4 text-gray-600'>Dashboard laden...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect to login
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            {/* Header */}
            <header className='bg-white shadow'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex justify-between items-center py-6'>
                        <div className='flex items-center'>
                            <h1 className='text-3xl font-bold text-gray-900'>
                                🕺 Salsa Events
                            </h1>
                            <span className='ml-4 text-gray-500'>
                                Dashboard
                            </span>
                        </div>
                        <div className='flex items-center space-x-4'>
                            <span className='text-gray-700'>
                                Welkom, {user.displayName}!
                            </span>
                            <a
                                href='/'
                                className='text-indigo-600 hover:text-indigo-800'
                            >
                                ← Terug naar site
                            </a>
                            <button
                                onClick={handleLogout}
                                className='bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-sm'
                            >
                                Uitloggen
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div className='bg-white border-b'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <nav className='flex space-x-8'>
                        {[
                            {
                                id: 'overview',
                                label: '📊 Overzicht',
                                icon: '📊',
                            },
                            {
                                id: 'events',
                                label: '📅 Mijn Events',
                                icon: '📅',
                            },
                            { id: 'profile', label: '👤 Profiel', icon: '👤' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === tab.id
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
                <div className='px-4 py-6 sm:px-0'>
                    {activeTab === 'overview' && (
                        <div className='space-y-6'>
                            <div className='bg-white overflow-hidden shadow rounded-lg'>
                                <div className='px-4 py-5 sm:p-6'>
                                    <h3 className='text-lg leading-6 font-medium text-gray-900 mb-4'>
                                        🎉 Welkom terug, {user.displayName}!
                                    </h3>
                                    <p className='text-gray-600 mb-6'>
                                        Hier is je persoonlijke salsa events
                                        dashboard. Ontdek nieuwe events, beheer
                                        je RSVP's en verbind met andere salsa
                                        liefhebbers.
                                    </p>
                                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                        <div className='bg-indigo-50 p-4 rounded-lg'>
                                            <div className='text-2xl font-bold text-indigo-600'>
                                                🎯
                                            </div>
                                            <div className='text-sm text-gray-600 mt-1'>
                                                Niveau:{' '}
                                                {user.experienceLevel ||
                                                    'Niet ingesteld'}
                                            </div>
                                        </div>
                                        <div className='bg-green-50 p-4 rounded-lg'>
                                            <div className='text-2xl font-bold text-green-600'>
                                                ❤️
                                            </div>
                                            <div className='text-sm text-gray-600 mt-1'>
                                                {user.favoriteEventTypes
                                                    ?.length || 0}{' '}
                                                favoriete types
                                            </div>
                                        </div>
                                        <div className='bg-yellow-50 p-4 rounded-lg'>
                                            <div className='text-2xl font-bold text-yellow-600'>
                                                🎊
                                            </div>
                                            <div className='text-sm text-gray-600 mt-1'>
                                                Events deze week
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <EventRecommendations user={user} />
                        </div>
                    )}

                    {activeTab === 'events' && <MyEvents user={user} />}

                    {activeTab === 'profile' && (
                        <UserProfile user={user} onUserUpdate={setUser} />
                    )}
                </div>
            </main>
        </div>
    );
};

export default UserDashboard;
