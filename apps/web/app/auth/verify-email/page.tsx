"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { Button } from '@/components/ui/button'

function VerifyContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<{ type: 'loading' | 'error' | 'success', message: string }>({
    type: 'loading',
    message: 'Verifying your email please wait...'
  })

  useEffect(() => {
    if (!token) {
      setStatus({ type: 'error', message: 'No verification token provided.' })
      return
    }

    const verify = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/verify-email?token=${token}`)
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Verification failed')
        setStatus({ type: 'success', message: 'Your email has been verified successfully!' })
      } catch (err: any) {
        setStatus({ type: 'error', message: err.message })
      }
    }

    verify()
  }, [token])

  return (
      <div className="flex flex-col items-center gap-6 text-center">
         <p className="text-muted-foreground">{status.message}</p>
         {status.type !== 'loading' && (
           <Button asChild>
             <Link href="/auth/login">Proceed to Login</Link>
           </Button>
         )}
      </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Email Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Verifying...</div>}>
                <VerifyContent />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
