import express, { Router } from "express";
import Stripe from "stripe";
import { supabase } from "../lib/supabase.js";
import { authenticateUser } from "../middleware/auth.js";

const router  = Router();
const stripe  = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Stripe checkout session
router.post("/create-session", authenticateUser, async (req, res) => {
  const { bookingId, serviceId } = req.body;

  const { data: service } = await supabase
    .from("services")
    .select("name, price")
    .eq("id", serviceId)
    .single();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency:     "inr",
        unit_amount:  Math.round(service.price * 100),
        product_data: { name: service.name },
      },
      quantity: 1,
    }],
    mode:        "payment",
    success_url: `${process.env.CLIENT_URL}/dashboard?payment=success`,
    cancel_url:  `${process.env.CLIENT_URL}/dashboard?payment=cancelled`,
    metadata:    { bookingId, userId: req.user.id },
  });

  res.json({ url: session.url });
});

// Stripe webhook
router.post("/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  if (event.type === "checkout.session.completed") {
    const session   = event.data.object;
    const bookingId = session.metadata.bookingId;
    const userId    = session.metadata.userId;

    await supabase.from("payments").insert({
      booking_id:     bookingId,
      amount:         session.amount_total / 100,
      status:         "paid",
      payment_method: "stripe",
      paid_at:        new Date().toISOString(),
    });

    await supabase.from("notifications").insert({
      user_id: userId,
      message: `Payment of ₹${session.amount_total / 100} confirmed via Stripe.`,
      type:    "booking_confirmed",
    });
  }

  res.json({ received: true });
});

export default router;