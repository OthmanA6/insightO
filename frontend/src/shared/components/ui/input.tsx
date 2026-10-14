import * as React from "react"
import { cn } from "@/shared/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  startIcon?: React.ReactNode;
}

/** Shared text-field surface, also used by `Textarea`. */
export const fieldClasses = cn(
  "w-full rounded-[10px] border border-separator bg-field text-sm text-content",
  "placeholder:text-content-muted/70",
  "transition-[border-color,box-shadow,background-color] duration-150 ease-out",
  "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/15",
  "aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/15",
  "disabled:cursor-not-allowed disabled:opacity-50"
)

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startIcon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {startIcon && (
          <div className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-content-muted">
            {startIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            fieldClasses,
            "flex h-10 px-3 py-2 file:border-0 file:bg-transparent file:text-sm file:font-medium",
            startIcon && "ps-9",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
