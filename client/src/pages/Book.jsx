import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBooking } from "../hooks/useBooking";
import Calendar from "../components/booking/Calendar";
import TimeSlotPicker from "../components/booking/TimeSlotPicker";
import BookingSummary from "../components/booking/BookingSummary";

export default function Book() {
  const { serviceId }                 = useParams();
  const { user }                      = useAuth();
  const navigate                      = useNavigate();
  const { service, slots, bookedTimes,
          loading, fetchSlotsForDate,
          createBooking }             = useBooking(serviceId);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notes, setNotes]               = useState("");
  const [confirming, setConfirming]     = useState(false);
  const [confirmed, setConfirmed]       = useState(null); // booking object

  // When date changes, reset slot + fetch availability
  async function handleDateSelect(date) {
    setSelectedDate(date);
    setSelectedSlot(null);
    await fetchSlotsForDate(date);
  }

  async function handleConfirm() {
    if (!selectedDate || !selectedSlot || !user) return;
    setConfirming(true);
    try {
      const booking = await createBooking({
        userId: user.id,
        date:   selectedDate,
        slot:   selectedSlot,
        notes,
      });
      setConfirmed(booking);
    } catch (err) {
      alert("Booking failed: " + err.message);
    } finally {
      setConfirming(false);
    }
  }

  // ── Success screen ──────────────────────────────────────────────
  if (confirmed) {
    return (
      <div className="min-h-screen bg-dark-base flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">

          {/* Gold ring checkmark */}
          <div className="w-20 h-20 rounded-full border-2 border-gold flex items-center justify-center mx-auto mb-8">
            <span className="text-gold text-3xl">✓</span>
          </div>

          <h2 className="font-display text-4xl text-white mb-3">
            You're booked
          </h2>
          <p className="text-muted font-body text-sm mb-8 leading-relaxed">
            Your appointment at Serenova has been confirmed.
            We'll see you soon.
          </p>

          {/* Booking ID */}
          <div className="bg-dark-surface border border-white/10 rounded-2xl p-5 mb-8 text-left space-y-3">
            <Row label="Service" value={service?.name} />
            <Row label="Booking ID" value={confirmed.id.slice(0, 8).toUpperCase()} />
            <Row label="Status" value="Confirmed" gold />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex-1 bg-gold hover:bg-gold/90 text-dark-base font-body font-medium text-sm py-3 rounded-xl transition-colors"
            >
              View My Bookings
            </button>
            <button
              onClick={() => navigate("/services")}
              className="flex-1 border border-white/10 hover:border-gold/30 text-white font-body text-sm py-3 rounded-xl transition-colors"
            >
              Back to Services
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ── Loading ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-base flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Main booking UI ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-dark-base px-6 py-12">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => navigate("/services")}
            className="text-muted hover:text-gold text-sm font-body transition-colors mb-6 flex items-center gap-2"
          >
            ← Back to Services
          </button>
          <p className="text-gold text-xs font-body uppercase tracking-widest mb-2">
            Book Appointment
          </p>
          <h1 className="font-display text-4xl text-white">
            {service?.name}
          </h1>
        </div>

        {/* 3-step indicator */}
        <div className="flex items-center gap-3 mb-10">
          {["Pick a Date", "Pick a Time", "Confirm"].map((step, i) => {
            const done =
              (i === 0 && selectedDate) ||
              (i === 1 && selectedSlot) ||
              (i === 2 && selectedDate && selectedSlot);
            const active =
              (i === 0 && !selectedDate) ||
              (i === 1 && selectedDate && !selectedSlot) ||
              (i === 2 && selectedDate && selectedSlot);
            return (
              <div key={step} className="flex items-center gap-3">
                <div className={`
                  flex items-center gap-2 text-xs font-body uppercase tracking-wider
                  ${done ? "text-gold" : active ? "text-white" : "text-muted"}
                `}>
                  <span className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs border
                    ${done
                      ? "border-gold bg-gold text-dark-base"
                      : active
                        ? "border-white text-white"
                        : "border-white/20 text-muted"
                    }
                  `}>
                    {done ? "✓" : i + 1}
                  </span>
                  {step}
                </div>
                {i < 2 && <span className="text-white/10">—</span>}
              </div>
            );
          })}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left — Calendar + Slots */}
          <div className="lg:col-span-2 space-y-6">
            <Calendar
              selected={selectedDate}
              onSelect={handleDateSelect}
            />

            {selectedDate && (
              <TimeSlotPicker
                slots={slots}
                bookedTimes={bookedTimes}
                selected={selectedSlot}
                onSelect={setSelectedSlot}
              />
            )}
          </div>

          {/* Right — Summary */}
          <div>
            <BookingSummary
              service={service}
              date={selectedDate}
              slot={selectedSlot}
              notes={notes}
              setNotes={setNotes}
              onConfirm={handleConfirm}
              loading={confirming}
            />
          </div>

        </div>
      </div>
    </div>
  );
}

function Row({ label, value, gold }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted text-sm font-body">{label}</span>
      <span className={`text-sm font-body ${gold ? "text-gold" : "text-white"}`}>{value}</span>
    </div>
  );
}