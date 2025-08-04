import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // Verify the request is from Payload (simple security)
        const authHeader = request.headers.get('authorization');
        const expectedToken = process.env.REVALIDATION_TOKEN;

        if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { type, eventId, eventSlug } = body;

        console.log('Revalidation request:', { type, eventId, eventSlug });

        switch (type) {
            case 'event-updated':
            case 'event-created':
                // Revalidate specific event page
                if (eventSlug) {
                    revalidatePath(`/events/${eventSlug}`);
                    console.log(`Revalidated event page: /events/${eventSlug}`);
                }
                if (eventId) {
                    revalidatePath(`/events/${eventId}`);
                    console.log(`Revalidated event page: /events/${eventId}`);
                }
                // Also revalidate events overview
                revalidatePath('/events');
                console.log('Revalidated events overview page');
                break;

            case 'event-deleted':
                // Revalidate events overview and homepage
                revalidatePath('/events');
                revalidatePath('/');
                console.log('Revalidated events overview and homepage');
                break;

            case 'revalidate-all':
                // Nuclear option: revalidate everything
                revalidateTag('events');
                revalidatePath('/events');
                revalidatePath('/');
                console.log('Revalidated all pages');
                break;

            default:
                console.log('Unknown revalidation type:', type);
        }

        return NextResponse.json({
            message: 'Revalidation successful',
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Revalidation error:', error);
        return NextResponse.json(
            {
                message: 'Revalidation failed',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

// GET endpoint for manual testing
export async function GET() {
    return NextResponse.json({
        message:
            'Revalidation endpoint is working. Use POST to trigger revalidation.',
        usage: {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer YOUR_REVALIDATION_TOKEN',
                'Content-Type': 'application/json',
            },
            body: {
                type: 'event-updated | event-created | event-deleted | revalidate-all',
                eventId: 'optional-event-id',
                eventSlug: 'optional-event-slug',
            },
        },
    });
}
