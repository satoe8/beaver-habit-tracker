import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import HabitDashboard from "@/components/habit-dashboard"

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return <HabitDashboard userId={user.id} />
}
