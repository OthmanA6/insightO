import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useIsPresent } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { spring } from '@/shared/lib/motion'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ModalProps {
  /** Controls open/close state */
  open: boolean
  /** Called when backdrop, Escape, or the close button is used */
  onClose: () => void
  /** Header title. Omit it when composing with `Modal.Header` yourself. */
  title?: ReactNode
  /** Content rendered in the scrollable body */
  children: ReactNode
  /** Optional footer (action buttons, etc.) */
  footer?: ReactNode
  /** Extra classes on the panel */
  className?: string
  /**
   * Maximum width of the panel.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '7xl' | 'full'
}

// ─── Size map ────────────────────────────────────────────────────────────────

const sizeClasses: Record<NonNullable<ModalProps['size']>, string> = {
  sm:   'max-w-sm',
  md:   'max-w-lg',
  lg:   'max-w-2xl',
  xl:   'max-w-4xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full mx-4',
}

// ─── Shared state ────────────────────────────────────────────────────────────

/** Open modals, innermost last. Only the top one answers Escape and Tab. */
const modalStack: string[] = []

/** Where the last press landed, so a dialog can grow out of whatever opened it. */
let lastPress: { x: number; y: number; t: number } | null = null
if (typeof window !== 'undefined') {
  window.addEventListener(
    'pointerdown',
    (e) => { lastPress = { x: e.clientX, y: e.clientY, t: performance.now() } },
    { capture: true, passive: true }
  )
}

function originPoint() {
  if (lastPress && performance.now() - lastPress.t < 1000) return lastPress
  const el = document.activeElement
  if (el && el !== document.body) {
    const r = el.getBoundingClientRect()
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
  }
  return null
}

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

function trapFocus(e: KeyboardEvent, panel: HTMLElement) {
  const active = document.activeElement
  // Focus inside a portaled popover (select, menu) belongs to that layer.
  if (active && active !== document.body && !panel.contains(active)) return
  const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.getClientRects().length > 0
  )
  if (items.length === 0) {
    e.preventDefault()
    panel.focus()
    return
  }
  const first = items[0]
  const last = items[items.length - 1]
  if (e.shiftKey && (active === first || active === panel)) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && active === last) {
    e.preventDefault()
    first.focus()
  }
}

type Edges = { top: boolean; bottom: boolean }

interface ModalContextValue {
  onClose: () => void
  titleId: string
  /** Whether body content is scrolled out of view past each edge. */
  edges: Edges
  setEdges: (top: boolean, bottom: boolean) => void
}

const ModalContext = createContext<ModalContextValue | null>(null)

// ─── Sub-components ──────────────────────────────────────────────────────────

function CloseButton({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      aria-label="Close"
      onClick={onClick}
      className={cn(
        'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full touch-manipulation',
        'bg-fill text-content-muted hover:bg-fill-strong hover:text-content',
        'transition-[scale,background-color,color] duration-150 active:scale-90 active:duration-75',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25',
        className
      )}
    >
      <X className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
    </button>
  )
}

/** A hairline that only appears once content scrolls beneath it. */
function EdgeLine({ visible, side }: { visible: boolean; side: 'top' | 'bottom' }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-x-0 h-px bg-separator transition-opacity duration-200',
        side === 'top' ? 'top-0' : 'bottom-0',
        visible ? 'opacity-100' : 'opacity-0'
      )}
    />
  )
}

function ModalHeader({
  title,
  onClose,
  className,
}: {
  title: ReactNode
  onClose?: () => void
  className?: string
}) {
  const ctx = useContext(ModalContext)
  const close = onClose ?? ctx?.onClose
  const titleClasses = 'min-w-0 flex-1 text-[17px] font-semibold leading-snug tracking-[-0.022em] text-content'

  return (
    <div className={cn('relative flex shrink-0 items-start justify-between gap-4 px-6 pb-4 pt-5', className)}>
      {typeof title === 'string' ? (
        <h2 id={ctx?.titleId} className={titleClasses}>{title}</h2>
      ) : (
        <div id={ctx?.titleId} className={titleClasses}>{title}</div>
      )}
      {close && <CloseButton onClick={close} />}
      <EdgeLine side="bottom" visible={!!ctx?.edges.top} />
    </div>
  )
}

function ModalBody({ children, className }: { children: ReactNode; className?: string }) {
  const ctx = useContext(ModalContext)
  const ref = useRef<HTMLDivElement>(null)
  const setEdges = ctx?.setEdges

  const measure = useCallback(() => {
    const el = ref.current
    if (!el || !setEdges) return
    setEdges(el.scrollTop > 0, el.scrollTop + el.clientHeight < el.scrollHeight - 1)
  }, [setEdges])

  useLayoutEffect(measure)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [measure])

  return (
    <div
      ref={ref}
      onScroll={measure}
      className={cn('min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-6 pt-1', className)}
    >
      {children}
    </div>
  )
}

