import { Router } from "express";
import { supabase } from "../lib/supabase.js";
import { authenticateUser } from "../middleware/auth.js";
import { sendBookingConfirmation, sendCancellationEmail } from "../lib/mailer.js";

const router = Router();

// GET user's bookings
router.get("/my", authenticateUser, async (req, res) => {
  const { data, error } = await supabase
    .from("bookings")
    .select(`*, services(*)`)
    .eq("user_id", req.user.id)
    .order("booking_date", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET availability for a date
router.get("/availability", async (req, res) => {
  const { date, serviceId } = req.query;
  const dayOfWeek = new Date(date).getDay();

  const [{ data: slots }, { data: booked }] = await Promise.all([
    supabase
      .from("availability_slots")
      .select("*")
      .eq("day_of_week", dayOfWeek)
      .order("start_time"),
    supabase
      .from("bookings")
      .select("start_time")
      .eq("booking_date", date)
      .eq("service_id", serviceId)
      .neq("status", "cancelled"),
  ]);

  const bookedTimes = new Set((booked || []).map((b) => b.start_time));
  const available   = (slots || []).map((s) => ({
    ...s,
    is_available: !bookedTimes.has(s.start_time),
  }));

  res.json(available);
});

// POST create booking
router.post("/", authenticateUser, async (req, res) => {
  const { serviceId, date, startTime, endTime, notes } = req.body;

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      user_id:      req.user.id,
      service_id:   serviceId,
      booking_date: date,
      start_time:   startTime,
      end_time:     endTime,
      status:       "confirmed",
      notes,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  // Send confirmation email
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", req.user.id)
      .single();

    const { data: serviceData } = await supabase
      .from("services")
      .select("name")
      .eq("id", serviceId)
      .single();

    const { data: userAuth } = await supabase.auth.admin.getUserById(req.user.id);

    await sendBookingConfirmation({
      to:      userAuth.user.email,
      name:    profile.full_name,
      service: serviceData.name,
      date,
      time:    startTime,
    });
  } catch (emailErr) {
    console.error("Email error:", emailErr.message);
  }

  res.json(data);
});

// POST send confirmation email only (used when booking is created client-side)
router.post("/send-confirmation", authenticateUser, async (req, res) => {
  const { serviceId, date, startTime } = req.body;

  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", req.user.id)
      .single();

    const { data: serviceData } = await supabase
      .from("services")
      .select("name")
      .eq("id", serviceId)
      .single();

    const { data: userAuth } = await supabase.auth.admin.getUserById(req.user.id);

    await sendBookingConfirmation({
      to:      userAuth.user.email,
      name:    profile.full_name,
      service: serviceData.name,
      date,
      time:    startTime,
    });

    res.json({ sent: true });
  } catch (err) {
    console.error("Email failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// PATCH cancel booking
router.patch("/:id/cancel", authenticateUser, async (req, res) => {
  const { data: booking } = await supabase
    .from("bookings")
    .select(`*, services(name)`)
    .eq("id", req.params.id)
    .single();

  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", req.params.id)
    .eq("user_id", req.user.id);

  if (error) return res.status(500).json({ error: error.message });

  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", req.user.id)
      .single();

    const { data: userAuth } = await supabase.auth.admin.getUserById(req.user.id);

    await sendCancellationEmail({
      to:      userAuth.user.email,
      name:    profile.full_name,
      service: booking.services.name,
      date:    booking.booking_date,
    });
  } catch (emailErr) {
    console.error("Email error:", emailErr.message);
  }

  res.json({ success: true });
});

export default router;