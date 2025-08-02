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

async function addSlugsToEventsViaAPI() {
    try {
        console.log('Starting slug generation for existing events via API...');

        const baseUrl = 'http://localhost:3000';

        // First, we need to authenticate as admin
        console.log('Authenticating as admin...');
        const loginResponse = await fetch(`${baseUrl}/api/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'anwar@bouz.nl', // CHANGE THIS to your admin email
                password: 'Waskamer_12', // CHANGE THIS to your admin password
            }),
        });

        if (!loginResponse.ok) {
            throw new Error(
                `Failed to login: ${loginResponse.status}. Please make sure you have an admin user with email: admin@example.com and password: admin123`
            );
        }

        // Get the auth cookie/token
        const cookies = loginResponse.headers.get('set-cookie');
        const authHeaders = {
            'Content-Type': 'application/json',
            'Cookie': cookies || '',
        };

        // Get all events
        const response = await fetch(`${baseUrl}/api/events?limit=1000`);

        if (!response.ok) {
            throw new Error(
                `Failed to fetch events: ${response.status} ${response.statusText}`
            );
        }

        const data = await response.json();
        const events = data.docs || [];

        console.log(`Found ${events.length} total events`);

        // Filter events without slugs
        const eventsWithoutSlugs = events.filter(
            (event) => !event.slug || event.slug.trim() === ''
        );

        console.log(`Found ${eventsWithoutSlugs.length} events without slugs`);

        if (eventsWithoutSlugs.length === 0) {
            console.log('All events already have slugs!');
            return;
        }

        // Update each event with a slug
        for (let i = 0; i < eventsWithoutSlugs.length; i++) {
            const event = eventsWithoutSlugs[i];
            let baseSlug = generateSlug(event.title);
            let slug = baseSlug;
            let counter = 1;

            // Check for slug uniqueness
            while (true) {
                const checkResponse = await fetch(
                    `${baseUrl}/api/events?where[slug][equals]=${encodeURIComponent(slug)}&where[id][not_equals]=${event.id}&limit=1`
                );

                if (!checkResponse.ok) {
                    console.warn(
                        `Warning: Could not check slug uniqueness for "${slug}"`
                    );
                    break;
                }

                const existing = await checkResponse.json();

                if (!existing.docs || existing.docs.length === 0) {
                    break; // Slug is unique
                }

                // Add counter to make it unique
                slug = `${baseSlug}-${counter}`;
                counter++;
            }

            // Update the event with authentication
            const updateResponse = await fetch(
                `${baseUrl}/api/events/${event.id}`,
                {
                    method: 'PATCH',
                    headers: authHeaders,
                    body: JSON.stringify({
                        slug: slug,
                    }),
                }
            );

            if (updateResponse.ok) {
                console.log(
                    `✅ Updated event "${event.title}" with slug: "${slug}"`
                );
            } else {
                console.error(
                    `❌ Failed to update event "${event.title}": ${updateResponse.status}`
                );
            }
        }

        console.log(
            `🎉 Successfully processed ${eventsWithoutSlugs.length} events!`
        );
    } catch (error) {
        console.error('❌ Error adding slugs to events:', error);
        console.log(
            '\n💡 Make sure your development server is running with "npm run dev"'
        );
        process.exit(1);
    }
}

// Check if server is running first
async function checkServer() {
    try {
        const response = await fetch(
            'http://localhost:3000/api/events?limit=1'
        );
        return response.ok;
    } catch (error) {
        return false;
    }
}

// Run the migration
async function main() {
    const serverRunning = await checkServer();

    if (!serverRunning) {
        console.error(
            '❌ Server is not running. Please start with "npm run dev" first.'
        );
        process.exit(1);
    }

    await addSlugsToEventsViaAPI();
}

main();
