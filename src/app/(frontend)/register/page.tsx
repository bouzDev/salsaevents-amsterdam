import React from 'react';
import RegisterForm from '../../../components/auth/RegisterForm';

export default function RegisterPage() {
    return (
        <div className='min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
            <div className='sm:mx-auto sm:w-full sm:max-w-md'>
                <div className='mx-auto w-auto h-20 flex items-center justify-center'>
                    <h1 className='text-3xl font-bold text-gray-900'>
                        🕺 Salsa Events
                    </h1>
                </div>
                <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
                    Create your account
                </h2>
                <p className='mt-2 text-center text-sm text-gray-600'>
                    Or{' '}
                    <a
                        href='/login'
                        className='font-medium text-indigo-600 hover:text-indigo-500'
                    >
                        sign in to your existing account
                    </a>
                </p>
            </div>

            <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
                <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
                    <RegisterForm />
                </div>
            </div>
        </div>
    );
}
