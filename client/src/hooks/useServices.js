import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetch() {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: true });

      if (error) setError(error.message);
      else setServices(data);
      setLoading(false);
    }
    fetch();
  }, []);

  return { services, loading, error };
}