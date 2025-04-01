'use client'

import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  color: string
  vx: number
  vy: number
  opacity: number
}

export function ChatbotWelcomeAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number>(0)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  // Create particles
  const createParticles = (width: number, height: number) => {
    const particles: Particle[] = []
    const particleCount = Math.floor((width * height) / 10000)
    const baseColor = isDark ? '130, 150, 255' : '70, 100, 230'
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 1,
        color: `rgba(${baseColor}, ${Math.random() * 0.5 + 0.2})`,
        vx: Math.random() * 0.5 - 0.25,
        vy: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.5 + 0.3
      })
    }
    
    return particles
  }

  // Update dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        setDimensions({ width, height })
        particlesRef.current = createParticles(width, height)
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    
    return () => {
      window.removeEventListener('resize', updateDimensions)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [isDark]) //eslint-disable-line react-hooks/exhaustive-deps

  // Mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Animation loop
  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = dimensions.width
    canvas.height = dimensions.height

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw connection lines between nearby particles
      ctx.strokeStyle = isDark ? 'rgba(130, 150, 255, 0.05)' : 'rgba(70, 100, 230, 0.05)'
      ctx.lineWidth = 0.5

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p1 = particlesRef.current[i]
        
        // Mouse influence - particles gently move away from cursor
        const dx = mousePosition.x - p1.x
        const dy = mousePosition.y - p1.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = 150
        
        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance
          p1.vx -= (dx / distance) * force * 0.02
          p1.vy -= (dy / distance) * force * 0.02
        }
        
        // Update position
        p1.x += p1.vx
        p1.y += p1.vy
        
        // Boundary check with bounce
        if (p1.x < 0 || p1.x > canvas.width) p1.vx *= -1
        if (p1.y < 0 || p1.y > canvas.height) p1.vy *= -1
        
        // Slow down (friction)
        p1.vx *= 0.99
        p1.vy *= 0.99
        
        // Add slight random movement
        p1.vx += (Math.random() - 0.5) * 0.02
        p1.vy += (Math.random() - 0.5) * 0.02
        
        // Draw the particle
        ctx.beginPath()
        ctx.arc(p1.x, p1.y, p1.size, 0, Math.PI * 2)
        ctx.fillStyle = p1.color
        ctx.fill()
        
        // Connect particles that are close to each other
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p2 = particlesRef.current[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            const opacity = (100 - distance) / 100 * 0.2
            ctx.strokeStyle = isDark 
              ? `rgba(130, 150, 255, ${opacity})` 
              : `rgba(70, 100, 230, ${opacity})`
            ctx.stroke()
          }
        }
      }
      
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [dimensions, mousePosition, isDark])

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative w-full h-full"
      >
        <canvas ref={canvasRef} className="absolute inset-0" />
      </motion.div>
    </div>
  )
} 