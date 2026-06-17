import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "", phone: "", email: "", password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await signUp(form);
      navigate("/services");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    { name: "fullName", label: "Full Name", type: "text", placeholder: "Priya Sharma" },
    { name: "phone", label: "Phone", type: "tel", placeholder: "+91 98765 43210" },
    { name: "email", label: "Email", type: "email", placeholder: "you@example.com" },
    { name: "password", label: "Password", type: "password", placeholder: "Min. 6 characters" },
  ];

  return (
    <div className="min-h-screen bg-dark-base flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        <div className="text-center mb-10">
          <h1 className="font-display text-4xl text-gold tracking-widest">SERENOVA</h1>
          <p className="text-muted text-sm mt-2 font-body">Luxury Salon & Spa, Hyderabad</p>
        </div>

        <div className="bg-dark-surface border border-white/10 rounded-2xl p-8">
          <h2 className="font-display text-2xl text-white mb-1">Create account</h2>
          <p className="text-muted text-sm font-body mb-8">Join Serenova to book your first appointment</p>

          <div className="space-y-5">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="block text-xs text-muted font-body uppercase tracking-wider mb-2">
                  {field.label}
                </label>
                <input
                  name={field.name}
                  type={field.type}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full bg-dark-card border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm placeholder:text-white/20 focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            ))}

            {error && (
              <p className="text-red-400 text-sm font-body">{error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gold hover:bg-gold/90 text-dark-base font-body font-medium text-sm py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </div>

          <p className="text-center text-muted text-sm font-body mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-gold hover:underline">
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}