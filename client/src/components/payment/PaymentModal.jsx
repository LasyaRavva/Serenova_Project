import { useState } from "react";
import { usePayment } from "../../hooks/usePayment";

const CARD_BRANDS = ["VISA", "Mastercard", "RuPay"];

export default function PaymentModal({ booking, service, onSuccess, onClose }) {
  const { createPayment, loading } = usePayment();
  const [method, setMethod]        = useState(null); // 'mock_card' | 'location'
  const [cardNumber, setCardNumber] = useState("");
  const [step, setStep]            = useState("choose"); // 'choose' | 'card' | 'done'
  const [error, setError]          = useState("");

  async function handlePayNow() {
    if (step === "choose") { setStep("card"); return; }

    // Mock card validation
    if (cardNumber.replace(/\s/g, "").length < 12) {
      setError("Please enter a valid card number.");
      return;
    }
    setError("");

    try {
      const payment = await createPayment({
        bookingId: booking.id,
        amount:    service.price,
        method:    "mock_card",
      });
      onSuccess(payment);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handlePayAtLocation() {
    try {
      const payment = await createPayment({
        bookingId: booking.id,
        amount:    service.price,
        method:    "location",
      });
      onSuccess(payment);
    } catch (err) {
      setError(err.message);
    }
  }

  // Format card number with spaces every 4 digits
  function handleCardInput(e) {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(" ") || raw;
    setCardNumber(formatted);
  }

  return (
    // Backdrop
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-dark-surface border border-white/10 rounded-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div>
            <p className="font-display text-xl text-white">Complete Payment</p>
            <p className="text-muted text-xs font-body mt-0.5">
              {service?.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-white transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-6">

          {/* Amount */}
          <div className="bg-dark-card rounded-2xl p-5 mb-6 flex items-center justify-between">
            <div>
              <p className="text-muted text-xs font-body uppercase tracking-wider mb-1">
                Total Due
              </p>
              <p className="font-display text-3xl text-gold">
                ₹{Number(service?.price).toLocaleString("en-IN")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-muted text-xs font-body">Booking ID</p>
              <p className="text-white text-xs font-body mt-1">
                #{booking?.id?.slice(0, 8).toUpperCase()}
              </p>
            </div>
          </div>

          {/* Step: Choose method */}
          {step === "choose" && (
            <div className="space-y-3">
              <p className="text-xs text-muted font-body uppercase tracking-widest mb-4">
                Payment Method
              </p>

              {/* Pay Now */}
              <button
                onClick={() => { setMethod("mock_card"); setStep("card"); }}
                className="w-full flex items-center gap-4 bg-dark-card border border-white/10 hover:border-gold/40 rounded-2xl p-4 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                  <span className="text-gold text-sm">💳</span>
                </div>
                <div className="text-left flex-1">
                  <p className="text-white text-sm font-body">Pay Now</p>
                  <p className="text-muted text-xs font-body mt-0.5">
                    Credit / Debit card
                  </p>
                </div>
                <span className="text-muted group-hover:text-gold transition-colors">›</span>
              </button>

              {/* Pay at location */}
              <button
                onClick={handlePayAtLocation}
                disabled={loading}
                className="w-full flex items-center gap-4 bg-dark-card border border-white/10 hover:border-gold/40 rounded-2xl p-4 transition-all group disabled:opacity-50"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <span className="text-white/60 text-sm">🏛</span>
                </div>
                <div className="text-left flex-1">
                  <p className="text-white text-sm font-body">Pay at Location</p>
                  <p className="text-muted text-xs font-body mt-0.5">
                    Cash or card when you arrive
                  </p>
                </div>
                <span className="text-muted group-hover:text-gold transition-colors">›</span>
              </button>
            </div>
          )}

          {/* Step: Card entry */}
          {step === "card" && (
            <div className="space-y-4">
              <button
                onClick={() => setStep("choose")}
                className="text-muted hover:text-gold text-xs font-body transition-colors flex items-center gap-1"
              >
                ← Back
              </button>

              {/* Mock card visual */}
              <div className="bg-gradient-to-br from-dark-card to-dark-base border border-gold/20 rounded-2xl p-5 mb-2">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-8 h-6 bg-gold/30 rounded-sm" />
                  <span className="text-muted text-xs font-body">SERENOVA PAY</span>
                </div>
                <p className="font-body text-white tracking-widest text-sm mb-4">
                  {cardNumber || "•••• •••• •••• ••••"}
                </p>
                <div className="flex gap-8 text-xs text-muted font-body">
                  <span>CARDHOLDER NAME</span>
                  <span>VALID THRU 12/28</span>
                </div>
              </div>

              {/* Accepted brands */}
              <div className="flex gap-2 mb-4">
                {CARD_BRANDS.map((b) => (
                  <span key={b} className="text-xs text-muted font-body border border-white/10 px-2 py-1 rounded-lg">
                    {b}
                  </span>
                ))}
              </div>

              {/* Card number input */}
              <div>
                <label className="block text-xs text-muted font-body uppercase tracking-wider mb-2">
                  Card Number
                </label>
                <input
                  value={cardNumber}
                  onChange={handleCardInput}
                  placeholder="1234 5678 9012 3456"
                  className="w-full bg-dark-card border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm placeholder:text-white/20 focus:outline-none focus:border-gold transition-colors tracking-widest"
                />
              </div>

              {/* Expiry + CVV (display only for mock) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-muted font-body uppercase tracking-wider mb-2">
                    Expiry
                  </label>
                  <input
                    placeholder="MM / YY"
                    className="w-full bg-dark-card border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm placeholder:text-white/20 focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted font-body uppercase tracking-wider mb-2">
                    CVV
                  </label>
                  <input
                    placeholder="•••"
                    maxLength={3}
                    className="w-full bg-dark-card border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm placeholder:text-white/20 focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-sm font-body">{error}</p>
              )}

              <button
                onClick={handlePayNow}
                disabled={loading}
                className="w-full bg-gold hover:bg-gold/90 disabled:opacity-50 text-dark-base font-body font-medium text-sm py-3.5 rounded-xl transition-colors mt-2"
              >
                {loading
                  ? "Processing..."
                  : `Pay ₹${Number(service?.price).toLocaleString("en-IN")}`
                }
              </button>

              <p className="text-center text-muted text-xs font-body">
                🔒 This is a mock payment — no real charge will occur
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}