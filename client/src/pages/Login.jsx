import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(form);
      navigate("/services");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-dark-base flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl text-gold tracking-widest">SERENOVA</h1>
          <p className="text-muted text-sm mt-2 font-body">Luxury Salon & Spa, Hyderabad</p>
        </div>

        {/* Card */}
        <div className="bg-dark-surface border border-white/10 rounded-2xl p-8">
          <h2 className="font-display text-2xl text-white mb-1">Welcome back</h2>
          <p className="text-muted text-sm font-body mb-8">Sign in to your account</p>

          <div className="space-y-5">
            <div>
              <label className="block text-xs text-muted font-body uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-dark-card border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm placeholder:text-white/20 focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-muted font-body uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-dark-card border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm placeholder:text-white/20 focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm font-body">{error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gold hover:bg-gold/90 text-dark-base font-body font-medium text-sm py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>

          <p className="text-center text-muted text-sm font-body mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-gold hover:underline">
              Create one
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}