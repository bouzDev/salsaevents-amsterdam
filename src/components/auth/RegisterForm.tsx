'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const RegisterForm: React.FC = () => {
    const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        password: '',
        confirmPassword: '',
        experienceLevel: '',
        favoriteEventTypes: [] as string[],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Wachtwoorden komen niet overeen');
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Wachtwoord moet minimaal 6 karakters zijn');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/public-users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    displayName: formData.displayName,
                    email: formData.email,
                    password: formData.password,
                    experienceLevel: formData.experienceLevel,
                    favoriteEventTypes: formData.favoriteEventTypes,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Account created successfully
                router.push(
                    '/login?message=Account aangemaakt! Je kunt nu inloggen.'
                );
            } else {
                setError(data.message || 'Registratie mislukt');
            }
        } catch {
            setError('Er is iets misgegaan. Probeer het opnieuw.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className='space-y-6' onSubmit={handleSubmit}>
            {error && (
                <div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded'>
                    {error}
                </div>
            )}

            <div>
                <label
                    htmlFor='displayName'
                    className='block text-sm font-medium text-gray-700'
                >
                    Weergavenaam
                </label>
                <div className='mt-1'>
                    <input
                        id='displayName'
                        name='displayName'
                        type='text'
                        required
                        value={formData.displayName}
                        onChange={handleInputChange}
                        className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                        placeholder='Hoe anderen je zien'
                    />
                </div>
            </div>

            <div>
                <label
                    htmlFor='email'
                    className='block text-sm font-medium text-gray-700'
                >
                    Email adres
                </label>
                <div className='mt-1'>
                    <input
                        id='email'
                        name='email'
                        type='email'
                        autoComplete='email'
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                        placeholder='je@email.com'
                    />
                </div>
            </div>

            <div>
                <label
                    htmlFor='password'
                    className='block text-sm font-medium text-gray-700'
                >
                    Wachtwoord
                </label>
                <div className='mt-1'>
                    <input
                        id='password'
                        name='password'
                        type='password'
                        autoComplete='new-password'
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                        placeholder='Minimaal 6 karakters'
                    />
                </div>
            </div>

            <div>
                <label
                    htmlFor='confirmPassword'
                    className='block text-sm font-medium text-gray-700'
                >
                    Bevestig wachtwoord
                </label>
                <div className='mt-1'>
                    <input
                        id='confirmPassword'
                        name='confirmPassword'
                        type='password'
                        autoComplete='new-password'
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                        placeholder='Herhaal je wachtwoord'
                    />
                </div>
            </div>

            <div>
                <label
                    htmlFor='experienceLevel'
                    className='block text-sm font-medium text-gray-700'
                >
                    Ervaring niveau
                </label>
                <div className='mt-1'>
                    <select
                        id='experienceLevel'
                        name='experienceLevel'
                        value={formData.experienceLevel}
                        onChange={handleInputChange}
                        className='block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                    >
                        <option value=''>Selecteer je niveau</option>
                        <option value='beginner'>Beginner</option>
                        <option value='intermediate'>Intermediate</option>
                        <option value='advanced'>Advanced</option>
                        <option value='professional'>Professional</option>
                    </select>
                </div>
            </div>

            <div>
                <fieldset>
                    <legend className='text-sm font-medium text-gray-700'>
                        Favorite event types (optional)
                    </legend>
                    <div className='mt-2 space-y-2'>
                        {[
                            { value: 'party', label: 'Party' },
                            { value: 'workshop', label: 'Workshop' },
                            { value: 'festival', label: 'Festival' },
                            { value: 'social', label: 'Social' },
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

            <div>
                <button
                    type='submit'
                    disabled={isLoading}
                    className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'
                >
                    {isLoading ? 'Account aanmaken...' : 'Account aanmaken'}
                </button>
            </div>
        </form>
    );
};

export default RegisterForm;
