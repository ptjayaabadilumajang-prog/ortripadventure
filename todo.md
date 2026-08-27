# Project TODO

- [x] Review the supplied Or.Trip implementation documents and extract the final feature scope.
- [x] Review the supplied public reference websites for information architecture and content patterns.
- [x] Create a branded Or.Trip Adventure app icon and apply it to all required asset locations.
- [x] Update app branding configuration with the user-facing app name and logo URL.
- [x] Configure theme tokens for #2D5A27, #F1F4F1, #E2E8E2, #A3C9A8, and #1A251B.
- [x] Load and apply Lora heading typography and Mulish body typography.
- [x] Implement bottom-tab navigation for Home, Explore, Gallery, Journal, and Profile.
- [x] Build Home screen with hero trip, search, quick filters, featured trips, and private-trip CTA.
- [x] Build Explore screen with trip search and filter controls.
- [x] Build Trip Detail screen with itinerary, inclusions, guide, safety, and booking CTA.
- [x] Build booking form with participant, contact, citizenship, currency, and price summary states.
- [x] Build payment screen with payment method and booking confirmation states.
- [x] Build My Booking / confirmation view with booking code and support action.
- [x] Build Private Trip request flow.
- [x] Build Gallery screen with category filters and visual trip moments.
- [x] Build Journal list and article detail screens.
- [x] Build destination rules screen for Semeru and related destinations.
- [x] Add local demo data models for trips, guides, gallery, journal, bookings, and rules.
- [x] Add deterministic unit tests for pricing/citizenship and booking state transitions.
- [x] Run type checks, lint, and tests.
- [x] Verify important screens at mobile portrait viewport and fix visible issues.
- [x] Save the final project checkpoint and provide the project version to the user.

- [x] Replace demo contact points with the official admin WhatsApp numbers, email, social links, website, and supplied logo.
- [x] Add an official contact/support section and wire contact actions to the correct destinations.
- [x] Validate the updated contact and brand data across the app and save a new checkpoint.

- [x] Add dedicated Privacy Policy page.
- [x] Add dedicated Booking Terms & Conditions page.
- [x] Add a reusable WhatsApp booking action with official Or.Trip contact routing.
- [x] Add WhatsApp booking CTA to the Home hero and every trip detail page.
- [x] Add a sticky floating WhatsApp button across all app pages.
- [x] Validate legal navigation and WhatsApp actions on mobile portrait layouts.

- [x] Create a reusable Or.Trip Adventure implementation skill with workflow, templates, and validation guidance.
- [x] Add dynamic FAQ data and accordion sections to trip detail pages.
- [x] Add mandatory Privacy Policy and Booking Terms consent before booking can continue.
- [x] Generate WhatsApp booking messages containing trip name, date, and participant count.
- [x] Validate the new booking flow and skill package, then save a checkpoint.

- [x] Replace all Expo logo, splash, favicon, and adaptive-icon assets with the supplied logo.png.
- [x] Add the Ranu Kumbolo premium package model with four meeting-point pricing options.
- [x] Build the dedicated Ranu Kumbolo package experience with integrated package selection and booking CTA.
- [x] Add the full Ranu Kumbolo facilities, meals, benefits, legal trust badges, and vertical timeline.
- [x] Add Ranu Kumbolo, Semeru, Bromo, and B29 gallery content with lightbox-style viewing.
- [x] Add Ranu Kumbolo FAQ, testimonials, and final conversion CTA content.
- [x] Validate the updated logo, package booking flow, and mobile presentation, then save a checkpoint.

- [x] Add a Ranu Kumbolo photo gallery with selectable full-screen lightbox viewing.
- [x] Add payment-proof file selection and upload state to the booking confirmation flow.
- [x] Add a secure server-side booking submission path for Google Sheets recording.
- [ ] Configure and validate the target Google Sheet connection and required permissions.
- [x] Test gallery, upload validation, booking submission, and Sheets error states before checkpointing.

- [x] Add a user-facing setup guide for creating and deploying the Google Apps Script Web App URL.
- [x] Add booking validation statuses and an admin validation action.
- [x] Add customer-visible validation status refresh on the booking confirmation page.
- [x] Add automatic WhatsApp notification support with a click-to-chat fallback.
- [x] Add configuration documentation for WhatsApp Cloud API credentials and validate the new flows.

- [x] Read the Expo Maps documentation and choose the cross-platform map implementation.
- [x] Add typed Ranu Kumbolo route coordinates, markers, and route summary data.
- [x] Add an interactive map section to the trip detail page with selectable route points.
- [x] Validate map interaction and mobile layout, then save a checkpoint.

- [x] Update Ranu Kumbolo route data with images, segment stats, and navigation links.
- [x] Add a mini photo gallery for each point on the interactive map.
- [x] Add 'Buka di Google Maps' buttons for start and end locations.
- [x] Display distance, elevation, and duration for each route segment.
- [x] Validate enhanced map features and save a checkpoint.

- [x] Implement a dynamic date picker for user-selected departure schedules in the booking flow.
- [x] Audit the financial dashboard (admin) to ensure all revenue and expense tracking functions correctly.
- [x] Preview the entire app flow and perform regression testing on core features.
- [x] Validate the final financial dashboard and save a checkpoint.
- [x] Transform application to a database-first architecture with durable MySQL storage.
- [x] Migrate in-memory booking store to a secure database-backed tRPC router.
- [x] Seed database with official Or.Trip Adventure trips, packages, and business configurations.
- [x] Implement AI Marketing CRM foundation with lead tracking and activity scoring.
- [x] Build an Admin Command Center for managing bookings, leads, and trip verification.
- [x] Ensure all business data (pricing, itinerary, contacts) is admin-configurable and database-driven.
