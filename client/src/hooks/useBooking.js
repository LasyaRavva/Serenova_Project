import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { format } from "date-fns";
import { apiFetch } from "../lib/api";

export function useBooking(serviceId) {
  const { user } = useAuth();
  const [service, setService]         = useState(null);
  const [slots, setSlots]             = useState([]);
  const [bookedTimes, setBookedTimes] = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    async function fetchService() {
      const { data } = await supabase
        .from("services")
        .select("*")
        .eq("id", serviceId)
        .single();
      setService(data);
      setLoading(false);
    }
    if (serviceId) fetchService();
  }, [serviceId]);

  async function fetchSlotsForDate(date) {
    const dayOfWeek = date.getDay();
    const dateStr   = format(date, "yyyy-MM-dd");

    const [{ data: availSlots }, { data: existingBookings }] =
      await Promise.all([
        supabase
          .from("availability_slots")
          .select("*")
          .eq("day_of_week", dayOfWeek)
          .order("start_time"),
        supabase
          .from("bookings")
          .select("start_time")
          .eq("booking_date", dateStr)
          .eq("service_id", serviceId)
          .neq("status", "cancelled"),
      ]);

    const bookedSet = new Set(
      (existingBookings || []).map((b) => b.start_time)
    );

    setSlots(availSlots || []);
    setBookedTimes(bookedSet);
  }

  async function createBooking({ userId, date, slot, notes }) {
    const dateStr = format(date, "yyyy-MM-dd");

    const { data, error } = await supabase
      .from("bookings")
      .insert({
        user_id:      userId,
        service_id:   serviceId,
        booking_date: dateStr,
        start_time:   slot.start_time,
        end_time:     slot.end_time,
        status:       "confirmed",
        notes,
      })
      .select()
      .single();

    if (error) throw error;

    // In-app notification
    await supabase.from("notifications").insert({
      user_id: userId,
      message: `Your booking for ${service?.name} on ${format(date, "dd MMM yyyy")} at ${slot.start_time.slice(0, 5)} is confirmed.`,
      type:    "booking_confirmed",
    });

    // Send confirmation email via Express backend
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        await apiFetch(
          "/api/bookings/send-confirmation",
          {
            method: "POST",
            body: JSON.stringify({
              bookingId: data.id,
              serviceId,
              date:      dateStr,
              startTime: slot.start_time,
            }),
          },
          session.access_token
        );
      }
    } catch (emailErr) {
      // Don't fail booking if email fails
      console.error("Email error:", emailErr);
    }

    return data;
  }

  return { service, slots, bookedTimes, loading, fetchSlotsForDate, createBooking };
}