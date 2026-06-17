import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";

const STATUS_STYLE = {
  confirmed: "text-green-400 bg-green-400/10 border-green-400/20",
  cancelled: "text-red-400  bg-red-400/10  border-red-400/20",
  pending:   "text-gold     bg-gold/10     border-gold/20",
};

function formatTime(t) {
  const [h, m] = t.split(":").map(Number);
  const p = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${m.toString().padStart(2, "0")} ${p}`;
}

export default function BookingCard({ booking, onCancel }) {
  const navigate  = useNavigate();
  const service   = booking.services;
  const isUpcoming =
    booking.status === "confirmed" &&
    booking.booking_date >= new Date().toISOString().split("T")[0];

  return (
    <div className="bg-dark-surface border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-colors">
      <div className="flex gap-5 p-5">

        {/* Service image */}
        {service?.image_url && (
          <img
            src={service.image_url}
            alt={service.name}
            className="w-20 h-20 rounded-xl object-cover shrink-0"
          />
        )}

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-display text-lg text-white leading-snug">
              {service?.name}
            </h3>
            <span className={`
              text-xs font-body px-2.5 py-1 rounded-full border shrink-0 capitalize
              ${STATUS_STYLE[booking.status] || "text-muted bg-white/5 border-white/10"}
            `}>
              {booking.status}
            </span>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted font-body">
            <span>
              {format(parseISO(booking.booking_date), "EEEE, dd MMM yyyy")}
            </span>
            <span>{formatTime(booking.start_time)}</span>
            <span>₹{Number(service?.price).toLocaleString("en-IN")}</span>
          </div>

          {booking.notes && (
            <p className="text-muted text-xs font-body mt-2 italic">
              "{booking.notes}"
            </p>
          )}
        </div>

      </div>

      {/* Actions */}
      {isUpcoming && (
        <div className="px-5 pb-5 flex gap-3">
          <button
            onClick={() => navigate(`/book/${service?.id}`)}
            className="text-xs font-body text-muted hover:text-gold border border-white/10 hover:border-gold/30 px-4 py-2 rounded-xl transition-colors"
          >
            Book again
          </button>
          <button
            onClick={() => onCancel(booking.id, service?.name, booking.booking_date)}
            className="text-xs font-body text-red-400/70 hover:text-red-400 border border-red-400/10 hover:border-red-400/30 px-4 py-2 rounded-xl transition-colors"
          >
            Cancel booking
          </button>
        </div>
      )}
    </div>
  );
}