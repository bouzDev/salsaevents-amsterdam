import { getPayload } from 'payload';

// Helper function to generate slug from title
function generateSlug(title) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

async function addSlugsToEvents() {
    try {
        console.log('Starting slug generation for existing events...');

        const payload = await getPayload({
            config: await import('../src/payload.config.ts').then(
                (mod) => mod.default
            ),
        });

        // Get all events without slugs
        const result = await payload.find({
            collection: 'events',
            limit: 1000,
            where: {
                or: [{ slug: { equals: null } }, { slug: { equals: '' } }],
            },
        });

        console.log(`Found ${result.docs.length} events without slugs`);

        if (result.docs.length === 0) {
            console.log('All events already have slugs!');
            return;
        }

        // Update each event with a slug
        for (let i = 0; i < result.docs.length; i++) {
            const event = result.docs[i];
            let baseSlug = generateSlug(event.title);
            let slug = baseSlug;
            let counter = 1;

            // Check for slug uniqueness
            while (true) {
                const existing = await payload.find({
                    collection: 'events',
                    where: {
                        slug: { equals: slug },
                        id: { not_equals: event.id },
                    },
                    limit: 1,
                });

                if (existing.docs.length === 0) {
                    break; // Slug is unique
                }

                // Add counter to make it unique
                slug = `${baseSlug}-${counter}`;
                counter++;
            }

            // Update the event
            await payload.update({
                collection: 'events',
                id: event.id,
                data: {
                    slug: slug,
                },
            });

            console.log(
                `✅ Updated event "${event.title}" with slug: "${slug}"`
            );
        }

        console.log(
            `🎉 Successfully added slugs to ${result.docs.length} events!`
        );
    } catch (error) {
        console.error('❌ Error adding slugs to events:', error);
        process.exit(1);
    }
}

// Run the migration
addSlugsToEvents();
