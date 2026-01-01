"use client"

import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "./client"
import type { Profile, Activity } from "@/lib/types/database"

export function useRealtimeActivities(userId: string) {
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()

    // Load initial activities
    const loadActivities = async () => {
      const { data } = await supabase
        .from("activities")
        .select("*, profiles!activities_user_id_fkey(username, display_name)")
        .order("created_at", { ascending: false })
        .limit(20)

      if (data) {
        setActivities(data as any)
      }
    }

    loadActivities()

    // Subscribe to new activities
    const channel = supabase
      .channel("activities")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "activities" }, (payload) => {
        setActivities((prev) => [payload.new as Activity, ...prev.slice(0, 19)])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  return activities
}

export function useRealtimeProfile(userId: string) {
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()

    // Load initial profile
    const loadProfile = async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (data) {
        setProfile(data)
      }
    }

    loadProfile()

    // Subscribe to profile updates
    const channel = supabase
      .channel(`profile:${userId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${userId}` },
        (payload) => {
          setProfile(payload.new as Profile)
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  return profile
}
