import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isSameDay, isToday,
  isPast, startOfDay, addMonths, subMonths, format, getDay,
} from "date-fns";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function Calendar({ selected, onSelect }) {
  const [viewMonth, setViewMonth] = useState(new Date());

  const start = startOfWeek(startOfMonth(viewMonth));
  const end   = endOfWeek(endOfMonth(viewMonth));
  const days  = eachDayOfInterval({ start, end });

  function isDisabled(day) {
    if (isPast(startOfDay(day)) && !isToday(day)) return true;
    const dow = getDay(day);
    return dow === 0; // Sundays closed
  }

  return (
    <div className="bg-dark-card border border-white/10 rounded-2xl p-6">

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setViewMonth((m) => subMonths(m, 1))}
          className="w-8 h-8 flex items-center justify-center text-muted hover:text-gold transition-colors rounded-lg hover:bg-white/5"
        >
          ‹
        </button>
        <p className="font-display text-lg text-white tracking-wide">
          {format(viewMonth, "MMMM yyyy")}
        </p>
        <button
          onClick={() => setViewMonth((m) => addMonths(m, 1))}
          className="w-8 h-8 flex items-center justify-center text-muted hover:text-gold transition-colors rounded-lg hover:bg-white/5"
        >
          ›
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-xs text-muted font-body uppercase tracking-wider py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const disabled    = isDisabled(day);
          const isSelected  = selected && isSameDay(day, selected);
          const isThisMonth = isSameMonth(day, viewMonth);
          const todayDay    = isToday(day);

          return (
            <button
              key={day.toISOString()}
              onClick={() => !disabled && onSelect(day)}
              disabled={disabled}
              className={`
                relative h-10 w-full rounded-xl text-sm font-body transition-all duration-150
                ${!isThisMonth ? "opacity-20" : ""}
                ${disabled
                  ? "text-white/20 cursor-not-allowed"
                  : "cursor-pointer hover:bg-gold/10 hover:text-gold"
                }
                ${isSelected
                  ? "bg-gold text-dark-base font-medium hover:bg-gold hover:text-dark-base"
                  : "text-white/80"
                }
                ${todayDay && !isSelected
                  ? "border border-gold/40"
                  : ""
                }
              `}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-5 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border border-gold/40" />
          <span className="text-xs text-muted font-body">Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gold" />
          <span className="text-xs text-muted font-body">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-white/10" />
          <span className="text-xs text-muted font-body">Closed (Sun)</span>
        </div>
      </div>

    </div>
  );
}

// useState import needed inside this file
import { useState } from "react";