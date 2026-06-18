import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/ToastContext";

export default function Profile() {
  const { profile, updateProfile, signOut } = useAuth();
  const [form, setForm] = useState({
    fullName: profile?.full_name || "",
    phone: profile?.phone || "",
  });
  const [status, setStatus] = useState(""); // 'saving' | 'saved' | 'error'
  const { addToast } = useToast();
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSave(e) {
    e.preventDefault();
    setStatus("saving");
    try {
      await updateProfile(form);
      setStatus("saved");
      addToast({ message: "Profile updated.", type: "success" });
      setTimeout(() => setStatus(""), 2500);
    } catch {
      setStatus("error");
      addToast({ message: "Couldn't save changes. Try again.", type: "error" });
    }
  }

  return (
    <div className="min-h-screen bg-dark-base px-4 py-12">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="text-gold text-xs font-body uppercase tracking-widest mb-2">Account</p>
          <h1 className="font-display text-4xl text-white">Your Profile</h1>
        </div>

        {/* Avatar placeholder */}
        <div className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 rounded-full bg-dark-card border border-gold/30 flex items-center justify-center">
            <span className="font-display text-2xl text-gold">
              {profile?.full_name?.[0]?.toUpperCase() || "?"}
            </span>
          </div>
          <div>
            <p className="text-white font-body font-medium">{profile?.full_name}</p>
            <p className="text-muted text-sm font-body">{profile?.role}</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-dark-surface border border-white/10 rounded-2xl p-8 space-y-6">
          <div>
            <label className="block text-xs text-muted font-body uppercase tracking-wider mb-2">
              Full Name
            </label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full bg-dark-card border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-muted font-body uppercase tracking-wider mb-2">
              Phone
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full bg-dark-card border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleSave}
              disabled={status === "saving"}
              className="bg-gold hover:bg-gold/90 text-dark-base font-body font-medium text-sm px-6 py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {status === "saving" ? "Saving..." : "Save Changes"}
            </button>

            {status === "saved" && (
              <span className="text-green-400 text-sm font-body">Changes saved</span>
            )}
            {status === "error" && (
              <span className="text-red-400 text-sm font-body">Something went wrong</span>
            )}
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={signOut}
          className="mt-6 text-muted hover:text-white text-sm font-body transition-colors"
        >
          Sign out →
        </button>

      </div>
    </div>
  );
}