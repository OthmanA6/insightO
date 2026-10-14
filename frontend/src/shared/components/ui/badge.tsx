import * as React from "react"
import { cn } from "@/shared/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/25",
  {
    variants: {
      variant: {
        default: "bg-primary text-white",
        secondary: "bg-fill text-content-muted",
        destructive: "bg-destructive/12 text-red-600 dark:text-red-400",
        outline: "border-separator text-content-muted",
        ai: "bg-purple-500/12 text-purple-600 dark:text-purple-300",
        success: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
