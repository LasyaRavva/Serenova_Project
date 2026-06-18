import { useState } from "react";
import { useBookings } from "../hooks/useBookings";
import BookingTabs from "../components/dashboard/BookingTabs";
import BookingCard from "../components/dashboard/BookingCard";
import { useToast } from "../components/ui/ToastContext";

export default function Dashboard() {
  const { upcoming, past, cancelled, loading, cancelBooking } = useBookings();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [cancelling, setCancelling] = useState(null);

  const tabData = { upcoming, past, cancelled };
  const current = tabData[activeTab] || [];
  const { addToast } = useToast();

  async function handleCancel(bookingId, serviceName, bookingDate) {
    const confirmed = window.confirm(
      `Cancel your ${serviceName} appointment on ${bookingDate}?`
    );
    if (!confirmed) return;

    setCancelling(bookingId);
    await cancelBooking(bookingId, serviceName, bookingDate);
    addToast({ message: "Booking cancelled.", type: "info" });
    setCancelling(null);
  }

  return (
    <div className="min-h-screen bg-dark-base px-6 py-12">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="text-gold text-xs font-body uppercase tracking-widest mb-3">
            Account
          </p>
          <h1 className="font-display text-5xl text-white mb-4">
            My Bookings
          </h1>

          {/* Quick stats */}
          {!loading && (
            <div className="flex gap-8 mt-6 pt-6 border-t border-white/10">
              <Stat value={upcoming.length}  label="Upcoming"  />
              <Stat value={past.length}      label="Completed" />
              <Stat value={cancelled.length} label="Cancelled" />
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <BookingTabs
            active={activeTab}
            setActive={setActiveTab}
            counts={{
              upcoming:  upcoming.length,
              past:      past.length,
              cancelled: cancelled.length,
            }}
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-dark-surface border border-white/10 rounded-2xl h-32 animate-pulse"
              />
            ))}
          </div>
        ) : current.length === 0 ? (
          <EmptyState tab={activeTab} />
        ) : (
          <div className="space-y-4">
            {current.map((booking) => (
              <div
                key={booking.id}
                className={cancelling === booking.id ? "opacity-50 pointer-events-none" : ""}
              >
                <BookingCard
                  booking={booking}
                  onCancel={handleCancel}
                />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <p className="font-display text-3xl text-gold">{value}</p>
      <p className="text-muted text-xs font-body uppercase tracking-wider mt-1">
        {label}
      </p>
    </div>
  );
}

function EmptyState({ tab }) {
  const messages = {
    upcoming:  { title: "No upcoming appointments", sub: "Browse our services and book your first session." },
    past:      { title: "No completed appointments", sub: "Your visit history will show here." },
    cancelled: { title: "No cancelled bookings",    sub: "Good — nothing cancelled." },
  };
  const { title, sub } = messages[tab];

  return (
    <div className="text-center py-20 border border-white/10 border-dashed rounded-2xl">
      <p className="font-display text-2xl text-white/20 mb-2">{title}</p>
      <p className="text-muted text-sm font-body">{sub}</p>
    </div>
  );
}