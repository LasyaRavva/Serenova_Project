import { useState } from "react";
import { supabase } from "../lib/supabase";

export function usePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  async function createPayment({ bookingId, amount, method }) {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        booking_id:     bookingId,
        amount,
        payment_method: method,
        status:         method === "mock_card" ? "paid" : "pending",
        paid_at:        method === "mock_card" ? new Date().toISOString() : null,
      };

      const { data, error } = await supabase
        .from("payments")
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function getPaymentForBooking(bookingId) {
    const { data } = await supabase
      .from("payments")
      .select("*")
      .eq("booking_id", bookingId)
      .maybeSingle();
    return data;
  }

  return { createPayment, getPaymentForBooking, loading, error };
}