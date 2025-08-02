'use client';

import React, { useState, useEffect } from 'react';

interface User {
    id: string;
    displayName: string;
}

interface Comment {
    id: string;
    comment: string;
    rating?: string;
    isApproved: boolean;
    isEdited: boolean;
    editedAt?: string;
    createdAt: string;
    user: {
        id: string;
        displayName: string;
    };
    parentComment?: string;
}

interface EventCommentsProps {
    eventId: string;
    user: User | null;
}

const EventComments: React.FC<EventCommentsProps> = ({ eventId, user }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [newRating, setNewRating] = useState('');
    const [editingComment, setEditingComment] = useState<string | null>(null);
    const [editingText, setEditingText] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');

    useEffect(() => {
        loadComments();
    }, [eventId]);

    const loadComments = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `/api/event-comments?where[event][equals]=${eventId}&sort=-createdAt&depth=1`
            );
            if (response.ok) {
                const data = await response.json();
                setComments(data.docs || []);
            }
        } catch (error) {
            console.error('Failed to load comments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newComment.trim()) return;

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/event-comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    event: eventId,
                    comment: newComment.trim(),
                    rating: newRating || undefined,
                }),
            });

            if (response.ok) {
                setNewComment('');
                setNewRating('');
                loadComments(); // Refresh comments
            }
        } catch (error) {
            console.error('Failed to submit comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditComment = async (commentId: string) => {
        if (!editingText.trim()) return;

        try {
            const response = await fetch(`/api/event-comments/${commentId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    comment: editingText.trim(),
                }),
            });

            if (response.ok) {
                setEditingComment(null);
                setEditingText('');
                loadComments();
            }
        } catch (error) {
            console.error('Failed to edit comment:', error);
        }
    };

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !replyText.trim() || !replyingTo) return;

        try {
            const response = await fetch('/api/event-comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    event: eventId,
                    comment: replyText.trim(),
                    parentComment: replyingTo,
                }),
            });

            if (response.ok) {
                setReplyingTo(null);
                setReplyText('');
                loadComments();
            }
        } catch (error) {
            console.error('Failed to submit reply:', error);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!confirm('Weet je zeker dat je deze comment wilt verwijderen?'))
            return;

        try {
            const response = await fetch(`/api/event-comments/${commentId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                loadComments();
            }
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

    const getRatingStars = (rating: string) => {
        const num = parseInt(rating);
        return '⭐'.repeat(num);
    };

    // Separate parent comments and replies
    const parentComments = comments.filter((comment) => !comment.parentComment);
    const getReplies = (parentId: string) => {
        return comments.filter((comment) => comment.parentComment === parentId);
    };

    if (isLoading) {
        return (
            <div className='bg-white rounded-lg shadow p-6'>
                <h2 className='text-xl font-bold text-gray-900 mb-4'>
                    💬 Comments
                </h2>
                <div className='animate-pulse space-y-4'>
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className='space-y-3'>
                            <div className='h-4 bg-gray-200 rounded w-1/4'></div>
                            <div className='h-4 bg-gray-200 rounded'></div>
                            <div className='h-4 bg-gray-200 rounded w-5/6'></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className='bg-white rounded-lg shadow p-6'>
            <h2 className='text-xl font-bold text-gray-900 mb-6'>
                💬 Comments (
                {
                    comments.filter(
                        (c) => c.isApproved || (user && c.user.id === user.id)
                    ).length
                }
                )
            </h2>

            {/* New Comment Form */}
            {user ? (
                <form
                    onSubmit={handleSubmitComment}
                    className='mb-8 p-4 bg-gray-50 rounded-lg'
                >
                    <div className='mb-4'>
                        <label
                            htmlFor='newComment'
                            className='block text-sm font-medium text-gray-700 mb-2'
                        >
                            Deel je ervaring:
                        </label>
                        <textarea
                            id='newComment'
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder='Hoe was dit event? Deel je ervaring...'
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                            rows={3}
                            required
                        />
                    </div>

                    <div className='mb-4'>
                        <label
                            htmlFor='newRating'
                            className='block text-sm font-medium text-gray-700 mb-2'
                        >
                            Rating (optioneel):
                        </label>
                        <select
                            id='newRating'
                            value={newRating}
                            onChange={(e) => setNewRating(e.target.value)}
                            className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                        >
                            <option value=''>Geen rating</option>
                            <option value='1'>⭐ 1 ster</option>
                            <option value='2'>⭐⭐ 2 sterren</option>
                            <option value='3'>⭐⭐⭐ 3 sterren</option>
                            <option value='4'>⭐⭐⭐⭐ 4 sterren</option>
                            <option value='5'>⭐⭐⭐⭐⭐ 5 sterren</option>
                        </select>
                    </div>

                    <button
                        type='submit'
                        disabled={isSubmitting || !newComment.trim()}
                        className='bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md disabled:opacity-50'
                    >
                        {isSubmitting ? 'Plaatsen...' : '📝 Comment plaatsen'}
                    </button>

                    <p className='text-xs text-gray-500 mt-2'>
                        💡 Comments worden eerst gecontroleerd voordat ze
                        zichtbaar zijn voor andere gebruikers.
                    </p>
                </form>
            ) : (
                <div className='mb-8 p-4 bg-gray-50 rounded-lg text-center'>
                    <p className='text-gray-600 mb-4'>
                        Meld je aan om een comment achter te laten!
                    </p>
                    <div className='space-x-2'>
                        <a
                            href='/login'
                            className='bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm'
                        >
                            Inloggen
                        </a>
                        <a
                            href='/register'
                            className='bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm'
                        >
                            Registreren
                        </a>
                    </div>
                </div>
            )}

            {/* Comments List */}
            <div className='space-y-6'>
                {parentComments.length === 0 ? (
                    <div className='text-center py-8'>
                        <div className='text-4xl mb-4'>💭</div>
                        <p className='text-gray-600'>
                            Nog geen comments. Wees de eerste om je ervaring te
                            delen!
                        </p>
                    </div>
                ) : (
                    parentComments.map((comment) => {
                        // Only show approved comments or user's own comments
                        if (
                            !comment.isApproved &&
                            (!user || comment.user.id !== user.id)
                        ) {
                            return null;
                        }

                        const replies = getReplies(comment.id);
                        const isOwn = user && comment.user.id === user.id;

                        return (
                            <div
                                key={comment.id}
                                className='border-b border-gray-200 pb-6 last:border-b-0'
                            >
                                {/* Main Comment */}
                                <div className='flex items-start space-x-3'>
                                    <div className='flex-shrink-0'>
                                        <div className='w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center'>
                                            <span className='text-indigo-600 font-medium text-sm'>
                                                {comment.user.displayName
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className='flex-1 min-w-0'>
                                        <div className='flex items-center space-x-2 mb-1'>
                                            <p className='text-sm font-medium text-gray-900'>
                                                {comment.user.displayName}
                                            </p>
                                            {comment.rating && (
                                                <span className='text-sm'>
                                                    {getRatingStars(
                                                        comment.rating
                                                    )}
                                                </span>
                                            )}
                                            {!comment.isApproved && isOwn && (
                                                <span className='bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded'>
                                                    In afwachting van
                                                    goedkeuring
                                                </span>
                                            )}
                                            {comment.isEdited && (
                                                <span className='text-gray-400 text-xs'>
                                                    (bewerkt)
                                                </span>
                                            )}
                                        </div>

                                        <p className='text-sm text-gray-500 mb-2'>
                                            {new Date(
                                                comment.createdAt
                                            ).toLocaleDateString('nl-NL', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>

                                        {editingComment === comment.id ? (
                                            <div className='space-y-3'>
                                                <textarea
                                                    value={editingText}
                                                    onChange={(e) =>
                                                        setEditingText(
                                                            e.target.value
                                                        )
                                                    }
                                                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                                                    rows={3}
                                                />
                                                <div className='flex space-x-2'>
                                                    <button
                                                        onClick={() =>
                                                            handleEditComment(
                                                                comment.id
                                                            )
                                                        }
                                                        className='bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm'
                                                    >
                                                        Opslaan
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setEditingComment(
                                                                null
                                                            );
                                                            setEditingText('');
                                                        }}
                                                        className='bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-1 rounded text-sm'
                                                    >
                                                        Annuleren
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <p className='text-gray-700 leading-relaxed'>
                                                    {comment.comment}
                                                </p>

                                                <div className='mt-3 flex items-center space-x-4 text-sm'>
                                                    {user && (
                                                        <button
                                                            onClick={() =>
                                                                setReplyingTo(
                                                                    comment.id
                                                                )
                                                            }
                                                            className='text-indigo-600 hover:text-indigo-800'
                                                        >
                                                            💬 Reageren
                                                        </button>
                                                    )}

                                                    {isOwn &&
                                                        !comment.isApproved && (
                                                            <>
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingComment(
                                                                            comment.id
                                                                        );
                                                                        setEditingText(
                                                                            comment.comment
                                                                        );
                                                                    }}
                                                                    className='text-gray-600 hover:text-gray-800'
                                                                >
                                                                    ✏️ Bewerken
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handleDeleteComment(
                                                                            comment.id
                                                                        )
                                                                    }
                                                                    className='text-red-600 hover:text-red-800'
                                                                >
                                                                    🗑️
                                                                    Verwijderen
                                                                </button>
                                                            </>
                                                        )}
                                                </div>
                                            </>
                                        )}

                                        {/* Reply Form */}
                                        {replyingTo === comment.id && (
                                            <form
                                                onSubmit={handleReply}
                                                className='mt-4 p-3 bg-gray-50 rounded-lg'
                                            >
                                                <textarea
                                                    value={replyText}
                                                    onChange={(e) =>
                                                        setReplyText(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder={`Reageer op ${comment.user.displayName}...`}
                                                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                                                    rows={2}
                                                    required
                                                />
                                                <div className='mt-2 flex space-x-2'>
                                                    <button
                                                        type='submit'
                                                        className='bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm'
                                                    >
                                                        Reageren
                                                    </button>
                                                    <button
                                                        type='button'
                                                        onClick={() => {
                                                            setReplyingTo(null);
                                                            setReplyText('');
                                                        }}
                                                        className='bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-1 rounded text-sm'
                                                    >
                                                        Annuleren
                                                    </button>
                                                </div>
                                            </form>
                                        )}

                                        {/* Replies */}
                                        {replies.length > 0 && (
                                            <div className='mt-4 space-y-4'>
                                                {replies.map((reply) => {
                                                    // Only show approved replies or user's own replies
                                                    if (
                                                        !reply.isApproved &&
                                                        (!user ||
                                                            reply.user.id !==
                                                                user.id)
                                                    ) {
                                                        return null;
                                                    }

                                                    const isOwnReply =
                                                        user &&
                                                        reply.user.id ===
                                                            user.id;

                                                    return (
                                                        <div
                                                            key={reply.id}
                                                            className='flex items-start space-x-3 ml-8 pl-4 border-l-2 border-gray-200'
                                                        >
                                                            <div className='flex-shrink-0'>
                                                                <div className='w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center'>
                                                                    <span className='text-gray-600 font-medium text-xs'>
                                                                        {reply.user.displayName
                                                                            .charAt(
                                                                                0
                                                                            )
                                                                            .toUpperCase()}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className='flex-1 min-w-0'>
                                                                <div className='flex items-center space-x-2 mb-1'>
                                                                    <p className='text-sm font-medium text-gray-900'>
                                                                        {
                                                                            reply
                                                                                .user
                                                                                .displayName
                                                                        }
                                                                    </p>
                                                                    {!reply.isApproved &&
                                                                        isOwnReply && (
                                                                            <span className='bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded'>
                                                                                Wacht
                                                                                op
                                                                                goedkeuring
                                                                            </span>
                                                                        )}
                                                                </div>
                                                                <p className='text-xs text-gray-500 mb-1'>
                                                                    {new Date(
                                                                        reply.createdAt
                                                                    ).toLocaleDateString(
                                                                        'nl-NL',
                                                                        {
                                                                            month: 'short',
                                                                            day: 'numeric',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit',
                                                                        }
                                                                    )}
                                                                </p>
                                                                <p className='text-gray-700 text-sm'>
                                                                    {
                                                                        reply.comment
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default EventComments;
