import { getSalsaEventsMain } from '@/data/events.server';

export async function GET() {
    try {
        const events = await getSalsaEventsMain();
        const baseUrl = 'https://salsaevents-amsterdam.com';

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${events
    .map(
        (event) => `  <url>
    <loc>${baseUrl}/event/${event.id}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`
    )
    .join('\n')}
</urlset>`;

        return new Response(sitemap, {
            headers: {
                'Content-Type': 'application/xml',
            },
        });
    } catch (error) {
        console.error('Error generating events sitemap:', error);
        return new Response('Error generating sitemap', { status: 500 });
    }
}
