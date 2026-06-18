import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-base flex items-center justify-center px-6">
      <div className="text-center max-w-sm">

        <p className="font-display text-8xl text-gold/20 mb-6">404</p>

        <h1 className="font-display text-3xl text-white mb-3">
          Page not found
        </h1>
        <p className="text-muted font-body text-sm leading-relaxed mb-10">
          This page doesn't exist or was moved.
          Head back and we'll get you sorted.
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="border border-white/10 hover:border-gold/30 text-white font-body text-sm px-5 py-2.5 rounded-xl transition-colors"
          >
            ← Go back
          </button>
          <button
            onClick={() => navigate("/services")}
            className="bg-gold hover:bg-gold/90 text-dark-base font-body font-medium text-sm px-5 py-2.5 rounded-xl transition-colors"
          >
            View Services
          </button>
        </div>

      </div>
    </div>
  );
}