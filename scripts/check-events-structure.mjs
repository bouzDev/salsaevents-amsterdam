// Check the structure of events in the database
async function checkEventsStructure() {
    console.log('🔍 Checking events structure...');

    const API_URL = 'http://localhost:3000/api/events';

    try {
        // Get all events
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch events: ${response.status}`);
        }

        const data = await response.json();
        const events = data.docs || [];

        console.log(`Found ${events.length} events`);

        if (events.length > 0) {
            console.log('\n=== First Event Structure ===');
            const firstEvent = events[0];
            console.log('Event fields:');
            Object.keys(firstEvent).forEach((key) => {
                console.log(
                    `  ${key}: ${typeof firstEvent[key]} = ${firstEvent[key]}`
                );
            });

            console.log('\n=== All Events Summary ===');
            events.forEach((event, index) => {
                console.log(`${index + 1}. ${event.title}`);
                console.log(`   - id: ${event.id}`);
                console.log(`   - date: ${event.date || 'MISSING'}`);
                console.log(`   - startDate: ${event.startDate || 'MISSING'}`);
                console.log(`   - endDate: ${event.endDate || 'MISSING'}`);
                console.log(`   - venue: ${event.venue || 'MISSING'}`);
                console.log('');
            });
        }
    } catch (error) {
        console.error('❌ Check failed:', error);
    }
}

// Run the check
checkEventsStructure();
