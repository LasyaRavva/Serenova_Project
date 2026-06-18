import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/login");
  }

  return (
    <nav className="border-b border-white/10 bg-dark-base/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        <Link to="/" className="font-display text-xl text-gold tracking-widest">
          SERENOVA
        </Link>

        {/* Desktop */}
        {/* // Replace the nav links div in Navbar.jsx with: */}
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

{/* Mobile: just bell + avatar */}
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
  ) : (
    <Link
      to="/login"
      className="bg-gold text-dark-base text-xs font-body font-medium px-4 py-2 rounded-xl"
    >
      Sign In
    </Link>
  )}
</div>
      </div>
    </nav>
  );
}