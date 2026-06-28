import { Router } from "express";
import { supabase } from "../lib/supabase.js";

const router = Router();

// GET all active services
router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("created_at");

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET single service
router.get("/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("id", req.params.id)
    .single();

  if (error) return res.status(404).json({ error: "Service not found" });
  res.json(data);
});

export default router;