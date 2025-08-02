import { CollectionConfig } from 'payload/types';

export const EventComments: CollectionConfig = {
    slug: 'event-comments',
    labels: {
        singular: 'Event Comment',
        plural: 'Event Comments',
    },
    admin: {
        useAsTitle: 'displayTitle',
        defaultColumns: ['displayTitle', 'isApproved', 'createdAt'],
        description: 'Comments left by users on events',
    },
    access: {
        // Authenticated users can create comments
        create: ({ req: { user } }) => {
            return (
                user?.collection === 'public-users' ||
                user?.collection === 'users'
            );
        },
        // Anyone can read approved comments
        read: ({ req: { user } }) => {
            if (user?.collection === 'users') {
                // Admins can see all comments
                return true;
            }
            if (user?.collection === 'public-users') {
                // Public users can see approved comments + their own
                return {
                    or: [
                        {
                            isApproved: {
                                equals: true,
                            },
                        },
                        {
                            user: {
                                equals: user.id,
                            },
                        },
                    ],
                };
            }
            // Non-authenticated users can only see approved comments
            return {
                isApproved: {
                    equals: true,
                },
            };
        },
        // Users can update their own comments (if not approved yet)
        update: ({ req: { user } }) => {
            if (user?.collection === 'users') {
                return true;
            }
            if (user?.collection === 'public-users') {
                return {
                    and: [
                        {
                            user: {
                                equals: user.id,
                            },
                        },
                        {
                            isApproved: {
                                equals: false,
                            },
                        },
                    ],
                };
            }
            return false;
        },
        // Users can delete their own comments, admins can delete any
        delete: ({ req: { user } }) => {
            if (user?.collection === 'users') {
                return true;
            }
            if (user?.collection === 'public-users') {
                return {
                    user: {
                        equals: user.id,
                    },
                };
            }
            return false;
        },
    },
    fields: [
        {
            name: 'displayTitle',
            type: 'text',
            admin: {
                hidden: true,
            },
            hooks: {
                afterRead: [
                    async ({ data, req }) => {
                        if (data.user && data.event) {
                            const user =
                                typeof data.user === 'object'
                                    ? data.user
                                    : await req.payload.findByID({
                                          collection: 'public-users',
                                          id: data.user,
                                      });
                            const event =
                                typeof data.event === 'object'
                                    ? data.event
                                    : await req.payload.findByID({
                                          collection: 'events',
                                          id: data.event,
                                      });

                            const commentPreview = data.comment
                                ? data.comment.substring(0, 50) +
                                  (data.comment.length > 50 ? '...' : '')
                                : 'No comment';

                            data.displayTitle = `${user?.displayName || 'User'} on ${event?.title || 'Event'}: ${commentPreview}`;
                        }
                        return data;
                    },
                ],
            },
        },
        {
            name: 'user',
            type: 'relationship',
            label: 'User',
            relationTo: 'public-users',
            required: true,
            admin: {
                description: 'The user who wrote this comment',
            },
        },
        {
            name: 'event',
            type: 'relationship',
            label: 'Event',
            relationTo: 'events',
            required: true,
            admin: {
                description: 'The event this comment is about',
            },
        },
        {
            name: 'comment',
            type: 'textarea',
            label: 'Comment',
            required: true,
            admin: {
                description: 'The comment text',
            },
            validate: (val) => {
                if (!val || val.length < 5) {
                    return 'Comment must be at least 5 characters long';
                }
                if (val.length > 1000) {
                    return 'Comment cannot be longer than 1000 characters';
                }
                return true;
            },
        },
        {
            name: 'isApproved',
            type: 'checkbox',
            label: 'Approved',
            defaultValue: false,
            admin: {
                description:
                    'Whether this comment is approved and visible to other users',
            },
            access: {
                // Only admins can approve comments
                update: ({ req: { user } }) => {
                    return user?.collection === 'users';
                },
            },
        },
        {
            name: 'rating',
            type: 'select',
            label: 'Event Rating',
            admin: {
                description: 'Optional rating for the event (1-5 stars)',
            },
            options: [
                { label: '⭐ 1 Star', value: '1' },
                { label: '⭐⭐ 2 Stars', value: '2' },
                { label: '⭐⭐⭐ 3 Stars', value: '3' },
                { label: '⭐⭐⭐⭐ 4 Stars', value: '4' },
                { label: '⭐⭐⭐⭐⭐ 5 Stars', value: '5' },
            ],
        },
        {
            name: 'parentComment',
            type: 'relationship',
            label: 'Reply to Comment',
            relationTo: 'event-comments',
            admin: {
                description: 'If this is a reply to another comment',
            },
        },
        {
            name: 'isEdited',
            type: 'checkbox',
            label: 'Edited',
            defaultValue: false,
            admin: {
                description: 'Whether this comment has been edited',
                readOnly: true,
            },
        },
        {
            name: 'editedAt',
            type: 'date',
            label: 'Last Edited',
            admin: {
                description: 'When this comment was last edited',
                readOnly: true,
            },
        },
    ],
    hooks: {
        beforeChange: [
            ({ operation, data, originalDoc }) => {
                if (operation === 'update' && originalDoc) {
                    // Check if comment text was changed
                    if (data.comment !== originalDoc.comment) {
                        data.isEdited = true;
                        data.editedAt = new Date().toISOString();
                        // Reset approval if content changed
                        data.isApproved = false;
                    }
                }
                return data;
            },
        ],
    },
};
