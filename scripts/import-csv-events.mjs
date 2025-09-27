import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read and parse CSV
function parseCSV(filePath) {
    const csvContent = fs.readFileSync(filePath, 'utf-8');
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',');

    return lines.slice(1).map((line) => {
        // Handle CSV parsing with potential commas in quoted fields
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

        const event = {};
        headers.forEach((header, index) => {
            event[header] = values[index] || '';
        });

        return event;
    });
}

// Transform CSV data to Payload format
function transformEvent(csvEvent) {
    // Parse tags
    const tags = csvEvent.tags
        ? csvEvent.tags.split(',').map((tag) => tag.trim())
        : [];

    // Parse date and time
    let startDate = null;
    let endDate = null;

    if (csvEvent.date && csvEvent.date !== 'Multi-day') {
        const baseDate = new Date(csvEvent.date);

        if (
            csvEvent.time &&
            csvEvent.time !== 'Multi-day' &&
            csvEvent.time !== 'Evening'
        ) {
            const timeRange = csvEvent.time.split('-');
            if (timeRange.length === 2) {
                const [startTime, endTime] = timeRange;

                // Parse start time
                const [startHour, startMinute] = startTime
                    .split(':')
                    .map((t) => parseInt(t));
                startDate = new Date(baseDate);
                startDate.setHours(startHour, startMinute || 0, 0, 0);

                // Parse end time
                const [endHour, endMinute] = endTime
                    .split(':')
                    .map((t) => parseInt(t));
                endDate = new Date(baseDate);
                endDate.setHours(endHour, endMinute || 0, 0, 0);

                // If end time is earlier than start time, it's next day
                if (endDate < startDate) {
                    endDate.setDate(endDate.getDate() + 1);
                }
            }
        } else {
            // Default to evening event if no specific time
            startDate = new Date(baseDate);
            startDate.setHours(20, 0, 0, 0);
            endDate = new Date(baseDate);
            endDate.setHours(23, 59, 0, 0);
        }
    }

    // Determine event type based on tags and type field
    let eventType = 'social'; // default
    if (csvEvent.type === 'workshop' || tags.includes('workshop')) {
        eventType = 'workshop';
    } else if (csvEvent.type === 'festival' || tags.includes('festival')) {
        eventType = 'festival';
    }

    return {
        title: csvEvent.title,
        description: csvEvent.description,
        startDate: startDate ? startDate.toISOString() : null,
        endDate: endDate ? endDate.toISOString() : null,
        venue: csvEvent.venue,
        city: csvEvent.city,
        type: eventType,
        tags: tags,
        url: csvEvent.url || null,
        isRecurring: false,
        frequency: null,
        slug: csvEvent.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, ''),
    };
}

// Import events to Payload
async function importEvents() {
    const csvPath = path.join(__dirname, '../public/event-list.csv');
    const events = parseCSV(csvPath);

    console.log(`Found ${events.length} events to import`);

    const PAYLOAD_URL =
        process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000';
    const API_URL = `${PAYLOAD_URL}/api/events`;

    let successCount = 0;
    let errorCount = 0;

    for (const csvEvent of events) {
        try {
            const transformedEvent = transformEvent(csvEvent);

            console.log(`Importing: ${transformedEvent.title}`);

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transformedEvent),
            });

            if (response.ok) {
                const result = await response.json();
                console.log(
                    `✅ Successfully imported: ${transformedEvent.title} (ID: ${result.doc.id})`
                );
                successCount++;
            } else {
                const error = await response.text();
                console.error(
                    `❌ Failed to import ${transformedEvent.title}: ${response.status} - ${error}`
                );
                errorCount++;
            }

            // Small delay to avoid overwhelming the API
            await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error) {
            console.error(
                `❌ Error importing ${csvEvent.title}:`,
                error.message
            );
            errorCount++;
        }
    }

    console.log('\n=== Import Summary ===');
    console.log(`✅ Successfully imported: ${successCount} events`);
    console.log(`❌ Failed to import: ${errorCount} events`);
    console.log(`📊 Total processed: ${events.length} events`);
}

// Run the import
importEvents().catch(console.error);
