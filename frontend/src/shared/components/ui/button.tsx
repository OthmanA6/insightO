import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/lib/utils'

// ─── Variant Definitions ──────────────────────────────────────────────────────

const buttonVariants = cva(
  // Base styles shared across all variants
  [
    'relative inline-flex items-center justify-center gap-2 font-semibold',
    'select-none whitespace-nowrap touch-manipulation',
    // Press feedback lands on pointer-down; the release eases back out.
    'transition-[scale,background-color,border-color,color,box-shadow,opacity,filter] duration-200 ease-out',
    'active:scale-[0.97] active:duration-75',
    'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25',
    'disabled:pointer-events-none disabled:opacity-40',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        /** Filled accent – the one primary action in a view */
        primary: [
          'bg-primary text-white shadow-primary-sm',
          'hover:bg-primary-hover',
        ],

        /** Indigo → Purple gradient – "Generate AI" & hero CTAs */
        gradient: [
          'bg-gradient-primary text-white shadow-primary-sm',
          'hover:brightness-110',
        ],

        /** Gray fill – secondary actions that sit beside a primary one */
        secondary: [
          'bg-fill text-content',
          'hover:bg-fill-strong',
        ],

        /** Accent-tinted fill – emphasis without the weight of a filled button */
        tinted: [
          'bg-primary/12 text-primary',
          'hover:bg-primary/18',
        ],

        /** Hairline outline – secondary actions on busy surfaces */
        outline: [
          'border border-separator bg-transparent text-content',
          'hover:bg-panel-hover',
        ],

        /** Ghost – low-emphasis actions (toolbars, icon buttons) */
        ghost: [
          'bg-transparent text-content-muted',
          'hover:bg-panel-hover hover:text-content',
        ],

        /** Destructive – irreversible actions */
        danger: [
          'bg-destructive text-white shadow-sm',
          'hover:brightness-110',
        ],
      },

      size: {
        sm: 'h-8 rounded-lg px-3 text-[13px] [&_svg]:size-3.5',
        md: 'h-10 rounded-[10px] px-4 text-sm [&_svg]:size-4',
        lg: 'h-12 rounded-xl px-6 text-[15px] [&_svg]:size-5',
        icon: 'h-9 w-9 rounded-full [&_svg]:size-4',
      },
    },

    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

// ─── Types ──────────────────────────────────────────────────────────────────

export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>
export type ButtonSize    = NonNullable<VariantProps<typeof buttonVariants>['size']>

export interface ButtonProps
  extends React.ComponentPropsWithRef<'button'>,
    VariantProps<typeof buttonVariants> {}

// ─── Component ──────────────────────────────────────────────────────────────

/**
 * `Button` – insightO design-system button.
 *
 * @example
 * <Button variant="gradient" size="lg">Generate AI Report</Button>
 * <Button variant="secondary" size="sm">Cancel</Button>
 * <Button variant="danger">Delete</Button>
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
)

Button.displayName = 'Button'

export { Button, buttonVariants }
