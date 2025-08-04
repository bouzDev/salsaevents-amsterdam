import type { CollectionConfig } from 'payload';

export const Events: CollectionConfig = {
    slug: 'events',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'slug', 'date', 'venue', 'city', 'type'],
        description:
            'Manage your salsa events. Want to bulk import? Go to: /admin/collections/events/import',
        components: {
            BeforeList: ['@/components/admin/ImportButton'],
        },
    },
    access: {
        read: () => true, // Public read access
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
            label: 'Event Title',
        },
        {
            name: 'slug',
            type: 'text',
            label: 'URL Slug',
            required: true,
            unique: true,
            admin: {
                description:
                    'URL-friendly version of the title (e.g., "salsa-party-amsterdam-friday")',
            },
            validate: (val: string) => {
                if (!val) return 'Slug is required';
                if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(val)) {
                    return 'Slug must contain only lowercase letters, numbers, and hyphens';
                }
                return true;
            },
            hooks: {
                beforeChange: [
                    ({ value, data }) => {
                        // If slug is empty, generate from title
                        if (!value && data?.title) {
                            return data.title
                                .toLowerCase()
                                .trim()
                                .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
                                .replace(/\s+/g, '-') // Replace spaces with hyphens
                                .replace(/-+/g, '-') // Replace multiple hyphens with single
                                .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
                        }

                        // If slug exists, clean it up
                        if (typeof value === 'string') {
                            return value
                                .toLowerCase()
                                .trim()
                                .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
                                .replace(/\s+/g, '-') // Replace spaces with hyphens
                                .replace(/-+/g, '-') // Replace multiple hyphens with single
                                .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
                        }
                        return value;
                    },
                ],
            },
        },
        {
            name: 'description',
            type: 'textarea',
            label: 'Description',
        },
        {
            name: 'date',
            type: 'date',
            required: true,
            label: 'Date',
            admin: {
                date: {
                    pickerAppearance: 'dayOnly',
                },
            },
        },
        {
            name: 'time',
            type: 'text',
            label: 'Time',
            admin: {
                placeholder: '20:00-23:00',
            },
        },
        {
            name: 'venue',
            type: 'text',
            required: true,
            label: 'Venue',
        },
        {
            name: 'city',
            type: 'text',
            required: true,
            label: 'City',
            defaultValue: 'Amsterdam',
        },
        {
            name: 'type',
            type: 'select',
            required: true,
            label: 'Event Type',
            options: [
                { label: 'Party', value: 'party' },
                { label: 'Workshop', value: 'workshop' },
                { label: 'Festival', value: 'festival' },
                { label: 'Social', value: 'social' },
            ],
        },
        {
            name: 'url',
            type: 'text',
            label: 'Event URL',
            admin: {
                placeholder: 'https://...',
            },
        },
        {
            name: 'price',
            type: 'text',
            label: 'Price',
            admin: {
                placeholder: '€15 or Free',
            },
        },
        {
            name: 'tags',
            type: 'text',
            label: 'Tags',
            admin: {
                placeholder: 'salsa, bachata, social (separated by commas)',
            },
        },
        {
            name: 'vibe',
            type: 'textarea',
            label: 'Vibe/Atmosphere',
            admin: {
                placeholder: 'Describe the atmosphere of the event...',
            },
        },
        {
            name: 'imageUrl',
            type: 'text',
            label: 'Image URL',
            admin: {
                placeholder: 'https://...',
            },
        },
        {
            name: 'isRecurring',
            type: 'checkbox',
            label: 'Recurring Event',
            defaultValue: false,
        },
        {
            name: 'frequency',
            type: 'select',
            label: 'Frequency',
            admin: {
                condition: (data) => data.isRecurring,
            },
            options: [
                { label: 'Weekly', value: 'weekly' },
                { label: 'Monthly', value: 'monthly' },
                { label: 'Daily', value: 'daily' },
            ],
        },
    ],
    hooks: {
        beforeChange: [
            ({ data }) => {
                // Auto-generate slug from title if not provided
                if (!data.slug && data.title) {
                    data.slug = data.title
                        .toLowerCase()
                        .trim()
                        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
                        .replace(/\s+/g, '-') // Replace spaces with hyphens
                        .replace(/-+/g, '-') // Replace multiple hyphens with single
                        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
                }

                // Process tags string into array format for consistency
                if (data.tags && typeof data.tags === 'string') {
                    data.tagsArray = data.tags
                        .split(',')
                        .map((tag: string) => tag.trim());
                }
                return data;
            },
        ],
        afterChange: [
            async ({ doc, operation }) => {
                // Trigger revalidation after event changes
                try {
                    const revalidationUrl = `${process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/revalidate`;
                    const revalidationToken = process.env.REVALIDATION_TOKEN;

                    if (!revalidationToken) {
                        console.warn(
                            'REVALIDATION_TOKEN not set, skipping revalidation'
                        );
                        return;
                    }

                    const revalidationType =
                        operation === 'create'
                            ? 'event-created'
                            : 'event-updated';

                    const response = await fetch(revalidationUrl, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${revalidationToken}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            type: revalidationType,
                            eventId: doc.id,
                            eventSlug: doc.slug,
                        }),
                    });

                    if (response.ok) {
                        console.log(
                            `✅ Revalidation triggered for event: ${doc.title} (${revalidationType})`
                        );
                    } else {
                        console.error(
                            '❌ Revalidation failed:',
                            response.status,
                            response.statusText
                        );
                    }
                } catch (error) {
                    console.error('❌ Revalidation error:', error);
                }
            },
        ],
        afterDelete: [
            async ({ doc }) => {
                // Trigger revalidation after event deletion
                try {
                    const revalidationUrl = `${process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/revalidate`;
                    const revalidationToken = process.env.REVALIDATION_TOKEN;

                    if (!revalidationToken) {
                        console.warn(
                            'REVALIDATION_TOKEN not set, skipping revalidation'
                        );
                        return;
                    }

                    const response = await fetch(revalidationUrl, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${revalidationToken}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            type: 'event-deleted',
                            eventId: doc.id,
                            eventSlug: doc.slug,
                        }),
                    });

                    if (response.ok) {
                        console.log(
                            `✅ Revalidation triggered for deleted event: ${doc.title}`
                        );
                    } else {
                        console.error(
                            '❌ Revalidation failed:',
                            response.status,
                            response.statusText
                        );
                    }
                } catch (error) {
                    console.error('❌ Revalidation error:', error);
                }
            },
        ],
    },
};
