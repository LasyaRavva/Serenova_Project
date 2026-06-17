import { format } from "date-fns";

function formatTime(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour   = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}

function formatDuration(mins) {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export default function BookingSummary({ service, date, slot, notes, setNotes, onConfirm, loading }) {
  const ready = service && date && slot;

  return (
    <div className="bg-dark-card border border-white/10 rounded-2xl p-6 sticky top-24">
      <p className="text-xs text-muted font-body uppercase tracking-widest mb-5">
        Booking Summary
      </p>

      {/* Service */}
      <div className="flex gap-4 mb-6 pb-6 border-b border-white/10">
        {service?.image_url && (
          <img
            src={service.image_url}
            alt={service.name}
            className="w-16 h-16 rounded-xl object-cover shrink-0"
          />
        )}
        <div>
          <p className="font-display text-lg text-white leading-snug">
            {service?.name || "—"}
          </p>
          <p className="text-muted text-xs font-body mt-1">
            {service ? formatDuration(service.duration_minutes) : ""}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3 mb-6">
        <Row label="Date"  value={date ? format(date, "EEEE, dd MMM yyyy") : "Not selected"} />
        <Row label="Time"  value={slot ? formatTime(slot.start_time) : "Not selected"} />
        <Row label="Price" value={service ? `₹${Number(service.price).toLocaleString("en-IN")}` : "—"} gold />
      </div>

      {/* Notes */}
      <div className="mb-6">
        <label className="block text-xs text-muted font-body uppercase tracking-wider mb-2">
          Notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any preferences or requests..."
          rows={3}
          className="w-full bg-dark-surface border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm placeholder:text-white/20 focus:outline-none focus:border-gold transition-colors resize-none"
        />
      </div>

      {/* Confirm button */}
      <button
        onClick={onConfirm}
        disabled={!ready || loading}
        className="w-full bg-gold hover:bg-gold/90 disabled:opacity-30 disabled:cursor-not-allowed text-dark-base font-body font-medium text-sm py-3.5 rounded-xl transition-all duration-200"
      >
        {loading ? "Confirming..." : ready ? "Confirm Booking" : "Select date & time"}
      </button>

      {!ready && (
        <p className="text-center text-muted text-xs font-body mt-3">
          Pick a date and time slot to continue
        </p>
      )}
    </div>
  );
}

function Row({ label, value, gold }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-muted text-sm font-body">{label}</span>
      <span className={`text-sm font-body ${gold ? "text-gold font-display text-base" : "text-white"}`}>
        {value}
      </span>
    </div>
  );
}