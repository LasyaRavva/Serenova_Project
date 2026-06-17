export default function BookingTabs({ active, setActive, counts }) {
  const tabs = [
    { key: "upcoming",  label: "Upcoming"  },
    { key: "past",      label: "Past"      },
    { key: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="flex gap-1 bg-dark-card border border-white/10 rounded-2xl p-1 w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActive(tab.key)}
          className={`
            flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-body transition-all duration-200
            ${active === tab.key
              ? "bg-gold text-dark-base font-medium"
              : "text-muted hover:text-white"
            }
          `}
        >
          {tab.label}
          {counts[tab.key] > 0 && (
            <span className={`
              text-xs px-1.5 py-0.5 rounded-full font-body
              ${active === tab.key
                ? "bg-dark-base/20 text-dark-base"
                : "bg-white/10 text-muted"
              }
            `}>
              {counts[tab.key]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}