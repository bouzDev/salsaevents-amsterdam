// Simple migration script using the API
async function migrateDateFields() {
    console.log('🔄 Starting date field migration via API...');

    const API_URL = 'http://localhost:3000/api/events';

    try {
        // Get all events
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch events: ${response.status}`);
        }

        const data = await response.json();
        const events = data.docs || [];

        console.log(`Found ${events.length} events to check`);

        let migratedCount = 0;
        let skippedCount = 0;

        for (const event of events) {
            try {
                // Check if event has old 'date' field but no 'startDate'
                if (event.date && !event.startDate) {
                    console.log(`Migrating event: ${event.title}`);

                    const updateData = {
                        ...event,
                        startDate: event.date,
                        // Remove the old date field
                        date: undefined,
                    };

                    const updateResponse = await fetch(
                        `${API_URL}/${event.id}`,
                        {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(updateData),
                        }
                    );

                    if (updateResponse.ok) {
                        console.log(`✅ Successfully migrated: ${event.title}`);
                        migratedCount++;
                    } else {
                        console.error(
                            `❌ Failed to migrate ${event.title}: ${updateResponse.status}`
                        );
                    }
                } else if (event.startDate) {
                    console.log(
                        `✅ Event already has startDate: ${event.title}`
                    );
                    skippedCount++;
                } else {
                    console.log(`⚠️  Event has no date field: ${event.title}`);
                    skippedCount++;
                }

                // Small delay to avoid overwhelming the API
                await new Promise((resolve) => setTimeout(resolve, 100));
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
    })
    .catch((error) => {
        console.error('💥 Migration error:', error);
    });
