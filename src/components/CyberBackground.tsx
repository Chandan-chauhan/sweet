"use client"

import { useEffect, useState } from "react"

type Particle = {
  id: number
  left: number
  duration: number
  delay: number
  size: number
}

export default function CyberBackground() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = []
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i,
          left: Math.random() * 100,
          duration: 20 + Math.random() * 15,
          delay: Math.random() * 10,
          size: 2 + Math.random() * 4,
        })
      }
      setParticles(newParticles)
    }

    generateParticles()
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      <div className="absolute inset-0 grid-background animate-grid-pulse" />
      
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-transparent to-cyan-800/5" />
      
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-400/5 rounded-full blur-3xl" />
      
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-float-particle bg-cyan-400 rounded-full"
          style={{
            left: `${particle.left}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            bottom: '-20px',
            boxShadow: '0 0 10px rgba(6, 182, 212, 0.6)',
          }}
        />
      ))}
      
      <div className="noise-overlay" />
    </div>
  )
}
