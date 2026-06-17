function formatTime(timeStr) {
  // "14:00:00" → "2:00 PM"
  const [h, m] = timeStr.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour   = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}

export default function TimeSlotPicker({ slots, bookedTimes, selected, onSelect }) {
  if (slots.length === 0) {
    return (
      <div className="bg-dark-card border border-white/10 rounded-2xl p-6 text-center">
        <p className="text-muted font-body text-sm">No slots available for this day.</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-card border border-white/10 rounded-2xl p-6">
      <p className="text-xs text-muted font-body uppercase tracking-widest mb-5">
        Available Times
      </p>

      <div className="grid grid-cols-3 gap-2">
        {slots.map((slot) => {
          const isBooked   = bookedTimes.has(slot.start_time);
          const isSelected = selected?.id === slot.id;

          return (
            <button
              key={slot.id}
              onClick={() => !isBooked && onSelect(slot)}
              disabled={isBooked}
              className={`
                px-3 py-3 rounded-xl text-xs font-body transition-all duration-150 text-center
                ${isBooked
                  ? "bg-white/5 text-white/20 cursor-not-allowed line-through"
                  : isSelected
                    ? "bg-gold text-dark-base font-medium"
                    : "bg-dark-surface border border-white/10 text-white/70 hover:border-gold/40 hover:text-gold cursor-pointer"
                }
              `}
            >
              {formatTime(slot.start_time)}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-muted font-body mt-4">
        {slots.filter((s) => !bookedTimes.has(s.start_time)).length} slots available
      </p>
    </div>
  );
}