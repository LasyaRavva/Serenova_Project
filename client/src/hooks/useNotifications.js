import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export function useNotifications() {
  const { user }                          = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const channelRef                        = useRef(null);

  async function fetchNotifications(userId) {
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);

    setNotifications(data || []);
    setUnreadCount((data || []).filter((n) => !n.is_read).length);
  }

  useEffect(() => {
    if (!user?.id) return;

    let isActive = true;
    const channelTopic = `notifications:${user.id}`;

    async function setupNotifications() {
      const existingChannels = supabase
        .getChannels()
        .filter((channel) => channel.topic === channelTopic);

      await Promise.all(existingChannels.map((channel) => supabase.removeChannel(channel)));

      if (!isActive) return;

      fetchNotifications(user.id);

      const channel = supabase
        .channel(channelTopic)
        .on(
          "postgres_changes",
          {
            event:  "INSERT",
            schema: "public",
            table:  "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            if (!isActive) return;
            setNotifications((prev) => [payload.new, ...prev]);
            setUnreadCount((c) => c + 1);
          }
        )
        .subscribe();

      channelRef.current = channel;
    }

    setupNotifications();

    return () => {
      isActive = false;

      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [user?.id]);

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