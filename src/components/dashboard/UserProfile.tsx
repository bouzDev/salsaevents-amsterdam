'use client';

import React, { useState } from 'react';

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

interface UserProfileProps {
    user: User;
    onUserUpdate: (user: User) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onUserUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        displayName: user.displayName || '',
        bio: user.bio || '',
        experienceLevel: user.experienceLevel || '',
        favoriteEventTypes: user.favoriteEventTypes || [],
        notifications: {
            emailUpdates: user.notifications?.emailUpdates ?? true,
            eventReminders: user.notifications?.eventReminders ?? true,
            commentReplies: user.notifications?.commentReplies ?? true,
        },
    });

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEventTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            favoriteEventTypes: checked
                ? [...prev.favoriteEventTypes, value]
                : prev.favoriteEventTypes.filter((type) => type !== value),
        }));
    };

    const handleNotificationChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [name]: checked,
            },
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`/api/public-users/${user.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                onUserUpdate(updatedUser.doc);
                setIsEditing(false);
            } else {
                console.error('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            displayName: user.displayName || '',
            bio: user.bio || '',
            experienceLevel: user.experienceLevel || '',
            favoriteEventTypes: user.favoriteEventTypes || [],
            notifications: {
                emailUpdates: user.notifications?.emailUpdates ?? true,
                eventReminders: user.notifications?.eventReminders ?? true,
                commentReplies: user.notifications?.commentReplies ?? true,
            },
        });
        setIsEditing(false);
    };

    return (
        <div className='bg-white shadow rounded-lg'>
            <div className='px-6 py-4 border-b border-gray-200'>
                <div className='flex justify-between items-center'>
                    <h2 className='text-xl font-semibold text-gray-900'>
                        👤 Mijn Profiel
                    </h2>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className='bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm'
                        >
                            ✏️ Bewerken
                        </button>
                    )}
                </div>
            </div>

            <div className='p-6'>
                {isEditing ? (
                    <form onSubmit={handleSubmit} className='space-y-6'>
                        {/* Display Name */}
                        <div>
                            <label
                                htmlFor='displayName'
                                className='block text-sm font-medium text-gray-700'
                            >
                                Weergavenaam
                            </label>
                            <input
                                type='text'
                                id='displayName'
                                name='displayName'
                                value={formData.displayName}
                                onChange={handleInputChange}
                                required
                                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                            />
                        </div>

                        {/* Bio */}
                        <div>
                            <label
                                htmlFor='bio'
                                className='block text-sm font-medium text-gray-700'
                            >
                                Bio
                            </label>
                            <textarea
                                id='bio'
                                name='bio'
                                rows={3}
                                value={formData.bio}
                                onChange={handleInputChange}
                                placeholder='Vertel iets over jezelf en je salsa reis...'
                                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                            />
                        </div>

                        {/* Experience Level */}
                        <div>
                            <label
                                htmlFor='experienceLevel'
                                className='block text-sm font-medium text-gray-700'
                            >
                                Ervaring niveau
                            </label>
                            <select
                                id='experienceLevel'
                                name='experienceLevel'
                                value={formData.experienceLevel}
                                onChange={handleInputChange}
                                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                            >
                                <option value=''>Selecteer je niveau</option>
                                <option value='beginner'>Beginner</option>
                                <option value='intermediate'>
                                    Intermediate
                                </option>
                                <option value='advanced'>Advanced</option>
                                <option value='professional'>
                                    Professional
                                </option>
                            </select>
                        </div>

                        {/* Favorite Event Types */}
                        <div>
                            <fieldset>
                                <legend className='text-sm font-medium text-gray-700'>
                                    Favoriete event types
                                </legend>
                                <div className='mt-2 space-y-2'>
                                    {[
                                        { value: 'party', label: '🎉 Party' },
                                        {
                                            value: 'workshop',
                                            label: '🎓 Workshop',
                                        },
                                        {
                                            value: 'festival',
                                            label: '🎪 Festival',
                                        },
                                        { value: 'social', label: '🤝 Social' },
                                    ].map((eventType) => (
                                        <div
                                            key={eventType.value}
                                            className='flex items-center'
                                        >
                                            <input
                                                id={eventType.value}
                                                name='favoriteEventTypes'
                                                type='checkbox'
                                                value={eventType.value}
                                                checked={formData.favoriteEventTypes.includes(
                                                    eventType.value
                                                )}
                                                onChange={handleEventTypeChange}
                                                className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
                                            />
                                            <label
                                                htmlFor={eventType.value}
                                                className='ml-2 text-sm text-gray-700'
                                            >
                                                {eventType.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </fieldset>
                        </div>

                        {/* Notification Preferences */}
                        <div>
                            <fieldset>
                                <legend className='text-sm font-medium text-gray-700'>
                                    Notificatie voorkeuren
                                </legend>
                                <div className='mt-2 space-y-2'>
                                    <div className='flex items-center'>
                                        <input
                                            id='emailUpdates'
                                            name='emailUpdates'
                                            type='checkbox'
                                            checked={
                                                formData.notifications
                                                    .emailUpdates
                                            }
                                            onChange={handleNotificationChange}
                                            className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
                                        />
                                        <label
                                            htmlFor='emailUpdates'
                                            className='ml-2 text-sm text-gray-700'
                                        >
                                            📧 Email updates over nieuwe events
                                        </label>
                                    </div>
                                    <div className='flex items-center'>
                                        <input
                                            id='eventReminders'
                                            name='eventReminders'
                                            type='checkbox'
                                            checked={
                                                formData.notifications
                                                    .eventReminders
                                            }
                                            onChange={handleNotificationChange}
                                            className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
                                        />
                                        <label
                                            htmlFor='eventReminders'
                                            className='ml-2 text-sm text-gray-700'
                                        >
                                            ⏰ Herinneringen voor events waar ik
                                            ga
                                        </label>
                                    </div>
                                    <div className='flex items-center'>
                                        <input
                                            id='commentReplies'
                                            name='commentReplies'
                                            type='checkbox'
                                            checked={
                                                formData.notifications
                                                    .commentReplies
                                            }
                                            onChange={handleNotificationChange}
                                            className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
                                        />
                                        <label
                                            htmlFor='commentReplies'
                                            className='ml-2 text-sm text-gray-700'
                                        >
                                            💬 Notificaties bij reacties op mijn
                                            comments
                                        </label>
                                    </div>
                                </div>
                            </fieldset>
                        </div>

                        {/* Form Actions */}
                        <div className='flex space-x-3'>
                            <button
                                type='submit'
                                disabled={isLoading}
                                className='bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50'
                            >
                                {isLoading ? 'Opslaan...' : '💾 Opslaan'}
                            </button>
                            <button
                                type='button'
                                onClick={handleCancel}
                                className='bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm'
                            >
                                ❌ Annuleren
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className='space-y-6'>
                        {/* Profile Info Display */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div>
                                <h3 className='text-sm font-medium text-gray-700'>
                                    Weergavenaam
                                </h3>
                                <p className='mt-1 text-sm text-gray-900'>
                                    {user.displayName}
                                </p>
                            </div>
                            <div>
                                <h3 className='text-sm font-medium text-gray-700'>
                                    Email
                                </h3>
                                <p className='mt-1 text-sm text-gray-900'>
                                    {user.email}
                                </p>
                            </div>
                            <div>
                                <h3 className='text-sm font-medium text-gray-700'>
                                    Ervaring niveau
                                </h3>
                                <p className='mt-1 text-sm text-gray-900'>
                                    {user.experienceLevel || 'Niet ingesteld'}
                                </p>
                            </div>
                            <div>
                                <h3 className='text-sm font-medium text-gray-700'>
                                    Favoriete event types
                                </h3>
                                <p className='mt-1 text-sm text-gray-900'>
                                    {user.favoriteEventTypes &&
                                    user.favoriteEventTypes.length > 0
                                        ? user.favoriteEventTypes.join(', ')
                                        : 'Geen voorkeuren ingesteld'}
                                </p>
                            </div>
                        </div>

                        {user.bio && (
                            <div>
                                <h3 className='text-sm font-medium text-gray-700'>
                                    Bio
                                </h3>
                                <p className='mt-1 text-sm text-gray-900'>
                                    {user.bio}
                                </p>
                            </div>
                        )}

                        {/* Account Statistics */}
                        <div className='border-t pt-6'>
                            <h3 className='text-sm font-medium text-gray-700 mb-3'>
                                Account statistieken
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                <div className='bg-blue-50 p-4 rounded-lg'>
                                    <div className='text-2xl font-bold text-blue-600'>
                                        📅
                                    </div>
                                    <div className='text-sm text-gray-600 mt-1'>
                                        Events bijgewoond
                                    </div>
                                </div>
                                <div className='bg-green-50 p-4 rounded-lg'>
                                    <div className='text-2xl font-bold text-green-600'>
                                        💬
                                    </div>
                                    <div className='text-sm text-gray-600 mt-1'>
                                        Comments geplaatst
                                    </div>
                                </div>
                                <div className='bg-purple-50 p-4 rounded-lg'>
                                    <div className='text-2xl font-bold text-purple-600'>
                                        ⭐
                                    </div>
                                    <div className='text-sm text-gray-600 mt-1'>
                                        Gemiddelde rating
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
