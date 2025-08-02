import { SalsaEvent } from '@/types/event';
import fs from 'fs';
import path from 'path';

// Parse CSV data
const parseCSV = (csvText: string): { [key: string]: string }[] => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');

    return lines.slice(1).map((line) => {
        // Handle quoted values that might contain commas
        const values: string[] = [];
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

        const obj: { [key: string]: string } = {};
        headers.forEach((header, index) => {
            obj[header.trim()] = values[index]?.replace(/"/g, '') || '';
        });
        return obj;
    });
};

// Generate weekly events for upcoming weeks
const generateWeeklyEvents = (
    weeklyEvent: { [key: string]: string },
    weeksToGenerate: number = 12
): SalsaEvent[] => {
    const events: SalsaEvent[] = [];
    const dayMap: { [key: string]: number } = {
        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
    };

    const dayNumber = dayMap[weeklyEvent.day.toLowerCase()];
    if (dayNumber === undefined) return events;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight for consistent comparison

    const endDate = weeklyEvent['end-date']
        ? new Date(weeklyEvent['end-date'])
        : new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
    endDate.setHours(23, 59, 59, 999); // Set to end of day

    for (let i = 0; i < weeksToGenerate; i++) {
        // Calculate the next occurrence of the target weekday
        const eventDate = new Date(today);

        // Calculate days to add to get to the next occurrence of dayNumber
        const todayDayNumber = today.getDay();
        let daysToAdd = dayNumber - todayDayNumber;

        // If the target day has already passed this week, go to next week
        if (daysToAdd < 0) {
            daysToAdd += 7;
        }
        // If it's today, but we want to show future events, we can include today as well
        // (you can adjust this logic if needed)

        // Add the calculated days plus week offset
        eventDate.setDate(today.getDate() + daysToAdd + 7 * i);
        eventDate.setHours(0, 0, 0, 0); // Set to midnight

        // Skip if before today or after end date
        const todayMidnight = new Date(today);
        todayMidnight.setHours(0, 0, 0, 0);

        if (eventDate < todayMidnight || eventDate > endDate) continue;

        const tags = weeklyEvent.tags
            ? weeklyEvent.tags.split(',').map((tag: string) => tag.trim())
            : [];

        events.push({
            id: `${weeklyEvent.id}-${eventDate.toISOString().split('T')[0]}`,
            title: weeklyEvent.title,
            description: weeklyEvent.description,
            date: eventDate.toISOString().split('T')[0],
            time: weeklyEvent.time,
            venue: weeklyEvent.venue,
            location: weeklyEvent.venue,
            city: weeklyEvent.city,
            url: weeklyEvent.url || undefined,
            type: weeklyEvent.type as
                | 'party'
                | 'workshop'
                | 'festival'
                | 'social',
            tags: tags,
            vibe: weeklyEvent.vibe,
            isRecurring: true,
            frequency: 'weekly' as const,
        });
    }

    return events;
};

