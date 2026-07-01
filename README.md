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


## Live Demo
https://serenova-project.vercel.app/

## Known limitations / next steps
- Stripe live payments (currently mock)
- Admin panel for staff to manage bookings
- SMS reminders via Twilio
- Multi-staff booking (assign stylist)
- Google Calendar sync

## Progress

- [x] Commit 1 — Project setup, README, client brief
- [x] Commit 2 — Database schema
- [x] Commit 3 — Auth: signup / login / profiles
- [x] Commit 4 — Service listing page
- [x] Commit 5 — Booking form: calendar + time slot picker
- [x] Commit 6 — User dashboard + notifications
- [x] Commit 7 — Payment flow
- [x] Commit 8 — Polish, responsive, deploy

## Live URLs
- Frontend: https://serenova.vercel.app
- Backend API: https://serenova-api.railway.app

## API Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/services | No | List all services |
| GET | /api/services/:id | No | Single service |
| GET | /api/bookings/my | Yes | User's bookings |
| GET | /api/bookings/availability | No | Available slots |
| POST | /api/bookings | Yes | Create booking |
| PATCH | /api/bookings/:id/cancel | Yes | Cancel booking |
| POST | /api/payments/create-session | Yes | Stripe checkout |
| POST | /api/payments/webhook | Stripe | Payment webhook |

## Environment Variables
### Client (Vercel)
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_API_URL

### Server (Railway)
- SUPABASE_URL
- SUPABASE_SERVICE_KEY
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- EMAIL_USER
- EMAIL_PASS
- CLIENT_URL
