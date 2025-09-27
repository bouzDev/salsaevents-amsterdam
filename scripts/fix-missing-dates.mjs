// Fix missing dates by matching events with CSV data
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse CSV data
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

async function fixMissingDates() {
    console.log('🔧 Fixing missing dates...');

    const API_URL = 'http://localhost:3000/api/events';

    try {
        // Load CSV data
        const csvPath = path.join(__dirname, '../public/event-list.csv');
        const csvEvents = parseCSV(csvPath);
        console.log(`Loaded ${csvEvents.length} events from CSV`);

        // Get all events from API
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch events: ${response.status}`);
        }

        const data = await response.json();
        const apiEvents = data.docs || [];
        console.log(`Found ${apiEvents.length} events in database`);

        let fixedCount = 0;
        let notFoundCount = 0;

        for (const apiEvent of apiEvents) {
            try {
                // Find matching CSV event by title
                const csvEvent = csvEvents.find(
                    (csv) =>
                        csv.title.toLowerCase().trim() ===
                        apiEvent.title.toLowerCase().trim()
                );

                if (csvEvent && csvEvent.date) {
                    console.log(`Fixing date for: ${apiEvent.title}`);
                    console.log(`  Adding startDate: ${csvEvent.date}`);

                    const updateData = {
                        ...apiEvent,
                        startDate: csvEvent.date,
                        // Keep endDate undefined for single-day events
                        endDate: undefined,
                    };

                    const updateResponse = await fetch(
                        `${API_URL}/${apiEvent.id}`,
                        {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(updateData),
                        }
                    );

                    if (updateResponse.ok) {
                        console.log(`✅ Successfully fixed: ${apiEvent.title}`);
                        fixedCount++;
                    } else {
                        const errorText = await updateResponse.text();
                        console.error(
                            `❌ Failed to fix ${apiEvent.title}: ${updateResponse.status} - ${errorText}`
                        );
                    }
                } else {
                    console.log(
                        `⚠️  No matching CSV event found for: ${apiEvent.title}`
                    );
                    notFoundCount++;
                }

                // Small delay to avoid overwhelming the API
                await new Promise((resolve) => setTimeout(resolve, 200));
            } catch (error) {
                console.error(
                    `❌ Failed to process event ${apiEvent.title}:`,
                    error.message
                );
            }
        }

        console.log('\n=== Fix Summary ===');
        console.log(`✅ Successfully fixed: ${fixedCount} events`);
        console.log(`⚠️  Not found in CSV: ${notFoundCount} events`);
        console.log(`📊 Total processed: ${apiEvents.length} events`);
    } catch (error) {
        console.error('❌ Fix failed:', error);
    }
}

// Run the fix
fixMissingDates()
    .then(() => {
        console.log('🎉 Date fixing completed!');
    })
    .catch((error) => {
        console.error('💥 Fix error:', error);
    });
