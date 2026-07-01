import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = ["Facial", "Massage", "Bridal", "Hair", "Nails", "Body"];

const EMPTY_FORM = {
  name:             "",
  description:      "",
  duration_minutes: "",
  price:            "",
  category:         "Facial",
  image_url:        "",
  is_active:        true,
};

export default function Admin() {
  const { profile, isAdmin }              = useAuth();
  const navigate                          = useNavigate();
  const [activeTab, setActiveTab]         = useState("bookings");
  const [bookings, setBookings]           = useState([]);
  const [services, setServices]           = useState([]);
  const [stats, setStats]                 = useState(null);
  const [loadingData, setLoadingData]     = useState(true);
  const [showForm, setShowForm]           = useState(false);
  const [editingId, setEditingId]         = useState(null);
  const [form, setForm]                   = useState(EMPTY_FORM);
  const [saving, setSaving]               = useState(false);
  const [formError, setFormError]         = useState("");
  const [categoryOpen, setCategoryOpen]   = useState(false);
  const categoryRef                       = useRef(null);

  // Close category dropdown on outside click
  useEffect(() => {
    function handler(e) {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (profile && !isAdmin) navigate("/services");
  }, [profile]);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoadingData(true);
    const [{ data: b }, { data: s }] = await Promise.all([
      supabase
        .from("bookings")
        .select(`*, services(*), profiles(full_name, phone)`)
        .order("booking_date", { ascending: false }),
      supabase
        .from("services")
        .select("*")
        .order("created_at"),
    ]);

    setBookings(b || []);
    setServices(s || []);

    const confirmed = (b || []).filter((x) => x.status === "confirmed");
    const revenue   = confirmed.reduce((sum, x) => sum + Number(x.services?.price || 0), 0);
    setStats({
      total:     (b || []).length,
      confirmed: confirmed.length,
      cancelled: (b || []).filter((x) => x.status === "cancelled").length,
      revenue,
    });

    setLoadingData(false);
  }

  async function updateBookingStatus(id, status) {
    await supabase.from("bookings").update({ status }).eq("id", id);
    fetchAll();
  }

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowForm(true);
  }

  function openEdit(service) {
    setEditingId(service.id);
    setForm({
      name:             service.name,
      description:      service.description || "",
      duration_minutes: service.duration_minutes,
      price:            service.price,
      category:         service.category,
      image_url:        service.image_url || "",
      is_active:        service.is_active,
    });
    setFormError("");
    setShowForm(true);
  }

  function handleFormChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSave() {
    if (!form.name || !form.price || !form.duration_minutes) {
      setFormError("Name, price and duration are required.");
      return;
    }

    setSaving(true);
    setFormError("");

    const payload = {
      name:             form.name,
      description:      form.description,
      duration_minutes: Number(form.duration_minutes),
      price:            Number(form.price),
      category:         form.category,
      image_url:        form.image_url,
      is_active:        form.is_active,
    };

    if (editingId) {
      await supabase.from("services").update(payload).eq("id", editingId);
    } else {
      await supabase.from("services").insert(payload);
    }

    setSaving(false);
    setShowForm(false);
    fetchAll();
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("Delete this service? This cannot be undone.");
    if (!confirmed) return;
    await supabase.from("services").delete().eq("id", id);
    fetchAll();
  }

  async function toggleActive(service) {
    await supabase
      .from("services")
      .update({ is_active: !service.is_active })
      .eq("id", service.id);
    fetchAll();
  }

  const tabs = ["bookings", "services"];

  return (
    <div className="min-h-screen bg-dark-base px-6 py-12">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="text-gold text-xs font-body uppercase tracking-widest mb-2">Serenova</p>
          <h1 className="font-display text-5xl text-white">Admin Dashboard</h1>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Total Bookings", value: stats.total },
              { label: "Confirmed",      value: stats.confirmed },
              { label: "Cancelled",      value: stats.cancelled },
              { label: "Revenue",        value: `₹${stats.revenue.toLocaleString("en-IN")}` },
            ].map((s) => (
              <div key={s.label} className="bg-dark-surface border border-white/10 rounded-2xl p-5">
                <p className="text-muted text-xs font-body uppercase tracking-wider mb-2">{s.label}</p>
                <p className="font-display text-3xl text-gold">{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-dark-card border border-white/10 rounded-2xl p-1 w-fit mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-5 py-2.5 rounded-xl text-sm font-body capitalize transition-all duration-200
                ${activeTab === tab
                  ? "bg-gold text-dark-base font-medium"
                  : "text-muted hover:text-white"
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Bookings Tab ── */}
        {activeTab === "bookings" && (
          <div className="bg-dark-surface border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10">
              <p className="font-display text-xl text-white">All Bookings</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    {["Customer", "Service", "Date", "Time", "Status", "Action"].map((h) => (
                      <th key={h} className="text-left text-xs text-muted font-body uppercase tracking-wider px-6 py-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-sm text-white font-body">{b.profiles?.full_name}</td>
                      <td className="px-6 py-4 text-sm text-white font-body">{b.services?.name}</td>
                      <td className="px-6 py-4 text-sm text-muted font-body">{b.booking_date}</td>
                      <td className="px-6 py-4 text-sm text-muted font-body">{b.start_time?.slice(0, 5)}</td>
                      <td className="px-6 py-4">
                        <span className={`
                          text-xs px-2.5 py-1 rounded-full border font-body capitalize
                          ${b.status === "confirmed"
                            ? "text-green-400 bg-green-400/10 border-green-400/20"
                            : "text-red-400 bg-red-400/10 border-red-400/20"
                          }
                        `}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {b.status === "confirmed" && (
                          <button
                            onClick={() => updateBookingStatus(b.id, "cancelled")}
                            className="text-xs text-red-400/70 hover:text-red-400 font-body transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {bookings.length === 0 && !loadingData && (
                <div className="text-center py-16">
                  <p className="text-muted font-body text-sm">No bookings yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Services Tab ── */}
        {activeTab === "services" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="font-display text-2xl text-white">Services</p>
              <button
                onClick={openCreate}
                className="bg-gold hover:bg-gold/90 text-dark-base font-body font-medium text-sm px-5 py-2.5 rounded-xl transition-colors"
              >
                + Add Service
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((s) => (
                <div key={s.id} className="bg-dark-surface border border-white/10 rounded-2xl overflow-hidden">
                  {s.image_url && (
                    <div className="relative h-36 overflow-hidden">
                      <img
                        src={s.image_url}
                        alt={s.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-surface/60 to-transparent" />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-display text-lg text-white leading-snug">{s.name}</h3>
                      <span className={`
                        text-xs font-body px-2 py-0.5 rounded-full border shrink-0
                        ${s.is_active
                          ? "text-green-400 bg-green-400/10 border-green-400/20"
                          : "text-red-400 bg-red-400/10 border-red-400/20"
                        }
                      `}>
                        {s.is_active ? "Active" : "Hidden"}
                      </span>
                    </div>
                    <p className="text-muted text-xs font-body mb-3">{s.category} · {s.duration_minutes} min</p>
                    <p className="font-display text-xl text-gold mb-4">
                      ₹{Number(s.price).toLocaleString("en-IN")}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(s)}
                        className="flex-1 text-xs font-body border border-white/10 hover:border-gold/30 text-white hover:text-gold py-2 rounded-xl transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleActive(s)}
                        className="flex-1 text-xs font-body border border-white/10 hover:border-white/30 text-muted hover:text-white py-2 rounded-xl transition-colors"
                      >
                        {s.is_active ? "Hide" : "Show"}
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="text-xs font-body border border-red-400/10 hover:border-red-400/30 text-red-400/50 hover:text-red-400 px-3 py-2 rounded-xl transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── Service Form Modal ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center px-4 py-6 overflow-y-auto">
          <div className="bg-dark-surface border border-white/10 rounded-2xl w-full max-w-lg modal-scroll overflow-y-auto max-h-[90vh]">

            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <p className="font-display text-xl text-white">
                {editingId ? "Edit Service" : "Add New Service"}
              </p>
              <button
                onClick={() => setShowForm(false)}
                className="text-muted hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-6 space-y-4">

              {/* Name */}
              <div>
                <label className="block text-xs text-muted font-body uppercase tracking-wider mb-2">
                  Service Name *
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  placeholder="e.g. Signature Gold Facial"
                  className="w-full bg-dark-card border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm placeholder:text-white/20 focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs text-muted font-body uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  rows={3}
                  placeholder="Describe the service..."
                  className="w-full bg-dark-card border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm placeholder:text-white/20 focus:outline-none focus:border-gold transition-colors resize-none"
                />
              </div>

              {/* Category — custom dropdown */}
              <div ref={categoryRef} className="relative">
                <label className="block text-xs text-muted font-body uppercase tracking-wider mb-2">
                  Category
                </label>
                <button
                  type="button"
                  onClick={() => setCategoryOpen((o) => !o)}
                  className="w-full bg-dark-card border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm focus:outline-none focus:border-gold transition-colors flex items-center justify-between"
                >
                  <span>{form.category}</span>
                  <span className={`text-muted text-xs transition-transform duration-200 ${categoryOpen ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </button>

                {categoryOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-dark-card border border-white/10 rounded-xl overflow-hidden z-20 shadow-xl shadow-black/40">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setForm((prev) => ({ ...prev, category: cat }));
                          setCategoryOpen(false);
                        }}
                        className={`
                          w-full text-left px-4 py-3 text-sm font-body transition-colors
                          ${form.category === cat
                            ? "bg-gold text-dark-base font-medium"
                            : "text-white hover:bg-white/5"
                          }
                        `}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price + Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-muted font-body uppercase tracking-wider mb-2">
                    Price (₹) *
                  </label>
                  <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleFormChange}
                    placeholder="3500"
                    className="w-full bg-dark-card border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm placeholder:text-white/20 focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted font-body uppercase tracking-wider mb-2">
                    Duration (mins) *
                  </label>
                  <input
                    name="duration_minutes"
                    type="number"
                    value={form.duration_minutes}
                    onChange={handleFormChange}
                    placeholder="60"
                    className="w-full bg-dark-card border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm placeholder:text-white/20 focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs text-muted font-body uppercase tracking-wider mb-2">
                  Image URL
                </label>
                <input
                  name="image_url"
                  value={form.image_url}
                  onChange={handleFormChange}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-dark-card border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm placeholder:text-white/20 focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              {/* Active toggle */}
              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  name="is_active"
                  id="is_active"
                  checked={form.is_active}
                  onChange={handleFormChange}
                  className="w-4 h-4 accent-gold"
                />
                <label htmlFor="is_active" className="text-sm text-white font-body">
                  Visible to customers
                </label>
              </div>

              {formError && (
                <p className="text-red-400 text-sm font-body">{formError}</p>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-gold hover:bg-gold/90 disabled:opacity-50 text-dark-base font-body font-medium text-sm py-3 rounded-xl transition-colors"
                >
                  {saving ? "Saving..." : editingId ? "Save Changes" : "Create Service"}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 border border-white/10 hover:border-white/30 text-white font-body text-sm py-3 rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}