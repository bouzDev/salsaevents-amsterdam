'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/public-users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store the token (Payload handles this automatically)
                // Redirect to dashboard
                router.push('/dashboard');
            } else {
                setError(data.message || 'Login failed');
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        autoComplete='current-password'
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                        placeholder='••••••••'
                    />
                </div>
            </div>

            <div className='flex items-center justify-between'>
                <div className='text-sm'>
                    <a
                        href='/forgot-password'
                        className='font-medium text-indigo-600 hover:text-indigo-500'
                    >
                        Wachtwoord vergeten?
                    </a>
                </div>
            </div>

            <div>
                <button
                    type='submit'
                    disabled={isLoading}
                    className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'
                >
                    {isLoading ? 'Inloggen...' : 'Inloggen'}
                </button>
            </div>
        </form>
    );
};

export default LoginForm;
