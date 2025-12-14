"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import CyberBackground from "@/components/CyberBackground"
import { KeyRound, Mail, ArrowRight, CheckCircle, ArrowLeft, AlertTriangle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712] p-4 relative overflow-hidden">
        <CyberBackground />
        <div className="w-full max-w-md relative z-10">
          <div className="glass-card rounded-3xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6">
              <CheckCircle className="w-10 h-10 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold gradient-text mb-3">Check Your Email!</h2>
            <p className="text-slate-400 mb-2">We&apos;ve sent a password reset link to</p>
            <p className="text-cyan-400 font-medium mb-6">{email}</p>
            
            <div className="glass-card rounded-xl p-4 mb-6 text-left">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-amber-400 mb-2 text-sm">Important Notes:</p>
                  <ul className="text-slate-400 text-sm space-y-1">
                    <li>Check your spam/junk folder</li>
                    <li>Email may take a few minutes to arrive</li>
                    <li>Link expires in 24 hours</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <Link href="/login">
              <Button className="cyber-button text-black font-semibold px-8">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </Link>
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
              <KeyRound className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Forgot Password?</h1>
            <p className="text-slate-400">Enter your email to reset your password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300 text-sm font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
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
                  Sending...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Send Reset Link
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/login" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
