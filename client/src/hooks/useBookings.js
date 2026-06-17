import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export function useBookings() {
  const { user }                      = useAuth();
  const [bookings, setBookings]       = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchBookings();
  }, [user]);

  async function fetchBookings() {
    const { data } = await supabase
      .from("bookings")
      .select(`
        *,
        services (
          id, name, duration_minutes,
          price, image_url, category
        )
      `)
      .eq("user_id", user.id)
      .order("booking_date", { ascending: false });

    setBookings(data || []);
    setLoading(false);
  }

  async function cancelBooking(bookingId, serviceName, bookingDate) {
    await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", bookingId);

    await supabase.from("notifications").insert({
      user_id: user.id,
      message: `Your booking for ${serviceName} on ${bookingDate} has been cancelled.`,
      type:    "booking_cancelled",
    });

    // Update local state immediately
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, status: "cancelled" } : b
      )
    );
  }

  const upcoming  = bookings.filter((b) => b.status === "confirmed"  && b.booking_date >= today());
  const past      = bookings.filter((b) => b.status === "confirmed"  && b.booking_date <  today());
  const cancelled = bookings.filter((b) => b.status === "cancelled");

  return { bookings, upcoming, past, cancelled, loading, cancelBooking };
}

function today() {
  return new Date().toISOString().split("T")[0];
}