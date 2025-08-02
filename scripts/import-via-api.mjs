import fs from 'fs';
import path from 'path';

async function importEvents() {
    try {
        console.log('🚀 Starting API-based events import...');

        // Read the prepared JSON file
        const jsonPath = path.join(process.cwd(), 'events-to-import.json');

        if (!fs.existsSync(jsonPath)) {
            console.log(
                '❌ No events-to-import.json file found. Run "npm run prepare-events" first.'
            );
            return;
        }

        const events = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        console.log(`📊 Found ${events.length} events to import`);

        // Check if server is running
        const baseUrl = 'http://localhost:3000';

        try {
            const healthCheck = await fetch(`${baseUrl}/api/users/me`);
            if (!healthCheck.ok) {
                throw new Error('Server not accessible');
            }
        } catch (error) {
            console.log(
                '❌ Server is not running. Please start with "npm run dev" first.'
            );
            console.log('   Then run this script again.');
            return;
        }

        console.log('✅ Server is running, starting import...');

        let successCount = 0;
        let errorCount = 0;

        for (const event of events) {
            try {
                const response = await fetch(`${baseUrl}/api/events`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(event),
                });

                if (response.ok) {
                    const result = await response.json();
                    successCount++;
                    console.log(
                        `✅ Imported: ${event.title} (ID: ${result.doc.id})`
                    );
                } else {
                    const error = await response.text();
                    errorCount++;
                    console.log(
                        `❌ Failed: ${event.title} - ${response.status}: ${error}`
                    );
                }
            } catch (error) {
                errorCount++;
                console.log(
                    `❌ Failed: ${event.title} - Network error: ${error.message}`
                );
            }

            // Small delay to not overwhelm the API
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        console.log(`\n🎉 Import completed!`);
        console.log(`✅ Successfully imported: ${successCount} events`);
        console.log(`❌ Failed: ${errorCount} events`);

        if (successCount > 0) {
            console.log(
                `\n🔗 Visit http://localhost:3000/admin/collections/events to see your imported events!`
            );
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Import failed:', error);
        process.exit(1);
    }
}

// Run import
importEvents();
