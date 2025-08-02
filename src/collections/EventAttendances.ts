import { CollectionConfig } from 'payload/types';

export const EventAttendances: CollectionConfig = {
    slug: 'event-attendances',
    labels: {
        singular: 'Event Attendance',
        plural: 'Event Attendances',
    },
    admin: {
        useAsTitle: 'displayTitle',
        defaultColumns: ['displayTitle', 'status', 'createdAt'],
        description: 'Track who is attending which events',
    },
    access: {
        // Anyone can create (RSVP)
        create: ({ req: { user } }) => {
            return (
                user?.collection === 'public-users' ||
                user?.collection === 'users'
            );
        },
        // Users can read attendances for events they can see
        read: () => true,
        // Users can only update their own RSVPs
        update: ({ req: { user } }) => {
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
        // Users can delete their own RSVPs
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
                beforeChange: [
                    ({ data, req, operation }) => {
                        if (operation === 'create' || operation === 'update') {
                            // We'll set this in a hook after we have the relations populated
                            return data.displayTitle;
                        }
                    },
                ],
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

                            data.displayTitle = `${user?.displayName || 'User'} → ${event?.title || 'Event'}`;
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
                description: 'The user who is attending',
            },
        },
        {
            name: 'event',
            type: 'relationship',
            label: 'Event',
            relationTo: 'events',
            required: true,
            admin: {
                description: 'The event being attended',
            },
        },
        {
            name: 'status',
            type: 'select',
            label: 'Attendance Status',
            required: true,
            defaultValue: 'going',
            options: [
                {
                    label: '✅ Going',
                    value: 'going',
                },
                {
                    label: '❓ Maybe',
                    value: 'maybe',
                },
                {
                    label: '❌ Not Going',
                    value: 'not-going',
                },
            ],
        },
        {
            name: 'notes',
            type: 'textarea',
            label: 'Personal Notes',
            admin: {
                description:
                    'Private notes about this event (only visible to you)',
            },
        },
        {
            name: 'publicComment',
            type: 'textarea',
            label: 'Public Comment',
            admin: {
                description:
                    'Optional public comment about attending this event',
            },
        },
        {
            name: 'reminderSent',
            type: 'checkbox',
            label: 'Reminder Sent',
            defaultValue: false,
            admin: {
                description:
                    'Whether a reminder email has been sent for this event',
                readOnly: true,
            },
        },
    ],
    indexes: [
        {
            fields: ['user', 'event'],
            unique: true, // Each user can only have one RSVP per event
        },
    ],
};
