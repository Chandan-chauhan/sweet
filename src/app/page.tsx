"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import CyberBackground from "@/components/CyberBackground"
import { Sparkles, ShoppingBag, ChevronRight, Package } from "lucide-react"

type Sweet = {
  id: string
  name: string
  description: string
  price: string
  category: string
  image_url: string
  stock: number
}

const getProductImage = (name: string, category: string): string => {
  const productName = name.toLowerCase().trim()
  
  if (productName.includes("cheese cake") || productName.includes("cheesecake")) {
    return "https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=800&q=80"
  }
  
  if (productName.includes("chocolate cake")) {
    return "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80"
  }
  
  if (productName.includes("gummy bear")) {
    return "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=800&q=80"
  }
  
  if (productName.includes("red velvet")) {
    return "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=800&q=80"
  }
  
  if (productName.includes("strawberry cupcake")) {
    return "https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=800&q=80"
  }
  
  if (productName.includes("vanilla cupcake")) {
    return "https://images.unsplash.com/photo-1426869884541-df7117556757?w=800&q=80"
  }
  
  if (productName.includes("dark chocolate") || productName.includes("truffle")) {
    return "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=800&q=80"
  }
  
  if (productName.includes("milk chocolate bar")) {
    return "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800&q=80"
  }
  
  if (productName.includes("rainbow") || productName.includes("candies")) {
    return "https://images.unsplash.com/photo-1559600630-08c018864142?w=800&q=80"
  }
  
  if (category === "chocolate") {
    return "https://images.unsplash.com/photo-1511381939415-e44015466834?w=800&q=80"
  }
  
  if (category === "cake") {
    return "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80"
  }
  
  if (category === "cupcake") {
    return "https://images.unsplash.com/photo-1587668178277-295251f900ce?w=800&q=80"
  }
  
  if (category === "candy") {
    return "https://images.unsplash.com/photo-1499195333224-3ce974eecb47?w=800&q=80"
  }
  
  return "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80"
}

export default function HomePage() {
  const [sweets, setSweets] = useState<Sweet[]>([])
  const [chocolates, setChocolates] = useState<Sweet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/sweets")
        const data = await res.json()
        
        const sweetsData = data.filter((s: Sweet) => s.category !== "chocolate").map((s: Sweet) => ({
          ...s,
          image_url: getProductImage(s.name, s.category)
        }))
        
        const chocolatesData = data.filter((s: Sweet) => s.category === "chocolate").map((s: Sweet) => ({
          ...s,
          image_url: getProductImage(s.name, s.category)
        }))
        
        setSweets(sweetsData)
        setChocolates(chocolatesData)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="min-h-screen bg-[#030712] relative overflow-hidden">
      <CyberBackground />
      
      <nav className="glass-card sticky top-0 z-50 border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center animate-glow">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <span className="text-2xl font-bold gradient-text">Sweet Shop</span>
          </Link>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="outline" className="border-cyan-500/30 bg-transparent text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-300">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="cyber-button text-black font-semibold">
                Get Started
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 text-sm font-medium">Premium Quality</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            <span className="text-slate-100">Discover </span>
            <span className="gradient-text">Premium</span>
            <br />
            <span className="text-slate-100">Confections</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Handcrafted sweets and artisan chocolates, curated for the finest taste experience
          </p>
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
            <section className="mb-20">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-cyan-600/20 border border-cyan-500/30 flex items-center justify-center">
                    <span className="text-2xl">&#127852;</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-100">Sweets Collection</h2>
                    <p className="text-slate-500">Handpicked delicacies</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sweets.map((sweet) => (
                  <div key={sweet.id} className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 rounded-2xl overflow-hidden group transition-all duration-500 hover:scale-[1.02] hover:border-cyan-500/30">
                    <div className="relative w-full h-52 bg-gradient-to-br from-slate-800/50 to-slate-900/50 overflow-hidden">
                      <Image 
                        src={sweet.image_url} 
                        alt={sweet.name}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-60" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-100 mb-2">{sweet.name}</h3>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">{sweet.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold gradient-text">₹{sweet.price}</span>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                          <Package className="w-3 h-3 text-cyan-400" />
                          <span className="text-xs text-cyan-400">{sweet.stock} left</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {sweets.length === 0 && (
                <div className="text-center py-16 glass-card rounded-2xl">
                  <Package className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-400">No sweets available at the moment</p>
                </div>
              )}
            </section>

            <section className="mb-20">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-500/30 flex items-center justify-center">
                    <span className="text-2xl">&#127851;</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-100">Chocolate Collection</h2>
                    <p className="text-slate-500">Artisan crafted chocolates</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {chocolates.map((chocolate) => (
                  <div key={chocolate.id} className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 rounded-2xl overflow-hidden group transition-all duration-500 hover:scale-[1.02] hover:border-amber-500/30">
                    <div className="relative w-full h-52 bg-gradient-to-br from-amber-900/30 to-slate-900/50 overflow-hidden">
                      <Image 
                        src={chocolate.image_url} 
                        alt={chocolate.name}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-60" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-100 mb-2">{chocolate.name}</h3>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">{chocolate.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-amber-400">₹{chocolate.price}</span>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                          <Package className="w-3 h-3 text-amber-400" />
                          <span className="text-xs text-amber-400">{chocolate.stock} left</span>
                        </div>
                      </div>
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

        <div className="glass-card rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold text-slate-100 mb-4">Ready to Indulge?</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Create an account to start shopping and enjoy exclusive member benefits
          </p>
          <Link href="/register">
            <Button size="lg" className="cyber-button text-black font-semibold text-lg px-8 py-6">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Start Shopping
            </Button>
          </Link>
        </div>

        <footer className="mt-20 pt-8 border-t border-cyan-500/10 text-center">
          <p className="text-slate-500 text-sm">
            Crafted by <span className="text-cyan-400 font-medium">Chandan</span>
          </p>
        </footer>
      </main>
    </div>
  )
}