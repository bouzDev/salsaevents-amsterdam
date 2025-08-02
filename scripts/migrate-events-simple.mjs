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

async function migrateEvents() {
    try {
        console.log('🚀 Starting simple events migration...');
        console.log(
            '📋 We will use the Payload API instead of direct database access'
        );

        // Read CSV file
        const csvPath = path.join(process.cwd(), 'public/data/events.csv');

        if (!fs.existsSync(csvPath)) {
            console.log('❌ No events.csv file found at:', csvPath);
            return;
        }

        const csvContent = fs.readFileSync(csvPath, 'utf8');
        const csvEvents = parseCSV(csvContent);

        console.log(`📊 Found ${csvEvents.length} events in CSV`);

        // Create a JSON file that can be imported via the admin
        const outputPath = path.join(process.cwd(), 'events-to-import.json');

        const payloadEvents = csvEvents.map((csvEvent) => ({
            title: csvEvent.title || 'Untitled Event',
            description: csvEvent.description || '',
            date: csvEvent.date || new Date().toISOString().split('T')[0],
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
        }));

        fs.writeFileSync(outputPath, JSON.stringify(payloadEvents, null, 2));

        console.log(
            `✅ Created events-to-import.json with ${payloadEvents.length} events`
        );
        console.log('🔧 Now you can:');
        console.log('   1. Go to http://localhost:3000/admin');
        console.log('   2. Navigate to Events collection');
        console.log(
            '   3. Manually import events or create them via the admin interface'
        );
        console.log('');
        console.log(
            '📁 Or use the Payload API to bulk import (see the JSON file for format)'
        );

        // Show sample API call for reference
        console.log('');
        console.log('🔗 Sample API calls you can make:');
        console.log('POST http://localhost:3000/api/events');
        console.log('Content-Type: application/json');
        console.log('');
        console.log('Example payload:');
        console.log(JSON.stringify(payloadEvents[0], null, 2));

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration preparation failed:', error);
        process.exit(1);
    }
}

// Run migration
migrateEvents();
