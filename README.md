# 💃 SalsaEvents Amsterdam 🕺

Een prachtige, moderne website voor het ontdekken van salsa evenementen in Amsterdam en omgeving!

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css)

## 🌟 Features

-   **🎯 Event Discovery**: Ontdek salsa parties, workshops, festivals en sociale evenementen
-   **🔍 Smart Search**: Zoek op titel, beschrijving, venue of stad
-   **🏷️ Advanced Filtering**: Filter op event type en locatie
-   **📱 Responsive Design**: Perfect op desktop, tablet en mobiel
-   **🎨 Modern UI**: Prachtige gradients en animaties met salsa thema
-   **📍 Location Pages**: Ontdek alle venues en steden
-   **🎉 Festival Section**: Speciale sectie voor workshops en festivals
-   **💭 Event Vibes**: Beschrijvingen van de sfeer bij elk evenement
-   **🏷️ Tags System**: Gemakkelijk categoriseren en vinden van events

## 🚀 Getting Started

### Prerequisites

-   Node.js 18+
-   npm of yarn

### Installation

1. Clone de repository:
   \`\`\`bash
   git clone [repository-url]
   cd salsaevents-amsterdam
   \`\`\`

2. Installeer dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Start de development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in je browser

## 📁 Project Structure

\`\`\`
src/
├── app/ # Next.js App Router
│ ├── page.tsx # Homepage met alle events
│ ├── festivals/ # Festivals & workshops pagina
│ ├── locaties/ # Venues & steden pagina
│ └── layout.tsx # Root layout
├── components/ # React components
│ ├── EventCard.tsx # Event card component
│ └── Navbar.tsx # Navigatie component
├── data/ # Mock data
│ └── events.ts # Salsa events data
└── types/ # TypeScript types
└── event.ts # Event interfaces
\`\`\`

## 🎯 Event Data Structure

Events bevatten de volgende informatie:

-   **Basic Info**: Titel, beschrijving, datum, tijd
-   **Location**: Venue, adres, stad
-   **Categorization**: Type (party/workshop/festival/social)
-   **Tags**: Voor gemakkelijk filteren
-   **Vibe**: Beschrijving van de sfeer
-   **Recurring**: Voor wekelijkse/maandelijkse events

## 🎨 Styling & Design

-   **Tailwind CSS** voor styling
-   **Lucide React** voor icons
-   **Salsa-inspired color scheme**: Reds, oranges, en warme kleuren
-   **Responsive grid layouts**
-   **Smooth animations en transitions**
-   **Modern glassmorphism effects**

## 🔧 Tech Stack

-   **Framework**: Next.js 14 met App Router
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **Icons**: Lucide React
-   **Date Handling**: date-fns met Nederlandse localization

## 📱 Pages

1. **Homepage (/)**: Alle events met search en filtering
2. **Festivals (/festivals)**: Focus op workshops en festivals
3. **Locaties (/locaties)**: Overzicht van venues en steden

## 🚀 Deployment

Build voor productie:
\`\`\`bash
npm run build
npm start
\`\`\`

Of deploy naar Vercel:
\`\`\`bash
vercel --prod
\`\`\`

## 🤝 Contributing

Contributions zijn welkom! Voel je vrij om:

-   Issues te rapporteren
-   Feature requests in te dienen
-   Pull requests te maken

## 📝 License

Dit project is gemaakt voor de Nederlandse salsa community 💃🕺

---

**Gemaakt met ❤️ voor de salsa community in Nederland**