function ModalFooter({ children, className }: { children: ReactNode; className?: string }) {
  const ctx = useContext(ModalContext)
  return (
    <div className={cn('relative flex shrink-0 items-center justify-end gap-3 px-6 py-4', className)}>
      <EdgeLine side="top" visible={!!ctx?.edges.bottom} />
      {children}
    </div>
  )
}

const compoundParts: unknown[] = [ModalHeader, ModalBody, ModalFooter]

// ─── Root Component ──────────────────────────────────────────────────────────

/**
 * `Modal` – Portal-based dialog that materializes out of the control that
 * opened it and returns there on close.
 *
 * Pass `title`/`footer` for the standard layout, or compose `Modal.Header`,
 * `Modal.Body` and `Modal.Footer` as children for full control.
 *
 * @example
 * <Modal
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Confirm Action"
 *   footer={<Button variant="danger" onClick={handleDelete}>Delete</Button>}
 * >
 *   Are you sure you want to delete this item?
 * </Modal>
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  className,
  size = 'md',
}: ModalProps) {
  const id = useId()
  const titleId = `${id}-title`
  const panelRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  const [edges, setEdgeState] = useState<Edges>({ top: false, bottom: false })
  const setEdges = useCallback((top: boolean, bottom: boolean) => {
    setEdgeState((prev) => (prev.top === top && prev.bottom === bottom ? prev : { top, bottom }))
  }, [])

  useLayoutEffect(() => {
    if (!open) return
    const panel = panelRef.current
    const returnFocusTo = document.activeElement as HTMLElement | null

    if (panel) {
      const p = originPoint()
      if (p) panel.style.transformOrigin = `${p.x - panel.offsetLeft}px ${p.y - panel.offsetTop}px`
      if (!panel.contains(document.activeElement)) panel.focus({ preventScroll: true })
    }

    modalStack.push(id)
    if (modalStack.length === 1) document.body.style.overflow = 'hidden'

    const onKeyDown = (e: KeyboardEvent) => {
      if (modalStack[modalStack.length - 1] !== id || e.defaultPrevented) return
      if (e.key === 'Escape') {
        e.preventDefault()
        onCloseRef.current()
      } else if (e.key === 'Tab' && panelRef.current) {
        trapFocus(e, panelRef.current)
      }
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      modalStack.splice(modalStack.indexOf(id), 1)
      if (modalStack.length === 0) document.body.style.overflow = ''
      returnFocusTo?.focus?.({ preventScroll: true })
    }
  }, [open, id])

  const isCompound = Children.toArray(children).some(
    (child) => isValidElement(child) && compoundParts.includes(child.type)
  )

  return createPortal(
    <AnimatePresence>
      {open && (
        <ModalContext.Provider key="modal" value={{ onClose, titleId, edges, setEdges }}>
          <ModalLayer
            onScrimPress={onClose}
            panelRef={panelRef}
            labelledBy={isCompound || title ? titleId : undefined}
            className={cn(sizeClasses[size], className)}
          >
            {isCompound ? (
              children
            ) : (
              <>
                {title ? (
                  <ModalHeader title={title} />
                ) : (
                  <CloseButton onClick={onClose} className="absolute end-4 top-4 z-10" />
                )}
                <ModalBody className={title ? undefined : 'pt-6'}>{children}</ModalBody>
                {footer && <ModalFooter>{footer}</ModalFooter>}
              </>
            )}
          </ModalLayer>
        </ModalContext.Provider>
      )}
    </AnimatePresence>,
    document.body
  )
}

function ModalLayer({
  children,
  onScrimPress,
  panelRef,
  labelledBy,
  className,
}: {
  children: ReactNode
  onScrimPress: () => void
  panelRef: RefObject<HTMLDivElement | null>
  labelledBy?: string
  className?: string
}) {
  // While exiting, let input fall through to the page instead of waiting on the animation.
  const isPresent = useIsPresent()
  const pressStartedOnScrim = useRef(false)

  return (
    <div
      className={cn('fixed inset-0 z-50 flex items-center justify-center p-4', !isPresent && 'pointer-events-none')}
      onPointerDown={(e) => { pressStartedOnScrim.current = e.target === e.currentTarget }}
      onClick={(e) => {
        if (pressStartedOnScrim.current && e.target === e.currentTarget) onScrimPress()
      }}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-scrim"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } }}
        exit={{ opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }}
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        initial={{ opacity: 0, scale: 0.94, filter: 'blur(8px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', transition: spring.default }}
        exit={{
          opacity: 0,
          scale: 0.94,
          filter: 'blur(8px)',
          transition: { ...spring.snappy, visualDuration: 0.22 },
        }}
        className={cn(
          'relative flex max-h-[90dvh] w-full flex-col overflow-hidden rounded-[20px] outline-none',
          'bg-panel text-content shadow-modal ring-1 ring-black/5 dark:ring-white/10',
          className
        )}
      >
        {children}
      </motion.div>
    </div>
  )
}

// Named sub-component exports for advanced composition
Modal.Header = ModalHeader
Modal.Body   = ModalBody
Modal.Footer = ModalFooter
