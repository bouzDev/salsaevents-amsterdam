export interface SalsaEvent {
    id: string;
    slug?: string;
    title: string;
    description?: string;
    date: string;
    time?: string;
    venue: string;
    location: string;
    city: string;
    url?: string;
    price?: string;
    type: 'party' | 'workshop' | 'festival' | 'social';
    tags: string[];
    isRecurring?: boolean;
    frequency?: 'weekly' | 'monthly' | 'daily';
    vibe?: string;
    imageUrl?: string;
}

export interface EventFilter {
    city?: string;
    type?: string;
    date?: string;
    tags?: string[];
}
