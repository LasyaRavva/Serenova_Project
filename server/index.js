import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import servicesRouter from "./routes/services.js";
import bookingsRouter from "./routes/bookings.js";
import paymentsRouter from "./routes/payments.js";
import { startReminderJob } from "./jobs/reminders.js";

const app = express();
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      "https://serenova-project.vercel.app",
      "http://localhost:5173",
    ];
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    // Strip trailing slash for comparison
    if (allowed.includes(origin.replace(/\/$/, ""))) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

// Webhook route MUST come before express.json()
app.use(
  "/api/payments/webhook",
  express.raw({ type: "application/json" })
);

app.use(express.json());

app.use("/api/services",  servicesRouter);
app.use("/api/bookings",  bookingsRouter);
app.use("/api/payments",  paymentsRouter);

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "Serenova API" });
});

startReminderJob();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serenova API running on ${PORT}`));