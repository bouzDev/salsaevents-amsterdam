import React from 'react';
import UserDashboard from '../../../components/dashboard/UserDashboard';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function DashboardPage() {
    // Check if user is authenticated
    const cookieStore = cookies();
    const payloadToken = cookieStore.get('payload-token');

    if (!payloadToken) {
        redirect('/login');
    }

    return <UserDashboard />;
}
