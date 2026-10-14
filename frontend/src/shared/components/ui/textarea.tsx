import * as React from "react"
import { cn } from "@/shared/lib/utils"
import { fieldClasses } from "./input"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(fieldClasses, "flex min-h-[72px] px-3 py-2.5 leading-relaxed", className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
