import { SalsaEvent } from '@/types/event';

// Client-side function to fetch events from Payload API
export const getSalsaEventsFromAPI = async (): Promise<SalsaEvent[]> => {
    try {
        console.log('Loading events from Payload API...');
        
        const response = await fetch('/api/events', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch events: ${response.status}`);
        }

        const result = await response.json();
        const events: SalsaEvent[] = result.docs.map((doc: any) => {
            // Convert tags string to array if needed
            const tags = doc.tags 
                ? (typeof doc.tags === 'string' 
                   ? doc.tags.split(',').map((tag: string) => tag.trim())
                   : doc.tags)
                : [];

            return {
                id: doc.id,
                title: doc.title,
                description: doc.description || '',
                date: new Date(doc.date).toISOString().split('T')[0], // Format as YYYY-MM-DD
                time: doc.time || '',
                venue: doc.venue,
                location: doc.venue, // Use venue as location for backwards compatibility
                city: doc.city,
                url: doc.url || undefined,
                price: doc.price || undefined,
                type: doc.type,
                tags: tags as string[],
                vibe: doc.vibe || '',
                imageUrl: doc.imageUrl || undefined,
                isRecurring: doc.isRecurring || false,
                frequency: doc.frequency || undefined,
            };
        });

        console.log(`Loaded ${events.length} events from Payload API`);
        return events.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
    } catch (error) {
        console.error('Error loading events from Payload API:', error);
        console.log('Returning empty array');
        return [];
    }
};

// Cache for client-side events
let eventsCache: Promise<SalsaEvent[]> | null = null;

// Main client-side function that caches results
export const getPayloadEvents = (): Promise<SalsaEvent[]> => {
    if (!eventsCache) {
        eventsCache = getSalsaEventsFromAPI();
    }
    return eventsCache;
};

// Function to clear cache (useful for refreshing data)
export const clearEventsCache = () => {
    eventsCache = null;
};