# Serenova — Luxury Salon & Spa Booking Platform

## Client Brief

Built for **Serenova Salon & Spa**, a high-end beauty and wellness studio
in Banjara Hills, Hyderabad. Their core need: customers should be able to
browse services, pick a time slot, and book online without calling — and
staff should see all upcoming bookings in one place.

## User Stories

- As a customer, I can browse all available services with pricing and duration
- As a customer, I can pick a date and available time slot to book a service
- As a customer, I can view and cancel my upcoming bookings
- As a logged-in user, I have a profile with my booking history
- As an admin, I can view all bookings across all customers

## Tech Stack

- **Frontend:** React + Vite, Tailwind CSS
- **Backend/DB:** Supabase (Auth, PostgreSQL, Realtime)
- **Routing:** React Router v6
- **Date handling:** date-fns

## Design Direction

Dark luxury aesthetic — near-black base (#0F0F0F), gold accents (#C9A84C),
Cormorant Garamond display font paired with Inter for body text.

## DB Schema

See `/docs/schema.md` (added in commit 2)

## Progress

- [x] Commit 1 — Project setup, README, client brief
- [x] Commit 2 — Database schema
- [x] Commit 3 — Auth: signup / login / profiles
- [x] Commit 4 — Service listing page
- [x] Commit 5 — Booking form: calendar + time slot picker
- [ ] Commit 6 — User dashboard + notifications
- [ ] Commit 7 — Payment flow
- [ ] Commit 8 — Polish, responsive, deploy