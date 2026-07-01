import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBooking } from "../hooks/useBooking";
import { useToast } from "../components/ui/ToastContext";
import { supabase } from "../lib/supabase";
import { apiFetch } from "../lib/api";
import Calendar from "../components/booking/Calendar";
import TimeSlotPicker from "../components/booking/TimeSlotPicker";
import BookingSummary from "../components/booking/BookingSummary";
import PaymentModal from "../components/payment/PaymentModal";
import PaymentStatusBadge from "../components/payment/PaymentStatusBadge";

export default function Book() {
  const { serviceId }                   = useParams();
  const { user }                        = useAuth();
  const navigate                        = useNavigate();
  const { addToast }                    = useToast();
  const { service, slots, bookedTimes,
          loading, fetchSlotsForDate,
          createBooking }               = useBooking(serviceId);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notes, setNotes]               = useState("");
  const [confirming, setConfirming]     = useState(false);
  const [confirmed, setConfirmed]       = useState(null);
  const [showPayment, setShowPayment]   = useState(false);
  const [payment, setPayment]           = useState(null);
  const [stripeLoading, setStripeLoading] = useState(false);

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
      addToast({ message: "Booking confirmed! Complete your payment below.", type: "success" });
    } catch (err) {
      addToast({ message: "Booking failed. Please try again.", type: "error" });
    } finally {
      setConfirming(false);
    }
  }

  function handlePaymentSuccess(paymentData) {
    setPayment(paymentData);
    setShowPayment(false);
    const msg = paymentData.status === "paid"
      ? "Payment received. See you at Serenova!"
      : "Got it — please bring payment when you arrive.";
    addToast({ message: msg, type: "success" });
  }

async function handleStripePayment() {
  setStripeLoading(true);
  try {
    // Refresh session first
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
      return;
    }
    const token = session.access_token;

    const { url } = await apiFetch(
      "/api/payments/create-session",
      {
        method: "POST",
        body: JSON.stringify({ bookingId: confirmed.id, serviceId }),
      },
      token
    );

    window.location.href = url;
  } catch (err) {
    addToast({ message: "Payment failed. Please try again.", type: "error" });
    setStripeLoading(false);
  }
}

  // ── Success screen ───────────────────────────────────────────────
  if (confirmed) {
    return (
      <div className="min-h-screen bg-dark-base flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">

          <div className="w-20 h-20 rounded-full border-2 border-gold flex items-center justify-center mx-auto mb-8">
            <span className="text-gold text-3xl">✓</span>
          </div>

          <h2 className="font-display text-4xl text-white mb-3">You're booked</h2>
          <p className="text-muted font-body text-sm mb-8 leading-relaxed">
            Your appointment at Serenova has been confirmed.
          </p>

          <div className="bg-dark-surface border border-white/10 rounded-2xl p-5 mb-6 text-left space-y-3">
            <Row label="Service"    value={service?.name} />
            <Row label="Booking ID" value={confirmed.id.slice(0, 8).toUpperCase()} />
            <div className="flex justify-between items-center">
              <span className="text-muted text-sm font-body">Payment</span>
              <PaymentStatusBadge status={payment?.status} />
            </div>
          </div>

          {/* Payment options — only if not yet paid */}
          {!payment && (
            <div className="space-y-3 mb-3">
              {/* Stripe payment */}
              <button
                onClick={handleStripePayment}
                disabled={stripeLoading}
                className="w-full bg-gold hover:bg-gold/90 disabled:opacity-50 text-dark-base font-body font-medium text-sm py-3.5 rounded-xl transition-colors"
              >
                {stripeLoading ? "Redirecting to Stripe..." : "Pay Online via Stripe"}
              </button>

              {/* Mock / Pay at location */}
              <button
                onClick={() => setShowPayment(true)}
                className="w-full border border-white/10 hover:border-gold/30 text-white font-body text-sm py-3 rounded-xl transition-colors"
              >
                Pay at Location
              </button>
            </div>
          )}

          {payment?.status === "paid" && (
            <div className="bg-green-400/10 border border-green-400/20 rounded-2xl px-5 py-3 mb-3">
              <p className="text-green-400 text-sm font-body">
                ✓ Payment of ₹{Number(service?.price).toLocaleString("en-IN")} received
              </p>
            </div>
          )}

          {payment?.status === "pending" && (
            <div className="bg-amber-400/10 border border-amber-400/20 rounded-2xl px-5 py-3 mb-3">
              <p className="text-amber-400 text-sm font-body">
                Please bring payment when you visit Serenova
              </p>
            </div>
          )}

          <div className="flex gap-3 mt-2">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex-1 border border-white/10 hover:border-gold/30 text-white font-body text-sm py-3 rounded-xl transition-colors"
            >
              My Bookings
            </button>
            <button
              onClick={() => navigate("/services")}
              className="flex-1 border border-white/10 hover:border-gold/30 text-white font-body text-sm py-3 rounded-xl transition-colors"
            >
              Back to Services
            </button>
          </div>

        </div>

        {showPayment && (
          <PaymentModal
            booking={confirmed}
            service={service}
            onSuccess={handlePaymentSuccess}
            onClose={() => setShowPayment(false)}
          />
        )}

      </div>
    );
  }

  // ── Loading ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-base flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Main booking UI ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-dark-base px-6 py-12">
      <div className="max-w-6xl mx-auto">

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
                  <span className="hidden sm:inline">{step}</span>
                </div>
                {i < 2 && <span className="text-white/10">—</span>}
              </div>
            );
          })}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Mobile summary */}
          <div className="block lg:hidden">
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

          {/* Right — Desktop summary */}
          <div className="hidden lg:block">
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