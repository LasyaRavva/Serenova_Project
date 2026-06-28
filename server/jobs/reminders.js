import cron from "node-cron";
import { supabase } from "../lib/supabase.js";
import { transporter } from "../lib/mailer.js";

// Runs every day at 9 AM
export function startReminderJob() {
  cron.schedule("0 9 * * *", async () => {
    console.log("Running reminder job...");

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];

    const { data: bookings } = await supabase
      .from("bookings")
      .select(`*, services(name), profiles(full_name)`)
      .eq("booking_date", dateStr)
      .eq("status", "confirmed");

    for (const booking of bookings || []) {
      // In-app notification
      await supabase.from("notifications").insert({
        user_id: booking.user_id,
        message: `Reminder: Your ${booking.services.name} appointment is tomorrow at ${booking.start_time.slice(0, 5)}.`,
        type:    "reminder",
      });
    }

    console.log(`Sent ${bookings?.length || 0} reminders`);
  });
}