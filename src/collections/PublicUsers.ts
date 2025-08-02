import { CollectionConfig } from 'payload/types';

export const PublicUsers: CollectionConfig = {
    slug: 'public-users',
    labels: {
        singular: 'Public User',
        plural: 'Public Users',
    },
    admin: {
        useAsTitle: 'displayName',
        defaultColumns: ['displayName', 'email', 'createdAt'],
        description: 'Website visitors who registered for event interactions',
    },
    auth: {
        // This enables authentication for this collection
        // Users can login with email/password
        verify: {
            generateEmailHTML: ({ token, user }) => {
                return `Hey ${user.displayName || user.email}, please verify your email by clicking this link: ${process.env.PAYLOAD_PUBLIC_SERVER_URL}/verify?token=${token}`;
            },
            generateEmailSubject: () => 'Verify your Salsa Events account',
        },
        forgotPassword: {
            generateEmailHTML: ({ token, user }) => {
                return `Hey ${user.displayName || user.email}, reset your password by clicking this link: ${process.env.PAYLOAD_PUBLIC_SERVER_URL}/reset-password?token=${token}`;
            },
            generateEmailSubject: () => 'Reset your Salsa Events password',
        },
    },
    access: {
        // Anyone can create an account
        create: () => true,
        // Users can only read their own data
        read: ({ req: { user } }) => {
            if (user?.collection === 'users') {
                // Admin users can read all
                return true;
            }
            if (user?.collection === 'public-users') {
                // Public users can only read their own data
                return {
                    id: {
                        equals: user.id,
                    },
                };
            }
            return false;
        },
        // Users can only update their own data
        update: ({ req: { user } }) => {
            if (user?.collection === 'users') {
                return true;
            }
            if (user?.collection === 'public-users') {
                return {
                    id: {
                        equals: user.id,
                    },
                };
            }
            return false;
        },
        // Only admins can delete
        delete: ({ req: { user } }) => {
            return user?.collection === 'users';
        },
    },
    fields: [
        {
            name: 'displayName',
            type: 'text',
            label: 'Display Name',
            required: true,
            admin: {
                description: 'The name shown to other users',
            },
        },
        {
            name: 'email',
            type: 'email',
            label: 'Email',
            required: true,
            unique: true,
        },
        {
            name: 'avatar',
            type: 'upload',
            label: 'Profile Picture',
            relationTo: 'media',
            admin: {
                description: 'Optional profile picture',
            },
        },
        {
            name: 'bio',
            type: 'textarea',
            label: 'Bio',
            admin: {
                description:
                    'Tell others about yourself and your salsa journey',
            },
        },
        {
            name: 'favoriteEventTypes',
            type: 'select',
            label: 'Favorite Event Types',
            hasMany: true,
            options: [
                { label: 'Party', value: 'party' },
                { label: 'Workshop', value: 'workshop' },
                { label: 'Festival', value: 'festival' },
                { label: 'Social', value: 'social' },
            ],
        },
        {
            name: 'experienceLevel',
            type: 'select',
            label: 'Experience Level',
            options: [
                { label: 'Beginner', value: 'beginner' },
                { label: 'Intermediate', value: 'intermediate' },
                { label: 'Advanced', value: 'advanced' },
                { label: 'Professional', value: 'professional' },
            ],
        },
        {
            name: 'notifications',
            type: 'group',
            label: 'Notification Preferences',
            fields: [
                {
                    name: 'emailUpdates',
                    type: 'checkbox',
                    label: 'Email updates about new events',
                    defaultValue: true,
                },
                {
                    name: 'eventReminders',
                    type: 'checkbox',
                    label: "Reminders for events I'm attending",
                    defaultValue: true,
                },
                {
                    name: 'commentReplies',
                    type: 'checkbox',
                    label: 'Notify when someone replies to my comments',
                    defaultValue: true,
                },
            ],
        },
    ],
};
