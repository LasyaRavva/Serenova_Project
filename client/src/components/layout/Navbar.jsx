import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, signOut } = useAuth();
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

        <div className="flex items-center gap-6">
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

      </div>
    </nav>
  );
}