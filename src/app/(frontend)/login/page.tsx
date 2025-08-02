import React from 'react';
import LoginForm from '../../../components/auth/LoginForm';

export default function LoginPage() {
    return (
        <div className='min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
            <div className='sm:mx-auto sm:w-full sm:max-w-md'>
                <div className='mx-auto w-auto h-20 flex items-center justify-center'>
                    <h1 className='text-3xl font-bold text-gray-900'>
                        🕺 Salsa Events
                    </h1>
                </div>
                <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
                    Login naar je account
                </h2>
                <p className='mt-2 text-center text-sm text-gray-600'>
                    Of{' '}
                    <a
                        href='/register'
                        className='font-medium text-indigo-600 hover:text-indigo-500'
                    >
                        maak een nieuw account aan
                    </a>
                </p>
            </div>

            <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
                <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}
