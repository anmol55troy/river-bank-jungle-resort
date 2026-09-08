'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const LEAVES = [
  '/textures/leaf-patches/sprig-1.png',
  '/textures/leaf-patches/sprig-2.png',
  '/textures/leaf-patches/sprig-3.png',
  '/textures/leaf-patches/sprig-4.png',
  '/textures/leaf-patches/sprig-curved.png',
  '/textures/leaf-patches/sprig-upright.png',
]

export function FloatingLeaves() {
  const [patches, setPatches] = useState<Array<{ id: number; src: string; top: number; side: 'left' | 'right'; size: number; rotation: number; opacity: number }>>([])
  const pathname = usePathname()

  useEffect(() => {
    // Generate scattered leaf patches based on document height
    const height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, 3000)
    // One patch roughly every 700px
    const numPatches = Math.max(4, Math.floor(height / 700))
    
    interface LeafPatch {
      id: number
      src: string
      top: number
      side: 'left' | 'right'
      size: number
      rotation: number
      opacity: number
    }
    const newPatches: LeafPatch[] = []
    for (let i = 0; i < numPatches; i++) {
      const src = LEAVES[Math.floor(Math.random() * LEAVES.length)]
      const top = (i * 700) + Math.random() * 400 + 100 // Stagger vertically
      const side: 'left' | 'right' = Math.random() > 0.5 ? 'left' : 'right'
      const size = Math.random() * 100 + 180 // 180px to 280px
      // Angles: left points rightwards, right points leftwards
      const rotation = side === 'left' ? Math.random() * 60 - 30 : Math.random() * 60 - 30 + 180
      const opacity = Math.random() * 0.15 + 0.15 // 0.15 to 0.3
      
      newPatches.push({ id: i, src, top, side, size, rotation, opacity })
    }
    setPatches(newPatches)
  }, [pathname])

  if (patches.length === 0) return null

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 bottom-0 z-40 overflow-hidden mix-blend-multiply" aria-hidden="true">
      {patches.map((patch) => (
        <div
          key={patch.id}
          className="absolute transition-opacity duration-1000"
          style={{
            top: `${patch.top}px`,
            [patch.side]: `-${patch.size / 3}px`,
            width: `${patch.size}px`,
            height: `${patch.size}px`,
            opacity: patch.opacity,
            transform: `rotate(${patch.rotation}deg)`,
          }}
        >
          <img src={patch.src} alt="" className="h-full w-full object-contain" aria-hidden="true" />
        </div>
      ))}
    </div>
  )
}