// Fallback data in case CSV loading fails
const getFallbackEvents = (): SalsaEvent[] => {
    const oneTimeEvents = [
        {
            id: '11',
            title: 'Salsa Te Gusta x Pong Social',
            description: 'Special collaboration social event',
            date: '2025-07-29',
            time: '19:15-23:30',
            venue: 'Pong',
            city: 'Amsterdam',
            type: 'social',
            tags: 'social,collaboration,salsa-te-gusta',
            url: 'https://bash.social/e/y11F6Lq9uLJ9?u=0',
            vibe: 'Unique combination of salsa and social gaming',
        },
        {
            id: '12',
            title: 'Rueda in Noordermarkt',
            description: 'Rueda de Casino in open air',
            date: '2025-07-30',
            time: '20:00-22:00',
            venue: 'Noordermarkt',
            city: 'Amsterdam',
            type: 'workshop',
            tags: 'rueda,open-air,free',
            url: 'https://www.latinworld.nl/latin/agenda/rueda-en-la-callerueda-de-casino-in-open-air-30-07-2025-rueda-afuera-amsterdam-103301.php',
            vibe: 'Beautiful outdoor rueda session under the stars',
        },
        {
            id: '20',
            title: 'Lady Styling Workshop',
            description: 'Lady Styling Workshop at Q Factory',
            date: '2025-08-04',
            time: '20:00-22:00',
            venue: 'Q Factory',
            city: 'Amsterdam',
            type: 'workshop',
            tags: 'lady,styling,workshop',
            url: 'https://eventix.shop/ymvf7d49',
            vibe: 'Elegant workshop for ladies to perfect their salsa styling',
        },
    ];

    const weeklyEventsData = [
        {
            'id': '15',
            'title': 'Weekly Social',
            'description': 'Weekly Social at Cafe Sao Paolo',
            'day': 'friday',
            'end-date': '',
            'time': '20:00-01:00',
            'venue': 'Cafe Sao Paolo',
            'city': 'Amsterdam',
            'type': 'social',
            'tags': 'social,weekly,friday,sao-paolo,free',
            'url': '',
            'vibe': 'Cozy and welcoming weekly social gathering',
        },
    ];

    const events: SalsaEvent[] = [];

    // Process one-time events
    oneTimeEvents.forEach((eventData) => {
        const tags = eventData.tags
            ? eventData.tags.split(',').map((tag: string) => tag.trim())
            : [];
        events.push({
            id: eventData.id,
            title: eventData.title,
            description: eventData.description,
            date: eventData.date,
            time: eventData.time,
            venue: eventData.venue,
            location: eventData.venue,
            city: eventData.city,
            url: eventData.url || undefined,
            type: eventData.type as
                | 'party'
                | 'workshop'
                | 'festival'
                | 'social',
            tags: tags,
            vibe: eventData.vibe,
            isRecurring: false,
        });
    });

    // Process weekly events
    weeklyEventsData.forEach((weeklyEvent) => {
        const generatedEvents = generateWeeklyEvents(weeklyEvent);
        events.push(...generatedEvents);
    });

    return events.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
};

// Server-side function to load events from CSV files
export const getSalsaEventsServer = async (): Promise<SalsaEvent[]> => {
    const events: SalsaEvent[] = [];

    try {
        console.log('Loading events from CSV files server-side...');

        // Load one-time events
        const eventsPath = path.join(process.cwd(), 'public/data/events.csv');
        const eventsText = fs.readFileSync(eventsPath, 'utf8');
        console.log('Events CSV loaded, length:', eventsText.length);

        const oneTimeEvents = parseCSV(eventsText);
        console.log('Parsed one-time events:', oneTimeEvents.length);

        // Load weekly events
        const weeklyEventsPath = path.join(
            process.cwd(),
            'public/data/weekly-events.csv'
        );
        const weeklyEventsText = fs.readFileSync(weeklyEventsPath, 'utf8');
        console.log(
            'Weekly events CSV loaded, length:',
            weeklyEventsText.length
        );

        const weeklyEventsData = parseCSV(weeklyEventsText);
        console.log('Parsed weekly events:', weeklyEventsData.length);

        // Process one-time events
        oneTimeEvents.forEach((eventData) => {
            const tags = eventData.tags
                ? eventData.tags.split(',').map((tag: string) => tag.trim())
                : [];
            events.push({
                id: eventData.id,
                title: eventData.title,
                description: eventData.description,
                date: eventData.date,
                time: eventData.time,
                venue: eventData.venue,
                location: eventData.venue,
                city: eventData.city,
                url: eventData.url || undefined,
                type: eventData.type as
                    | 'party'
                    | 'workshop'
                    | 'festival'
                    | 'social',
                tags: tags,
                vibe: eventData.vibe,
                isRecurring: false,
            });
        });

        // Process weekly events
        weeklyEventsData.forEach((weeklyEvent) => {
            const generatedEvents = generateWeeklyEvents(weeklyEvent);
            events.push(...generatedEvents);
        });

        console.log('Total events loaded:', events.length);
        return events.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
    } catch (error) {
        console.error('Error loading CSV files server-side:', error);
        console.log('Using fallback data instead');
        return getFallbackEvents();
    }
};
