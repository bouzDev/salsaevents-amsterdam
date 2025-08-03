'use client';

import React, { useState, useEffect } from 'react';

interface User {
    id: string;
    displayName: string;
}

interface EventAttendance {
    id: string;
    status: 'going' | 'maybe' | 'not-going';
    publicComment?: string;
    notes?: string;
}

interface EventRSVPProps {
    eventId: string;
    user: User | null;
    isLoadingUser: boolean;
}

const EventRSVP: React.FC<EventRSVPProps> = ({
    eventId,
    user,
    isLoadingUser,
}) => {
    const [attendance, setAttendance] = useState<EventAttendance | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [publicComment, setPublicComment] = useState('');
    const [attendeeCount, setAttendeeCount] = useState({ going: 0, maybe: 0 });

    useEffect(() => {
        if (user) {
            loadCurrentAttendance();
        }
        loadAttendeeCount();
    }, [user, eventId]);

    const loadCurrentAttendance = async () => {
        if (!user?.id) {
            console.log('No user ID, skipping attendance load');
            return;
        }

        setIsLoading(true);
        try {
            console.log('Loading attendance for:', {
                userId: user.id,
                eventId,
            });

            // First check if user is authenticated
            const authCheck = await fetch('/api/public-users/me', {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Auth check status:', authCheck.status);

            const response = await fetch(
                `/api/event-attendances?where[event][equals]=${eventId}&where[user][equals]=${user.id}`,
                {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('Load attendance response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('Load attendance data:', data);
                if (data.docs && data.docs.length > 0) {
                    setAttendance(data.docs[0]);
                    setPublicComment(data.docs[0].publicComment || '');
                } else {
                    console.log('No existing attendance found');
                }
            } else {
                let errorText = '';
                try {
                    errorText = await response.text();
                } catch (e) {
                    errorText = 'Unable to read error response';
                }
                console.error('Failed to load attendance:', {
                    status: response.status,
                    statusText: response.statusText,
                    url: response.url,
                    error: errorText,
                    userId: user?.id,
                    eventId,
                });
            }
        } catch (error) {
            console.error('Failed to load attendance:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadAttendeeCount = async () => {
        try {
            const [goingResponse, maybeResponse] = await Promise.all([
                fetch(
                    `/api/event-attendances?where[event][equals]=${eventId}&where[status][equals]=going`,
                    {
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                ),
                fetch(
                    `/api/event-attendances?where[event][equals]=${eventId}&where[status][equals]=maybe`,
                    {
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                ),
            ]);

            const [goingData, maybeData] = await Promise.all([
                goingResponse.json(),
                maybeResponse.json(),
            ]);

            setAttendeeCount({
                going: goingData.totalDocs || 0,
                maybe: maybeData.totalDocs || 0,
            });
        } catch (error) {
            console.error('Failed to load attendee count:', error);
        }
    };

    const handleRSVP = async (status: 'going' | 'maybe' | 'not-going') => {
        if (!user) {
            console.log('No user, redirecting to login');
            window.location.href = '/login';
            return;
        }

        setIsSubmitting(true);
        try {
            let response;

            console.log('RSVP attempt:', {
                userId: user.id,
                eventId,
                status,
                attendance,
            });

            // Check authentication before RSVP
            const authCheck = await fetch('/api/public-users/me', {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Auth check for RSVP:', authCheck.status);

            if (!authCheck.ok) {
                console.log('User not authenticated, redirecting to login');
                window.location.href = '/login';
                return;
            }

            if (attendance) {
                // Update existing attendance
                console.log('Updating existing attendance:', attendance.id);
                response = await fetch(
                    `/api/event-attendances/${attendance.id}`,
                    {
                        method: 'PATCH',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            status,
                            publicComment:
                                status !== 'not-going'
                                    ? publicComment
                                    : undefined,
                        }),
                    }
                );
            } else {
                // Create new attendance
                console.log('Creating new attendance');
                response = await fetch('/api/event-attendances', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        event: eventId,
                        user: user.id,
                        status,
                        publicComment:
                            status !== 'not-going' ? publicComment : undefined,
                    }),
                });
            }

            console.log('API Response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('RSVP success:', data);
                setAttendance(data.doc || data);
                setShowCommentForm(false);

                // Refresh attendee count
                loadAttendeeCount();
            } else {
                let errorText = '';
                try {
                    errorText = await response.text();
                } catch (e) {
                    errorText = 'Unable to read error response';
                }
                console.error('RSVP failed:', {
                    status: response.status,
                    statusText: response.statusText,
                    url: response.url,
                    error: errorText,
                    requestBody: {
                        event: eventId,
                        user: user?.id,
                        status,
                        publicComment:
                            status !== 'not-going' ? publicComment : undefined,
                    },
                });
            }
        } catch (error) {
            console.error('RSVP error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingUser) {
        return (
            <div className='bg-white rounded-lg shadow p-6'>
                <div className='animate-pulse'>
                    <div className='h-4 bg-gray-200 rounded w-1/2 mb-4'></div>
                    <div className='space-y-2'>
                        <div className='h-8 bg-gray-200 rounded'></div>
                        <div className='h-8 bg-gray-200 rounded'></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>RSVP</h3>

            {/* Attendee Count */}
            <div className='mb-6 p-4 bg-gray-50 rounded-lg'>
                <div className='flex justify-between items-center text-sm'>
                    <div className='flex items-center space-x-4'>
                        <div className='flex items-center'>
                            <span className='text-green-600 mr-1'>Going:</span>
                            <span className='font-medium'>
                                {attendeeCount.going}
                            </span>
                            <span className='text-gray-600 ml-1'>going</span>
                        </div>
                        <div className='flex items-center'>
                            <span className='text-yellow-600 mr-1'>?</span>
                            <span className='font-medium'>
                                {attendeeCount.maybe}
                            </span>
                            <span className='text-gray-600 ml-1'>maybe</span>
                        </div>
                    </div>
                </div>
            </div>

            {!user ? (
                <div className='text-center py-4'>
                    <p className='text-gray-600 mb-4'>
                        Sign in to let us know if you're coming!
                    </p>
                    <div className='space-y-2'>
                        <a
                            href='/login'
                            className='w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-center block'
                        >
                            Login
                        </a>
                        <a
                            href='/register'
                            className='w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md text-center block'
                        >
                            Create Account
                        </a>
                    </div>
                </div>
            ) : (
                <div className='space-y-4'>
                    {/* Current Status */}
                    {attendance && (
                        <div className='p-3 bg-blue-50 rounded-lg'>
                            <div className='flex items-center'>
                                <span className='mr-2'>
                                    {attendance.status === 'going'
                                        ? 'Going'
                                        : attendance.status === 'maybe'
                                          ? 'Maybe'
                                          : 'Not Going'}
                                </span>
                                <span className='text-sm text-blue-800'>
                                    You indicated:{' '}
                                    <strong>
                                        {attendance.status === 'going'
                                            ? "I'm going!"
                                            : attendance.status === 'maybe'
                                              ? 'Maybe'
                                              : 'Not going'}
                                    </strong>
                                </span>
                            </div>
                        </div>
                    )}

                    {/* RSVP Buttons */}
                    <div className='space-y-2'>
                        <button
                            onClick={() => handleRSVP('going')}
                            disabled={isSubmitting}
                            className={`w-full py-2 px-4 rounded-md font-medium ${
                                attendance?.status === 'going'
                                    ? 'bg-green-100 text-green-800 border border-green-300'
                                    : 'bg-green-600 hover:bg-green-700 text-white'
                            } disabled:opacity-50`}
                        >
                            I'm going!
                        </button>

                        <button
                            onClick={() => handleRSVP('maybe')}
                            disabled={isSubmitting}
                            className={`w-full py-2 px-4 rounded-md font-medium ${
                                attendance?.status === 'maybe'
                                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                                    : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                            } disabled:opacity-50`}
                        >
                            Maybe
                        </button>

                        <button
                            onClick={() => handleRSVP('not-going')}
                            disabled={isSubmitting}
                            className={`w-full py-2 px-4 rounded-md font-medium ${
                                attendance?.status === 'not-going'
                                    ? 'bg-red-100 text-red-800 border border-red-300'
                                    : 'bg-red-600 hover:bg-red-700 text-white'
                            } disabled:opacity-50`}
                        >
                            Not going
                        </button>
                    </div>

                    {/* Optional Comment Section - only show after RSVP */}
                    {attendance && (
                        <div className='mt-4 border-t pt-4'>
                            {!showCommentForm ? (
                                <div>
                                    {attendance.publicComment ? (
                                        <div className='p-3 bg-blue-50 rounded-lg'>
                                            <p className='text-sm text-blue-800'>
                                                <strong>Your comment:</strong>{' '}
                                                {attendance.publicComment}
                                            </p>
                                            <button
                                                onClick={() => {
                                                    setPublicComment(
                                                        attendance.publicComment ||
                                                            ''
                                                    );
                                                    setShowCommentForm(true);
                                                }}
                                                className='mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium'
                                            >
                                                Edit comment
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setPublicComment('');
                                                setShowCommentForm(true);
                                            }}
                                            className='text-indigo-600 hover:text-indigo-800 text-sm font-medium'
                                        >
                                            + Add a comment (optional)
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className='p-4 bg-gray-50 rounded-lg'>
                                    <label
                                        htmlFor='publicComment'
                                        className='block text-sm font-medium text-gray-700 mb-2'
                                    >
                                        Add a comment (optional)
                                    </label>
                                    <textarea
                                        id='publicComment'
                                        value={publicComment}
                                        onChange={(e) =>
                                            setPublicComment(e.target.value)
                                        }
                                        placeholder="Let others know why you're coming or what you expect..."
                                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                                        rows={3}
                                    />
                                    <div className='mt-3 flex space-x-2'>
                                        <button
                                            onClick={() => {
                                                // Update attendance with comment
                                                const currentStatus =
                                                    attendance.status;
                                                handleRSVP(currentStatus);
                                            }}
                                            disabled={isSubmitting}
                                            className='bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm font-medium disabled:opacity-50'
                                        >
                                            Save comment
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowCommentForm(false);
                                                setPublicComment(
                                                    attendance.publicComment ||
                                                        ''
                                                );
                                            }}
                                            className='bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md text-sm'
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default EventRSVP;
