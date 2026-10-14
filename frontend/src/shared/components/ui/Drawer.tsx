import { useLayoutEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type AnimationPlaybackControls,
} from 'framer-motion'
import { cn } from '@/shared/lib/utils'
import { project, releaseVelocity, rubberband, spring } from '@/shared/lib/motion'

interface DrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Accessible name announced when the drawer opens */
  title: string
  children: ReactNode
  className?: string
}

/** Movement (px) before a press commits to being a drag. */
const DRAG_THRESHOLD = 10

type Gesture = {
  id: number
  startX: number
  startY: number
  origin: number
  dragging: boolean
  samples: { x: number; t: number }[]
}

/**
 * `Drawer` – Leading-edge panel that follows the finger 1:1, rubber-bands past
 * its open position, and settles wherever the release velocity projects it.
 * It can be caught and thrown back at any point mid-animation.
 */
export function Drawer({ open, onOpenChange, title, children, className }: DrawerProps) {
  const reduceMotion = useReducedMotion()
  const [mounted, setMounted] = useState(open)
  if (open && !mounted) setMounted(true)

  const panelRef = useRef<HTMLDivElement>(null)
  const width = useRef(320)
  const x = useMotionValue(-10_000)
  const fade = useMotionValue(reduceMotion ? 0 : 1)
  const scrimOpacity = useTransform([x, fade], ([xv, f]: number[]) =>
    Math.min(1, Math.max(0, 1 + xv / width.current)) * f
  )

  const animation = useRef<AnimationPlaybackControls | null>(null)
  const handoffVelocity = useRef<number | null>(null)
  const gesture = useRef<Gesture | null>(null)
  const suppressClick = useRef(false)

  const settle = (target: 'open' | 'closed', velocity?: number) => {
    animation.current?.stop()
    const to = target === 'open' ? 0 : -width.current
    const onComplete = target === 'closed' ? () => setMounted(false) : undefined

    if (reduceMotion) {
      if (target === 'open') x.set(0)
      animation.current = animate(fade, target === 'open' ? 1 : 0, { duration: 0.2, ease: 'easeOut', onComplete })
      return
    }

    animation.current = animate(x, to, {
      ...(velocity === undefined ? { ...spring.default, visualDuration: 0.35 } : spring.momentum),
      velocity: velocity ?? x.getVelocity(),
      onComplete,
    })
  }

  useLayoutEffect(() => {
    if (!mounted) return
    if (panelRef.current) width.current = panelRef.current.offsetWidth
    if (open && x.get() < -width.current) x.set(-width.current)
    const velocity = handoffVelocity.current ?? undefined
    handoffVelocity.current = null
    settle(open ? 'open' : 'closed', velocity)
  }, [open, mounted])

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    animation.current?.stop()
    suppressClick.current = false
    gesture.current = {
      id: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      origin: x.get(),
      dragging: false,
      samples: [{ x: e.clientX, t: e.timeStamp }],
    }
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const g = gesture.current
    if (!g || g.id !== e.pointerId) return

    if (!g.dragging) {
      const dx = e.clientX - g.startX
      const dy = e.clientY - g.startY
      if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return
      if (Math.abs(dy) > Math.abs(dx)) {
        // Vertical intent: hand the gesture to native scrolling.
        gesture.current = null
        settle(open ? 'open' : 'closed')
        return
      }
      g.dragging = true
      g.startX = e.clientX
      g.origin = x.get()
      suppressClick.current = true
      e.currentTarget.setPointerCapture(e.pointerId)
    }

    const raw = g.origin + (e.clientX - g.startX)
    x.set(raw > 0 ? rubberband(raw, width.current) : Math.max(raw, -width.current))
    g.samples.push({ x: e.clientX, t: e.timeStamp })
    if (g.samples.length > 8) g.samples.shift()
  }

  const onPointerEnd = (e: PointerEvent<HTMLDivElement>) => {
    const g = gesture.current
    if (!g || g.id !== e.pointerId) return
    gesture.current = null

    if (!g.dragging) {
      settle(open ? 'open' : 'closed')
      return
    }

    const velocity = releaseVelocity(g.samples)
    const shouldOpen = x.get() + project(velocity) > -width.current / 2
    if (shouldOpen === open) {
      settle(open ? 'open' : 'closed', velocity)
    } else {
      handoffVelocity.current = velocity
      onOpenChange(shouldOpen)
    }
  }

  if (!mounted) return null

  return (
    <DialogPrimitive.Root open onOpenChange={(next) => { if (!next) onOpenChange(false) }}>
      <DialogPrimitive.Portal forceMount>
        <DialogPrimitive.Overlay forceMount asChild>
          <motion.div className="fixed inset-0 z-50 bg-scrim" style={{ opacity: scrimOpacity }} />
        </DialogPrimitive.Overlay>

        <DialogPrimitive.Content forceMount asChild aria-describedby={undefined}>
          <motion.div
            ref={panelRef}
            style={{ x, opacity: fade }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onPointerCancel={onPointerEnd}
            onClickCapture={(e) => {
              if (!suppressClick.current) return
              suppressClick.current = false
              e.preventDefault()
              e.stopPropagation()
            }}
            className={cn(
              'fixed inset-y-0 start-0 z-50 flex w-[min(18rem,85vw)] flex-col outline-none',
              'material-sidebar shadow-modal touch-pan-y select-none',
              // Covers the gap a momentum overshoot would otherwise reveal at the screen edge.
              'before:absolute before:inset-y-0 before:end-full before:w-24 before:bg-inherit',
              className
            )}
          >
            <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
            {children}
          </motion.div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
