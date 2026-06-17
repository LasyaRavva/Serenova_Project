# Serenova — Database Schema

## Tables
- **profiles** — extends auth.users, stores name/phone/role
- **services** — salon services with price, duration, category
- **availability_slots** — weekly recurring open slots (Mon–Sat)
- **bookings** — customer bookings linked to service + slot
- **payments** — payment record per booking
- **notifications** — in-app notifications per user

## Key relationships
bookings → profiles (user_id)
bookings → services (service_id)
payments → bookings (booking_id)
notifications → profiles (user_id)