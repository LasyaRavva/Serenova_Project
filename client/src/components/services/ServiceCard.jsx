import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const CATEGORY_COLORS = {
  Facial:  "text-rose-300 bg-rose-300/10",
  Massage: "text-blue-300 bg-blue-300/10",
  Bridal:  "text-pink-300 bg-pink-300/10",
  Hair:    "text-amber-300 bg-amber-300/10",
  Nails:   "text-purple-300 bg-purple-300/10",
  Body:    "text-green-300 bg-green-300/10",
};

function formatDuration(mins) {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export default function ServiceCard({ service }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  function handleBook() {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate(`/book/${service.id}`);
  }

  const categoryStyle =
    CATEGORY_COLORS[service.category] || "text-gold bg-gold/10";

  return (
    <div className="group bg-dark-surface border border-white/10 rounded-2xl overflow-hidden hover:border-gold/30 transition-all duration-300 hover:shadow-lg hover:shadow-gold/5 flex flex-col">

      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={service.image_url}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-surface/60 to-transparent" />

        {/* Duration badge — sits on image */}
        <span className="absolute bottom-3 left-3 bg-dark-base/80 backdrop-blur-sm text-white/80 text-xs font-body px-3 py-1 rounded-full border border-white/10">
          {formatDuration(service.duration_minutes)}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">

        {/* Category */}
        <span className={`text-xs font-body uppercase tracking-widest px-2 py-1 rounded-full self-start mb-3 ${categoryStyle}`}>
          {service.category}
        </span>

        {/* Name */}
        <h3 className="font-display text-xl text-white mb-2 leading-snug">
          {service.name}
        </h3>

        {/* Description */}
        <p className="text-muted text-sm font-body leading-relaxed line-clamp-2 flex-1">
          {service.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-5 pt-5 border-t border-white/10">
          <div>
            <span className="font-display text-2xl text-gold">
              ₹{Number(service.price).toLocaleString("en-IN")}
            </span>
          </div>

          <button
            onClick={handleBook}
            className="bg-gold/10 hover:bg-gold text-gold hover:text-dark-base border border-gold/30 hover:border-gold text-xs font-body uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all duration-200"
          >
            Book Now
          </button>
        </div>

      </div>
    </div>
  );
}