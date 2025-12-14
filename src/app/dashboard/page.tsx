"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import CyberBackground from "@/components/CyberBackground"
import { Sparkles, LogOut, ShoppingCart, Package, User } from "lucide-react"

type Sweet = {
  id: string
  name: string
  description: string
  price: string
  category: string
  image_url: string
  stock: number
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [sweets, setSweets] = useState<Sweet[]>([])
  const [loading, setLoading] = useState(true)
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/login")
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setUser(profile)
      
      if (profile?.role === 'admin') {
        router.push("/admin")
        return
      }

      const res = await fetch("/api/sweets")
      if (res.ok) {
        const data = await res.json()
        setSweets(data)
      }
      setLoading(false)
    }
    
    init()
  }, [router])

  async function fetchProducts() {
    setLoading(true)
    const res = await fetch("/api/sweets")
    if (res.ok) {
      const data = await res.json()
      setSweets(data)
    }
    setLoading(false)
  }

  async function handlePurchase(sweetId: string) {
    setPurchaseLoading(sweetId)
    
    const res = await fetch(`/api/sweets/${sweetId}/purchase`, {
      method: "POST"
    })

    if (res.ok) {
      alert("Purchase successful!")
      fetchProducts()
    } else {
      const data = await res.json()
      alert(data.error || "Purchase failed")
    }
    
    setPurchaseLoading(null)
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const chocolates = sweets.filter(s => s.category === "chocolate")
  const otherSweets = sweets.filter(s => s.category !== "chocolate")

  return (
    <div className="min-h-screen bg-[#030712] relative overflow-hidden">
      <CyberBackground />
      
      <nav className="glass-card sticky top-0 z-50 border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center animate-glow">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <span className="text-2xl font-bold gradient-text">Sweet Shop</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-800/50 border border-cyan-500/20">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
                <User className="w-4 h-4 text-black" />
              </div>
              <span className="text-slate-300 text-sm font-medium">{user?.full_name || user?.email}</span>
            </div>
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="border-cyan-500/30 bg-transparent text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-slate-100">Your </span>
            <span className="gradient-text">Sweet Shop</span>
          </h1>
          <p className="text-xl text-slate-400">Browse and purchase your favorite treats</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 animate-pulse mb-4">
              <Package className="w-8 h-8 text-cyan-400" />
            </div>
            <p className="text-slate-400">Loading collection...</p>
          </div>
        ) : (
          <>
            <section className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-cyan-600/20 border border-cyan-500/30 flex items-center justify-center">
                  <span className="text-2xl">&#127852;</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-100">Sweets Collection</h2>
                  <p className="text-slate-500">Handpicked delicacies</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {otherSweets.map((sweet) => (
                  <div key={sweet.id} className="glass-card rounded-2xl overflow-hidden group transition-all duration-500 hover:scale-[1.02]">
                    <div className="relative w-full h-48 bg-gradient-to-br from-slate-800/50 to-slate-900/50 flex items-center justify-center overflow-hidden">
                      {sweet.image_url && !sweet.image_url.match(/[\u{1F300}-\u{1F9FF}]/u) ? (
                        <Image 
                          src={sweet.image_url} 
                          alt={sweet.name}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <span className="text-6xl">{sweet.image_url || "&#127852;"}</span>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-100 mb-2">{sweet.name}</h3>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">{sweet.description}</p>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold gradient-text">${sweet.price}</span>
                        <span className="text-xs text-slate-500 px-2 py-1 rounded-full bg-slate-800">Stock: {sweet.stock}</span>
                      </div>
                      <Button
                        onClick={() => handlePurchase(sweet.id)}
                        disabled={sweet.stock === 0 || purchaseLoading === sweet.id}
                        className="w-full cyber-button text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {purchaseLoading === sweet.id ? (
                          <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            Processing...
                          </span>
                        ) : sweet.stock === 0 ? (
                          "Out of Stock"
                        ) : (
                          <span className="flex items-center gap-2">
                            <ShoppingCart className="w-4 h-4" />
                            Purchase
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              {otherSweets.length === 0 && (
                <div className="text-center py-16 glass-card rounded-2xl">
                  <Package className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-400">No sweets available at the moment</p>
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-500/30 flex items-center justify-center">
                  <span className="text-2xl">&#127851;</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-100">Chocolate Collection</h2>
                  <p className="text-slate-500">Artisan crafted chocolates</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {chocolates.map((chocolate) => (
                  <div key={chocolate.id} className="glass-card rounded-2xl overflow-hidden group transition-all duration-500 hover:scale-[1.02]">
                    <div className="relative w-full h-48 bg-gradient-to-br from-amber-900/30 to-slate-900/50 flex items-center justify-center overflow-hidden">
                      {chocolate.image_url && !chocolate.image_url.match(/[\u{1F300}-\u{1F9FF}]/u) ? (
                        <Image 
                          src={chocolate.image_url} 
                          alt={chocolate.name}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <span className="text-6xl">{chocolate.image_url || "&#127851;"}</span>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-100 mb-2">{chocolate.name}</h3>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">{chocolate.description}</p>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold text-amber-400">${chocolate.price}</span>
                        <span className="text-xs text-slate-500 px-2 py-1 rounded-full bg-slate-800">Stock: {chocolate.stock}</span>
                      </div>
                      <Button
                        onClick={() => handlePurchase(chocolate.id)}
                        disabled={chocolate.stock === 0 || purchaseLoading === chocolate.id}
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold disabled:opacity-50"
                      >
                        {purchaseLoading === chocolate.id ? (
                          <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            Processing...
                          </span>
                        ) : chocolate.stock === 0 ? (
                          "Out of Stock"
                        ) : (
                          <span className="flex items-center gap-2">
                            <ShoppingCart className="w-4 h-4" />
                            Purchase
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              {chocolates.length === 0 && (
                <div className="text-center py-16 glass-card rounded-2xl">
                  <Package className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-400">No chocolates available at the moment</p>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  )
}
