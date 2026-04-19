"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, Suspense } from "react"

function ResetPasswordForm() {
  const [password, setPassword] = useState("")
  const [status, setStatus] = useState<{ type: 'error' | 'success', message: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setStatus(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "An error occurred")
      setStatus({ type: 'success', message: data.message })
    } catch (error: unknown) {
      setStatus({ type: 'error', message: error instanceof Error ? error.message : "An error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) return <div className="text-center">Invalid or missing reset token.</div>

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {status && (
          <p className={`text-sm ${status.type === 'error' ? 'text-destructive' : 'text-green-600'}`}>
            {status.message}
          </p>
        )}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Resetting..." : "Reset Password"}
        </Button>
      </div>
      <div className="mt-4 text-center text-sm">
        <Link href="/auth/login" className="underline underline-offset-4 hover:text-primary">
          Back to Login
        </Link>
      </div>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">F</span>
            </div>
            <span className="text-2xl font-bold">Focus Flow</span>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Reset Password</CardTitle>
              <CardDescription>Enter your new password.</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading form...</div>}>
                 <ResetPasswordForm />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
