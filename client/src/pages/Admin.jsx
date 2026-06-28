import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const { profile }             = useAuth();
  const navigate                = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats]       = useState(null);
  const [activeTab, setActiveTab] = useState("bookings");

  useEffect(() => {
    if (profile && profile.role !== "admin") navigate("/services");
  }, [profile]);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    const { data } = await supabase
      .from("bookings")
      .select(`*, services(*), profiles(full_name, phone)`)
      .order("booking_date", { ascending: false });

    setBookings(data || []);

    // Stats
    const confirmed = (data || []).filter((b) => b.status === "confirmed");
    const revenue   = confirmed.reduce((sum, b) => sum + Number(b.services?.price || 0), 0);

    setStats({
      total:     data?.length || 0,
      confirmed: confirmed.length,
      cancelled: (data || []).filter((b) => b.status === "cancelled").length,
      revenue,
    });
  }

  async function updateStatus(id, status) {
    await supabase.from("bookings").update({ status }).eq("id", id);
    fetchAll();
  }

  return (
    <div className="min-h-screen bg-dark-base px-6 py-12">
      <div className="max-w-6xl mx-auto">

        <div className="mb-10">
          <p className="text-gold text-xs font-body uppercase tracking-widest mb-2">Admin</p>
          <h1 className="font-display text-5xl text-white">Dashboard</h1>
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

        {/* Bookings table */}
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
                    <td className="px-6 py-4 text-sm text-muted font-body">{b.start_time?.slice(0,5)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full border font-body capitalize
                        ${b.status === "confirmed" ? "text-green-400 bg-green-400/10 border-green-400/20"
                          : "text-red-400 bg-red-400/10 border-red-400/20"}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {b.status === "confirmed" && (
                        <button
                          onClick={() => updateStatus(b.id, "cancelled")}
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
          </div>
        </div>

      </div>
    </div>
  );
}