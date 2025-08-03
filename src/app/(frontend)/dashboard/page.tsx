import React from 'react';
import UserDashboard from '../../../components/dashboard/UserDashboard';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function DashboardPage() {
    // Check if user is authenticated
    const cookieStore = await cookies();
    const payloadToken = cookieStore.get('payload-token');

    if (!payloadToken) {
        redirect('/login');
    }

    // Fetch user data
    let user = null;
    try {
        const baseUrl =
            process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/public-users/me`, {
            headers: {
                Cookie: `payload-token=${payloadToken.value}`,
            },
            cache: 'no-store',
        });

        if (response.ok) {
            const userData = await response.json();
            user = userData.user;
        }
    } catch (error) {
        console.error('Failed to fetch user data:', error);
    }

    // If we can't get user data but have a token, redirect to login
    if (!user) {
        redirect('/login');
    }

    return <UserDashboard initialUser={user} />;
}
