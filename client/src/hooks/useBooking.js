import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { format } from "date-fns";

export function useBooking(serviceId) {
  const [service, setService]     = useState(null);
  const [slots, setSlots]         = useState([]);
  const [bookedTimes, setBookedTimes] = useState([]);
  const [loading, setLoading]     = useState(true);

  // Fetch service once
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

  // Fetch available slots + existing bookings for a given date
  async function fetchSlotsForDate(date) {
    const dayOfWeek = date.getDay(); // 0=Sun … 6=Sat
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

    // Insert confirmation notification
    await supabase.from("notifications").insert({
      user_id: userId,
      message: `Your booking for ${service?.name} on ${format(date, "dd MMM yyyy")} at ${slot.start_time.slice(0, 5)} is confirmed.`,
      type:    "booking_confirmed",
    });

    return data;
  }

  return { service, slots, bookedTimes, loading, fetchSlotsForDate, createBooking };
}