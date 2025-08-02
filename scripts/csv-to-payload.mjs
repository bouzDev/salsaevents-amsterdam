import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse CSV data
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

async function importCSVToPayload() {
    try {
        console.log('🚀 Starting CSV to Payload import...');

        // Read CSV file
        const csvPath = path.join(process.cwd(), 'public/data/events.csv');

        if (!fs.existsSync(csvPath)) {
            console.log('❌ No events.csv file found at:', csvPath);
            console.log('📁 Place your CSV file at: public/data/events.csv');
            return;
        }

        const csvContent = fs.readFileSync(csvPath, 'utf8');
        const csvEvents = parseCSV(csvContent);

        console.log(`📊 Found ${csvEvents.length} events in CSV`);

        // First, clear existing events (optional)
        console.log('🗑️  Clearing existing events...');
        try {
            const existingResponse = await fetch(
                `${process.env.SITE_URL || 'https://salsaevents-amsterdam.vercel.app'}/api/events`,
                {
                    method: 'GET',
                }
            );

            if (existingResponse.ok) {
                const existingData = await existingResponse.json();
                for (const event of existingData.docs) {
                    await fetch(
                        `${process.env.SITE_URL || 'https://salsaevents-amsterdam.vercel.app'}/api/events/${event.id}`,
                        {
                            method: 'DELETE',
                        }
                    );
                }
                console.log(
                    `🗑️  Deleted ${existingData.docs.length} existing events`
                );
            }
        } catch (error) {
            console.log(
                '⚠️  Could not clear existing events, continuing with import...'
            );
        }

        // Import each event
        let successCount = 0;
        let errorCount = 0;

        for (const csvEvent of csvEvents) {
            try {
                // Convert CSV format to Payload format
                const payloadEvent = {
                    title: csvEvent.title || 'Untitled Event',
                    description: csvEvent.description || '',
                    date:
                        csvEvent.date || new Date().toISOString().split('T')[0],
                    time: csvEvent.time || '',
                    venue: csvEvent.venue || 'TBD',
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

                // Create event via API
                const response = await fetch(
                    `${process.env.SITE_URL || 'https://salsaevents-amsterdam.vercel.app'}/api/events`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(payloadEvent),
                    }
                );

                if (response.ok) {
                    const result = await response.json();
                    successCount++;
                    console.log(
                        `✅ Imported: ${csvEvent.title} (ID: ${result.doc.id})`
                    );
                } else {
                    const error = await response.text();
                    errorCount++;
                    console.log(
                        `❌ Failed: ${csvEvent.title} - ${response.status}: ${error}`
                    );
                }
            } catch (error) {
                errorCount++;
                console.log(
                    `❌ Failed: ${csvEvent.title} - Error: ${error.message}`
                );
            }

            // Small delay to not overwhelm the API
            await new Promise((resolve) => setTimeout(resolve, 200));
        }

        console.log(`\n🎉 CSV Import completed!`);
        console.log(`✅ Successfully imported: ${successCount} events`);
        console.log(`❌ Failed: ${errorCount} events`);

        if (successCount > 0) {
            console.log(`\n🔗 Visit your website to see the imported events!`);
            console.log(
                `🔗 Visit ${process.env.SITE_URL || 'your-site'}/admin/collections/events to manage them`
            );
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ CSV Import failed:', error);
        process.exit(1);
    }
}

// Run import
importCSVToPayload();
