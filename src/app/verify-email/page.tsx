"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import CyberBackground from "@/components/CyberBackground"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

function VerifyEmailContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token")
      const type = searchParams.get("type")

      if (!token || type !== "email") {
        setStatus("error")
        setMessage("Invalid or missing verification token")
        return
      }

      try {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: "email"
        })

        if (error) {
          setStatus("error")
          setMessage(error.message || "Verification failed")
        } else {
          setStatus("success")
          setMessage("Email verified successfully!")
          setTimeout(() => router.push("/dashboard"), 2000)
        }
      } catch {
        setStatus("error")
        setMessage("An unexpected error occurred")
      }
    }

    verifyEmail()
  }, [searchParams, router, supabase.auth])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] p-4 relative overflow-hidden">
      <CyberBackground />
      <div className="w-full max-w-md relative z-10">
        <div className="glass-card rounded-3xl p-8 text-center">
          <div className="mb-6">
            {status === "loading" && (
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
              </div>
            )}
            {status === "success" && (
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
            )}
            {status === "error" && (
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30">
                <XCircle className="w-10 h-10 text-red-400" />
              </div>
            )}
          </div>

          <h1 className="text-2xl font-bold text-slate-100 mb-2">
            {status === "loading" && "Verifying Email..."}
            {status === "success" && "Email Verified!"}
            {status === "error" && "Verification Failed"}
          </h1>

          <p className="text-slate-400 mb-6">{message}</p>

          {status === "error" && (
            <div className="space-y-3">
              <Button
                onClick={() => router.push("/register")}
                className="w-full cyber-button text-black font-semibold"
              >
                Register Again
              </Button>
              <Link href="/login" className="block text-cyan-400 hover:text-cyan-300 text-sm transition-colors">
                Or go to login
              </Link>
            </div>
          )}

          {status === "success" && (
            <p className="text-sm text-slate-500">Redirecting to dashboard...</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#030712] p-4 relative overflow-hidden">
        <CyberBackground />
        <div className="w-full max-w-md relative z-10">
          <div className="glass-card rounded-3xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6">
              <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-slate-100 mb-2">Email Verification</h1>
            <p className="text-slate-400">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
