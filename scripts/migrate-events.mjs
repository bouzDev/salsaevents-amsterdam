import { getPayload } from 'payload';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse CSV data (copied from events.server.ts)
const parseCSV = (csvText) => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');

    return lines.slice(1).map((line) => {
        // Handle quoted values that might contain commas
        const values = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current.trim()); // Add the last value

        const obj = {};
        headers.forEach((header, index) => {
            obj[header.trim()] = values[index]?.replace(/"/g, '') || '';
        });
        return obj;
    });
};

async function migrateEvents() {
    try {
        console.log('🚀 Starting events migration...');

        // Import the Payload config
        const configModule = await import('../src/payload.config.ts');
        const config = configModule.default;

        // Initialize Payload
        const payload = await getPayload({ config });

        // Read CSV file
        const csvPath = path.join(process.cwd(), 'public/data/events.csv');

        if (!fs.existsSync(csvPath)) {
            console.log('❌ No events.csv file found at:', csvPath);
            return;
        }

        const csvContent = fs.readFileSync(csvPath, 'utf8');
        const csvEvents = parseCSV(csvContent);

        console.log(`📊 Found ${csvEvents.length} events in CSV`);

        // Clear existing events (optional - comment out if you want to keep existing)
        const existingEvents = await payload.find({
            collection: 'events',
            limit: 1000,
        });

        console.log(
            `🗑️  Clearing ${existingEvents.docs.length} existing events...`
        );
        for (const event of existingEvents.docs) {
            await payload.delete({
                collection: 'events',
                id: event.id,
            });
        }

        // Migrate each event
        let successCount = 0;
        let errorCount = 0;

        for (const csvEvent of csvEvents) {
            try {
                // Convert CSV format to Payload format
                const payloadEvent = {
                    title: csvEvent.title,
                    description: csvEvent.description || '',
                    date: csvEvent.date,
                    time: csvEvent.time || '',
                    venue: csvEvent.venue,
                    city: csvEvent.city || 'Amsterdam',
                    type: csvEvent.type || 'social',
                    url: csvEvent.url || '',
                    price: csvEvent.price || '',
                    tags: csvEvent.tags || '',
                    vibe: csvEvent.vibe || '',
                    imageUrl: csvEvent.imageUrl || '',
                    isRecurring: csvEvent.isRecurring === 'true' || false,
                    frequency: csvEvent.frequency || undefined,
                };

                // Create event in Payload
                await payload.create({
                    collection: 'events',
                    data: payloadEvent,
                });

                successCount++;
                console.log(`✅ Migrated: ${csvEvent.title}`);
            } catch (error) {
                errorCount++;
                console.error(
                    `❌ Failed to migrate: ${csvEvent.title}`,
                    error.message
                );
            }
        }

        console.log(`\n🎉 Migration completed!`);
        console.log(`✅ Successfully migrated: ${successCount} events`);
        console.log(`❌ Failed: ${errorCount} events`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

// Run migration
migrateEvents();
