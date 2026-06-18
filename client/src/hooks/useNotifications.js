import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export function useNotifications() {
  const { user }                          = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const prevCountRef                      = useRef(0);
  const intervalRef                       = useRef(null);

  useEffect(() => {
    if (!user) return;

    // Fetch immediately on mount
    fetchNotifications();

    // Poll every 5 seconds for new notifications
    intervalRef.current = setInterval(fetchNotifications, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [user?.id]);

  async function fetchNotifications() {
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (!data) return;

    setNotifications(data);

    const unread = data.filter((n) => !n.is_read).length;
    setUnreadCount(unread);
  }

  async function markAllRead() {
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  }

  return { notifications, unreadCount, markAllRead };
}