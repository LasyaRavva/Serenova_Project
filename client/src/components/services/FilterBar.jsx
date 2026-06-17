const CATEGORIES = ["All", "Facial", "Massage", "Bridal", "Hair", "Nails", "Body"];

const DURATIONS = [
  { label: "Any duration", value: "all" },
  { label: "Under 1 hour", value: "short" },
  { label: "1–2 hours",    value: "medium" },
  { label: "2+ hours",     value: "long" },
];

export default function FilterBar({ activeCategory, setActiveCategory, activeDuration, setActiveDuration }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-10">

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 flex-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-xs font-body uppercase tracking-wider px-4 py-2 rounded-full border transition-all duration-200
              ${activeCategory === cat
                ? "bg-gold text-dark-base border-gold"
                : "text-muted border-white/10 hover:border-gold/40 hover:text-white"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Duration dropdown */}
      <div className="shrink-0">
        <select
          value={activeDuration}
          onChange={(e) => setActiveDuration(e.target.value)}
          className="bg-dark-card border border-white/10 text-muted text-sm font-body px-4 py-2 rounded-xl focus:outline-none focus:border-gold transition-colors cursor-pointer"
        >
          {DURATIONS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
}