import { useState, useRef, useEffect } from "react";
import { useNotifications } from "../../hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";

const TYPE_ICON = {
  booking_confirmed: "✓",
  booking_cancelled: "✕",
  reminder:          "◷",
};

const TYPE_COLOR = {
  booking_confirmed: "text-green-400",
  booking_cancelled: "text-red-400",
  reminder:          "text-gold",
};

export default function NotificationBell() {
  const { notifications, unreadCount, markAllRead } = useNotifications();
  const [open, setOpen]   = useState(false);
  const ref               = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleOpen() {
    setOpen((o) => !o);
    if (!open && unreadCount > 0) markAllRead();
  }

  return (
    <div ref={ref} className="relative">

      {/* Bell button */}
      <button
        onClick={handleOpen}
        className="relative w-9 h-9 flex items-center justify-center text-muted hover:text-white transition-colors rounded-xl hover:bg-white/5"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>

        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-gold text-dark-base text-[10px] font-body font-semibold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-12 w-80 bg-dark-surface border border-white/10 rounded-2xl shadow-2xl shadow-black/60 z-50 overflow-hidden">

          <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
            <p className="font-display text-base text-white">Notifications</p>
            <span className="text-xs text-muted font-body">
              {notifications.length} total
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-muted text-sm font-body">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`
                    px-5 py-4 border-b border-white/5 flex gap-3
                    ${!n.is_read ? "bg-gold/5" : ""}
                  `}
                >
                  {/* Icon */}
                  <span className={`text-sm mt-0.5 shrink-0 ${TYPE_COLOR[n.type] || "text-muted"}`}>
                    {TYPE_ICON[n.type] || "·"}
                  </span>

                  {/* Message */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white/80 text-sm font-body leading-snug">
                      {n.message}
                    </p>
                    <p className="text-muted text-xs font-body mt-1">
                      {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                    </p>
                  </div>

                  {/* Unread dot */}
                  {!n.is_read && (
                    <div className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-2" />
                  )}
                </div>
              ))
            )}
          </div>

        </div>
      )}
    </div>
  );
}