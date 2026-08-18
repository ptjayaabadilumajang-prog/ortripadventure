# Or.Trip Adventure — Mobile Interface Design

## Product Direction

Or.Trip Adventure is a portrait-first mobile experience for discovering and booking Indonesian open trips and private trips. The interface should feel like a calm, trustworthy outdoor companion: editorial imagery, strong trip facts, clear safety information, and a low-friction booking flow. All primary actions are reachable with one hand and use native iOS conventions such as large titles, bottom tabs, rounded cards, bottom sheets, clear hierarchy, and restrained motion.

## Screen List

| Screen | Primary content and functionality |
|---|---|
| Home | Greeting, search field, hero destination card, quick filters, featured open trips, private-trip CTA, and trust signals. |
| Explore Trips | Search and filter by destination, date, difficulty, trip type, and price; trip cards show image, title, dates, duration, difficulty, seats, and price. |
| Trip Detail | Full-width hero image, destination facts, itinerary, inclusions, exclusions, meeting point, guide profile, safety notes, reviews, and sticky booking CTA. |
| Booking Form | Participant count, selected package, trip date, contact details, citizenship/currency preview, notes, and price summary. |
| Payment | Booking code, payment method choices, DP amount, transfer instructions, QRIS/payment proof upload placeholder flow, and payment status. |
| Booking Success / My Booking | Confirmation number, booking status, trip summary, countdown, payment state, emergency contact, and WhatsApp action. |
| Private Trip Brief | Group size, preferred destination, date range, activities, budget, accommodation preference, and request submission confirmation. |
| Gallery | Masonry-like visual grid of mountain, camping, sunrise, group, and wildlife moments with category filters. |
| Journal | Blog cards by category: tips, destinations, preparation, stories, and news. |
| Journal Detail | Article cover, reading content, tags, related articles, and share action. |
| Destination Rules | Searchable safety and permit rules, especially Semeru/Bromo-Tengger-Semeru guidance, with warning callouts. |
| Profile / Settings | Saved trips, language/currency preference, contact support, terms, and app information. |

## Key User Flows

### Discover and book an open trip

1. User opens Home and taps a featured trip or chooses Explore.
2. User applies filters for destination, date, or difficulty.
3. User opens Trip Detail and reviews itinerary, inclusions, guide, and safety notes.
4. User taps the sticky booking CTA and selects package/date/participant count.
5. User completes contact details and reviews the final price.
6. User chooses a payment method and receives a booking code plus payment instructions.
7. User sees confirmation and can open My Booking or contact the team through WhatsApp.

### Request a private trip

1. User taps the Private Trip CTA from Home or Explore.
2. User completes a short brief with group size, destination, date, activity, and budget.
3. User reviews the request summary and submits it.
4. App confirms that the trip coordinator will follow up and provides a support shortcut.

### Read destination rules

1. User opens a trip detail or the Journal/Destination Rules area.
2. User selects a destination such as Semeru.
3. User scans grouped rules for permits, health, equipment, weather, and prohibited actions.
4. User can return to the trip detail without losing the selected trip.

## Visual System

The brand palette is based on a forest-green identity with soft neutral surfaces:

| Token | Color | Use |
|---|---|---|
| primary | `#2D5A27` | Main CTA, active tab, key accents, confirmation states. |
| background | `#F1F4F1` | App canvas and calm page background. |
| surface | `#FFFFFF` | Cards, sheets, and elevated content. |
| muted surface | `#E2E8E2` | Secondary chips, skeletons, and grouped controls. |
| accent | `#A3C9A8` | Soft highlight, selected filters, illustration tint. |
| foreground | `#1A251B` | Headings, primary text, and high-contrast labels. |
| muted | `#617064` | Supporting text, metadata, and captions. |
| border | `#D5DED5` | Dividers and card boundaries. |

Headings use **Lora** for an editorial, destination-journal character. Body copy uses **Mulish** for legibility in dense booking and safety content. The app uses generous spacing, 16–24 px card radii, 48 px minimum touch targets, and high contrast for safety-critical information.

## Component Principles

Cards should expose the most decision-relevant facts without requiring a detail screen: location, date, duration, difficulty, availability, and starting price. Primary buttons use the primary token with white text and a subtle pressed scale. Secondary actions use outlined or muted-surface treatments. Safety warnings use a warm semantic warning token while preserving the forest-green brand foundation. Forms are split into short sections with visible progress and a persistent price summary near the final action.

## Content Tone

Copy is in Bahasa Indonesia by default. It is warm, direct, and reassuring rather than overly promotional. Safety and permit content should be explicit and never hidden behind vague marketing language. Prices and availability are presented as demo data until connected to a live booking backend.
