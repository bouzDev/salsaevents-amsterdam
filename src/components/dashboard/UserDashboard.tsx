'use client';

import React, { useState, useEffect } from 'react';
import UserProfile from '@/components/dashboard/UserProfile';
import MyEvents from '@/components/dashboard/MyEvents';
import EventRecommendations from '@/components/dashboard/EventRecommendations';
import { LogOut, User as UserIcon } from 'lucide-react';
import Link from 'next/link';

interface User {
    id: string;
    displayName: string;
    email: string;
    experienceLevel?: string;
    favoriteEventTypes?: string[];
    notifications?: string;
    bio?: string;
}

interface UserDashboardProps {
    initialUser: User;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ initialUser }) => {
    const [user, setUser] = useState<User>(initialUser);
    const [activeTab, setActiveTab] = useState<
        'overview' | 'events' | 'profile'
    >('overview');

    useEffect(() => {
        // Fetch fresh user data
        const fetchUserData = async () => {
            try {
                const userResponse = await fetch('/api/public-users/me');
                if (userResponse.ok) {
                    const userData: { user: User } = await userResponse.json();
                    setUser(userData.user);
                }
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/public-users/logout', { method: 'POST' });
            window.location.href = '/';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleTabClick = (tab: 'overview' | 'events' | 'profile') => {
        setActiveTab(tab);
    };

    return (
        <div className='min-h-screen bg-gray-50'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                {/* Welcome Section */}
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                        Welcome back, {user.displayName}!
                    </h1>
                    <p className='text-gray-600'>
                        Manage your events, discover new ones, and stay
                        connected with the salsa community.
                    </p>
                </div>

                {/* Navigation Tabs */}
                <div className='mb-8'>
                    <nav className='flex space-x-1 bg-gray-100 rounded-lg p-1'>
                        <button
                            onClick={() => handleTabClick('overview')}
                            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                                activeTab === 'overview'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => handleTabClick('events')}
                            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                                activeTab === 'events'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            My Events
                        </button>
                        <button
                            onClick={() => handleTabClick('profile')}
                            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                                activeTab === 'profile'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Profile
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                <div className='space-y-6'>
                    {activeTab === 'overview' && (
                        <div className='space-y-6'>
                            {/* Recommendations */}
                            <EventRecommendations user={user} />
                        </div>
                    )}

                    {activeTab === 'events' && (
                        <div className='bg-white rounded-xl shadow-sm border border-gray-200'>
                            <div className='p-6'>
                                <MyEvents user={user} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className='bg-white rounded-xl shadow-sm border border-gray-200'>
                            <div className='p-6'>
                                <UserProfile user={user} onUpdate={setUser} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
