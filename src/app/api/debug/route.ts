import { NextResponse } from 'next/server';
import { getSalsaEventsMain } from '../../../data/events.server';

export async function GET() {
    try {
        const events = await getSalsaEventsMain();

        return NextResponse.json({
            status: 'success',
            eventCount: events.length,
            sampleEvents: events.slice(0, 3).map((e) => ({
                id: e.id,
                slug: e.slug,
                title: e.title,
                hasSlug: !!e.slug,
            })),
            environment: {
                NODE_ENV: process.env.NODE_ENV,
                PAYLOAD_PUBLIC_SERVER_URL:
                    process.env.PAYLOAD_PUBLIC_SERVER_URL,
                VERCEL_URL: process.env.VERCEL_URL,
                DATABASE_URI_SET: !!process.env.DATABASE_URI,
            },
        });
    } catch (error) {
        return NextResponse.json(
            {
                status: 'error',
                error: error instanceof Error ? error.message : 'Unknown error',
                environment: {
                    NODE_ENV: process.env.NODE_ENV,
                    PAYLOAD_PUBLIC_SERVER_URL:
                        process.env.PAYLOAD_PUBLIC_SERVER_URL,
                    VERCEL_URL: process.env.VERCEL_URL,
                    DATABASE_URI_SET: !!process.env.DATABASE_URI,
                },
            },
            { status: 500 }
        );
    }
}
