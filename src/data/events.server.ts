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

// Generate weekly events for upcoming weeks using Europe/Amsterdam timezone
const generateWeeklyEvents = (
    weeklyEvent: { [key: string]: string },
    weeksToGenerate: number = 12
): SalsaEvent[] => {
    const events: SalsaEvent[] = [];
    const tz = 'Europe/Amsterdam';

    const dayMap: { [key: string]: number } = {
        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
    };

    const shortDayToNum: { [key: string]: number } = {
        sun: 0,
        mon: 1,
        tue: 2,
        wed: 3,
        thu: 4,
        fri: 5,
        sat: 6,
    };

    const formatYMDInTZ = (date: Date): string =>
        new Intl.DateTimeFormat('en-CA', {
            timeZone: tz,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(date);

    const getDayInTZ = (date: Date): number => {
        const weekday = new Intl.DateTimeFormat('en-US', {
            timeZone: tz,
            weekday: 'short',
        })
            .format(date)
            .toLowerCase()
            .slice(0, 3);
        return shortDayToNum[weekday];
    };

    const parseYMDToUTCNoon = (ymd: string): Date => {
        const [y, m, d] = ymd.split('-').map((v) => parseInt(v, 10));
        return new Date(Date.UTC(y, m - 1, d, 12, 0, 0, 0));
    };

    const targetDayNumber = dayMap[weeklyEvent.day.toLowerCase()];
    if (targetDayNumber === undefined) return events;

    // Today in Amsterdam timezone (as UTC noon date)
    const todayYMDInAms = formatYMDInTZ(new Date());
    const todayUTCNoon = parseYMDToUTCNoon(todayYMDInAms);
    const todayDayNumber = getDayInTZ(todayUTCNoon);

    // Determine end date (as UTC end-of-day for Amsterdam date)
    let endDateUTC: Date;
    if (weeklyEvent['end-date']) {
        const [ey, em, ed] = weeklyEvent['end-date']
            .split('-')
            .map((v) => parseInt(v, 10));
        endDateUTC = new Date(Date.UTC(ey, em - 1, ed, 23, 59, 59, 999));
    } else {
        const [ty, tm, td] = todayYMDInAms
            .split('-')
            .map((v) => parseInt(v, 10));
        endDateUTC = new Date(Date.UTC(ty + 1, tm - 1, td, 23, 59, 59, 999));
    }

    for (let i = 0; i < weeksToGenerate; i++) {
        let daysToAdd = targetDayNumber - todayDayNumber;
        if (daysToAdd < 0) daysToAdd += 7;

        const eventDateUTC = new Date(todayUTCNoon);
        eventDateUTC.setUTCDate(eventDateUTC.getUTCDate() + daysToAdd + 7 * i);

        // Skip if before today (Amsterdam) or after end date
        if (eventDateUTC < todayUTCNoon || eventDateUTC > endDateUTC) continue;

        const tags = weeklyEvent.tags
            ? weeklyEvent.tags.split(',').map((tag: string) => tag.trim())
            : [];

        const eventYMDInAms = formatYMDInTZ(eventDateUTC);

        // Only include URL if it's not empty and not just whitespace
        const cleanUrl = weeklyEvent.url?.trim();

        events.push({
            id: `${weeklyEvent.id}-${eventYMDInAms}`,
            title: weeklyEvent.title,
            description: weeklyEvent.description,
            date: eventYMDInAms,
            time: weeklyEvent.time,
            venue: weeklyEvent.venue,
            location: weeklyEvent.venue,
            city: weeklyEvent.city,
            url: cleanUrl && cleanUrl.length > 0 ? cleanUrl : undefined,
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        // Only include URL if it's not empty and not just whitespace
        const cleanUrl = eventData.url?.trim();
        events.push({
            id: eventData.id,
            title: eventData.title,
            description: eventData.description,
            date: eventData.date,
            time: eventData.time,
            venue: eventData.venue,
            location: eventData.venue,
            city: eventData.city,
            url: cleanUrl && cleanUrl.length > 0 ? cleanUrl : undefined,
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

    // Process weekly events as part of fallback as well
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
            // Only include URL if it's not empty and not just whitespace
            const cleanUrl = eventData.url?.trim();
            events.push({
                id: eventData.id,
                title: eventData.title,
                description: eventData.description,
                date: eventData.date,
                time: eventData.time,
                venue: eventData.venue,
                location: eventData.venue,
                city: eventData.city,
                url: cleanUrl && cleanUrl.length > 0 ? cleanUrl : undefined,
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
