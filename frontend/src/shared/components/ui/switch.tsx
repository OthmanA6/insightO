import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/shared/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "group peer inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full p-0.5 touch-manipulation",
      "transition-colors duration-200 ease-out",
      "data-[state=checked]:bg-primary data-[state=unchecked]:bg-fill-strong",
      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25",
      "disabled:cursor-not-allowed disabled:opacity-40",
      className
    )}
    {...props}
    ref={ref}
  >
    {/* The thumb stretches toward travel while pressed, like a finger squashing it. */}
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-white",
        "shadow-[0_2px_4px_rgba(0,0,0,0.16),0_0_0_0.5px_rgba(0,0,0,0.04)]",
        "transition-[translate,width] duration-300 ease-fluid",
        "data-[state=unchecked]:translate-x-0 data-[state=checked]:translate-x-4",
        "group-active:w-6 group-active:data-[state=checked]:translate-x-3"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
