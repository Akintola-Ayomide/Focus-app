import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import DashboardClient from "@/components/dashboard-client"

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    redirect("/auth/login")
  }

  // We can fetch the user/profile here if needed, but for now we'll pass the token info
  // or let the client handle it if DashboardClient uses useAuth
  return <DashboardClient />
}
