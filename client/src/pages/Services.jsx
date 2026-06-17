import { useState, useMemo } from "react";
import { useServices } from "../hooks/useServices";
import FilterBar from "../components/services/FilterBar";
import ServiceGrid from "../components/services/ServiceGrid";

export default function Services() {
  const { services, loading, error } = useServices();
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeDuration, setActiveDuration] = useState("all");

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const catMatch =
        activeCategory === "All" || s.category === activeCategory;

      const durMatch =
        activeDuration === "all" ||
        (activeDuration === "short" && s.duration_minutes < 60) ||
        (activeDuration === "medium" &&
          s.duration_minutes >= 60 &&
          s.duration_minutes <= 120) ||
        (activeDuration === "long" && s.duration_minutes > 120);

      return catMatch && durMatch;
    });
  }, [services, activeCategory, activeDuration]);

  return (
    <div className="min-h-screen bg-dark-base px-6 py-12">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <p className="text-gold text-xs font-body uppercase tracking-widest mb-3">
            Banjara Hills, Hyderabad
          </p>
          <h1 className="font-display text-5xl text-white mb-4">
            Our Services
          </h1>
          <p className="text-muted font-body text-base max-w-xl leading-relaxed">
            Each treatment is crafted for your comfort and care —
            from signature facials to bridal packages, every session
            is an experience.
          </p>
        </div>

        {/* Stats row */}
        {!loading && (
          <div className="flex gap-8 mb-10 pb-10 border-b border-white/10">
            <div>
              <p className="font-display text-3xl text-gold">{services.length}</p>
              <p className="text-muted text-xs font-body uppercase tracking-wider mt-1">Services</p>
            </div>
            <div>
              <p className="font-display text-3xl text-gold">
                {[...new Set(services.map((s) => s.category))].length}
              </p>
              <p className="text-muted text-xs font-body uppercase tracking-wider mt-1">Categories</p>
            </div>
            <div>
              <p className="font-display text-3xl text-gold">Mon–Sat</p>
              <p className="text-muted text-xs font-body uppercase tracking-wider mt-1">Open</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-red-400 font-body text-sm mb-6">{error}</p>
        )}

        {/* Filters */}
        <FilterBar
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          activeDuration={activeDuration}
          setActiveDuration={setActiveDuration}
        />

        {/* Grid */}
        <ServiceGrid services={filtered} loading={loading} />

      </div>
    </div>
  );
}