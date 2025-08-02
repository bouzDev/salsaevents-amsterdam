import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'venue', 'city', 'type'],
  },
  access: {
    read: () => true, // Public read access
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Event Titel',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Beschrijving',
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      label: 'Datum',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'time',
      type: 'text',
      label: 'Tijd',
      admin: {
        placeholder: '20:00-23:00',
      },
    },
    {
      name: 'venue',
      type: 'text',
      required: true,
      label: 'Locatie/Venue',
    },
    {
      name: 'city',
      type: 'text',
      required: true,
      label: 'Stad',
      defaultValue: 'Amsterdam',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'Event Type',
      options: [
        { label: 'Party', value: 'party' },
        { label: 'Workshop', value: 'workshop' },
        { label: 'Festival', value: 'festival' },
        { label: 'Social', value: 'social' },
      ],
    },
    {
      name: 'url',
      type: 'text',
      label: 'Event URL',
      admin: {
        placeholder: 'https://...',
      },
    },
    {
      name: 'price',
      type: 'text',
      label: 'Prijs',
      admin: {
        placeholder: '€15 of Gratis',
      },
    },
    {
      name: 'tags',
      type: 'text',
      label: 'Tags',
      admin: {
        placeholder: 'salsa, bachata, social (gescheiden door komma\'s)',
      },
    },
    {
      name: 'vibe',
      type: 'textarea',
      label: 'Vibe/Sfeer',
      admin: {
        placeholder: 'Beschrijf de sfeer van het event...',
      },
    },
    {
      name: 'imageUrl',
      type: 'text',
      label: 'Afbeelding URL',
      admin: {
        placeholder: 'https://...',
      },
    },
    {
      name: 'isRecurring',
      type: 'checkbox',
      label: 'Terugkerend Event',
      defaultValue: false,
    },
    {
      name: 'frequency',
      type: 'select',
      label: 'Frequentie',
      admin: {
        condition: (data) => data.isRecurring,
      },
      options: [
        { label: 'Wekelijks', value: 'weekly' },
        { label: 'Maandelijks', value: 'monthly' },
        { label: 'Dagelijks', value: 'daily' },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Process tags string into array format for consistency
        if (data.tags && typeof data.tags === 'string') {
          data.tagsArray = data.tags.split(',').map((tag: string) => tag.trim())
        }
        return data
      },
    ],
  },
}