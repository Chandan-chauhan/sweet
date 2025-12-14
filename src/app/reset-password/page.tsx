"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import CyberBackground from "@/components/CyberBackground"
import { Lock, ArrowRight, CheckCircle, Clock, Loader2, AlertTriangle } from "lucide-react"

function ResetPasswordContent() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const errorParam = searchParams.get("error")
    const errorDescription = searchParams.get("error_description")
    
    if (errorParam === "access_denied" || errorDescription) {
      if (errorDescription?.includes("expired") || errorDescription?.includes("invalid")) {
        setError("Password reset link has expired or is invalid. Please request a new one.")
      } else {
        setError(errorDescription || "An error occurred. Please try again.")
      }
    }
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setTimeout(() => router.push("/login"), 2000)
  }

  if (error && error.includes("expired")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712] p-4 relative overflow-hidden">
        <CyberBackground />
        <div className="w-full max-w-md relative z-10">
          <div className="glass-card rounded-3xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
              <Clock className="w-10 h-10 text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mb-3">Link Expired</h2>
            <p className="text-slate-400 mb-6">{error}</p>
            
            <div className="glass-card rounded-xl p-4 mb-6 text-left">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-amber-400 mb-2 text-sm">Tips:</p>
                  <ul className="text-slate-400 text-sm space-y-1">
                    <li>Reset links expire in 1 hour</li>
                    <li>Request a new reset link</li>
                    <li>Click the link immediately when received</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <Link href="/forgot-password">
              <Button className="w-full cyber-button text-black font-semibold mb-4">
                Request New Reset Link
              </Button>
            </Link>
            <Link href="/login" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712] p-4 relative overflow-hidden">
        <CyberBackground />
        <div className="w-full max-w-md relative z-10">
          <div className="glass-card rounded-3xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 mb-6">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold gradient-text mb-3">Password Updated!</h2>
            <p className="text-slate-400">Redirecting you to login...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] p-4 relative overflow-hidden">
      <CyberBackground />
      
      <div className="w-full max-w-md relative z-10">
        <div className="glass-card rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 mb-6 animate-glow">
              <Lock className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Reset Password</h1>
            <p className="text-slate-400">Enter your new password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300 text-sm font-medium">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a new password"
                  required
                  minLength={6}
                  className="pl-12 bg-slate-900/50 border-cyan-500/20 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 h-12 rounded-xl input-glow"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-300 text-sm font-medium">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  minLength={6}
                  className="pl-12 bg-slate-900/50 border-cyan-500/20 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 h-12 rounded-xl input-glow"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full cyber-button text-black font-semibold h-12 rounded-xl text-base"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Updating password...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Reset Password
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#030712] p-4 relative overflow-hidden">
        <CyberBackground />
        <div className="w-full max-w-md relative z-10">
          <div className="glass-card rounded-3xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6">
              <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-slate-100 mb-2">Reset Password</h1>
            <p className="text-slate-400">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}
