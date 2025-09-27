import { getPayload } from 'payload';
import config from '../src/payload.config.ts';

async function migrateDateFields() {
    console.log('🔄 Starting date field migration...');

    try {
        const payload = await getPayload({ config });

        // Get all events
        const { docs: events } = await payload.find({
            collection: 'events',
            limit: 1000, // Adjust if you have more events
        });

        console.log(`Found ${events.length} events to migrate`);

        let migratedCount = 0;
        let skippedCount = 0;

        for (const event of events) {
            try {
                // Check if event has old 'date' field but no 'startDate'
                if (event.date && !event.startDate) {
                    console.log(`Migrating event: ${event.title}`);

                    await payload.update({
                        collection: 'events',
                        id: event.id,
                        data: {
                            startDate: event.date,
                            // Keep all other fields as they are
                            title: event.title,
                            description: event.description,
                            time: event.time,
                            venue: event.venue,
                            city: event.city,
                            type: event.type,
                            url: event.url,
                            price: event.price,
                            tags: event.tags,
                            vibe: event.vibe,
                            imageUrl: event.imageUrl,
                            isRecurring: event.isRecurring,
                            frequency: event.frequency,
                        },
                    });

                    migratedCount++;
                } else if (event.startDate) {
                    console.log(
                        `✅ Event already has startDate: ${event.title}`
                    );
                    skippedCount++;
                } else {
                    console.log(`⚠️  Event has no date field: ${event.title}`);
                    skippedCount++;
                }
            } catch (error) {
                console.error(
                    `❌ Failed to migrate event ${event.title}:`,
                    error.message
                );
            }
        }

        console.log('\n=== Migration Summary ===');
        console.log(`✅ Successfully migrated: ${migratedCount} events`);
        console.log(`⏭️  Skipped: ${skippedCount} events`);
        console.log(`📊 Total processed: ${events.length} events`);
    } catch (error) {
        console.error('❌ Migration failed:', error);
    }
}

// Run the migration
migrateDateFields()
    .then(() => {
        console.log('🎉 Migration completed!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Migration error:', error);
        process.exit(1);
    });
