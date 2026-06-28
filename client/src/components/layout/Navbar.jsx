import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const navigate                   = useNavigate();
  const [menuOpen, setMenuOpen]    = useState(false);

  async function handleSignOut() {
    await signOut();
    navigate("/login");
    setMenuOpen(false);
  }

  return (
    <nav className="border-b border-white/10 bg-dark-base/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="font-display text-xl text-gold tracking-widest">
          SERENOVA
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-6">
          <Link to="/services" className="text-muted hover:text-white text-sm font-body transition-colors">
            Services
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-muted hover:text-white text-sm font-body transition-colors">
                My Bookings
              </Link>
              <Link to="/profile" className="text-muted hover:text-white text-sm font-body transition-colors">
                Profile
              </Link>
              {/* Admin link — desktop */}
              {profile?.role === "admin" && (
                <Link to="/admin" className="text-gold text-sm font-body hover:text-gold/80 transition-colors">
                  Admin
                </Link>
              )}
              <NotificationBell />
            </>
          ) : (
            <Link
              to="/login"
              className="bg-gold hover:bg-gold/90 text-dark-base text-sm font-body font-medium px-5 py-2 rounded-xl transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile right side — bell + avatar + hamburger */}
        <div className="flex sm:hidden items-center gap-3">
          {user && <NotificationBell />}

          {user ? (
            <Link to="/profile">
              <div className="w-8 h-8 rounded-full bg-dark-card border border-gold/30 flex items-center justify-center">
                <span className="font-display text-sm text-gold">
                  {profile?.full_name?.[0]?.toUpperCase() || "?"}
                </span>
              </div>
            </Link>
          ) : null}

          {/* Hamburger button */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 text-muted hover:text-white transition-colors"
          >
            <span className={`block w-5 h-0.5 bg-current transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-current transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-current transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>

      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-white/10 bg-dark-base/98 backdrop-blur-sm">
          <div className="px-6 py-4 flex flex-col gap-1">

            <Link
              to="/services"
              onClick={() => setMenuOpen(false)}
              className="text-muted hover:text-white text-sm font-body py-3 border-b border-white/5 transition-colors"
            >
              Services
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="text-muted hover:text-white text-sm font-body py-3 border-b border-white/5 transition-colors"
                >
                  My Bookings
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="text-muted hover:text-white text-sm font-body py-3 border-b border-white/5 transition-colors"
                >
                  Profile
                </Link>

                {/* Admin link — mobile */}
                {profile?.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="text-gold text-sm font-body py-3 border-b border-white/5 transition-colors"
                  >
                    Admin
                  </Link>
                )}

                <button
                  onClick={handleSignOut}
                  className="text-left text-red-400/70 hover:text-red-400 text-sm font-body py-3 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="text-gold text-sm font-body py-3 transition-colors"
              >
                Sign In
              </Link>
            )}

          </div>
        </div>
      )}

    </nav>
  );
}