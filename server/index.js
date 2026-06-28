import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import servicesRouter from "./routes/services.js";
import bookingsRouter from "./routes/bookings.js";
import paymentsRouter from "./routes/payments.js";
import { startReminderJob } from "./jobs/reminders.js";
startReminderJob();

// Webhook route BEFORE json middleware
app.use("/api/payments/webhook",
  express.raw({ type: "application/json" }),
  (req, res, next) => { next(); }
);

app.use(express.json());
app.use("/api/payments", paymentsRouter);


dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use("/api/services",  servicesRouter);
app.use("/api/bookings",  bookingsRouter);

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "Serenova API" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serenova API running on ${PORT}`));