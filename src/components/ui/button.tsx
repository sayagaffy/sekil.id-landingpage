import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-display font-semibold tracking-tight transition-all duration-120 ease-snap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border-2",
  {
    variants: {
      variant: {
        /* Ink-fill button — default brutal */
        default:
          "border-ink bg-ink text-white shadow-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-md active:translate-x-0 active:translate-y-0 active:shadow-none",
        /* Electric blue button — primary brand action */
        brand:
          "border-ink bg-blue-500 text-white shadow-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-md active:translate-x-0 active:translate-y-0 active:shadow-none",
        /* White/paper fill, ink border — secondary action */
        outline:
          "border-ink bg-background text-ink shadow-sm hover:bg-ink hover:text-white hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-md active:translate-x-0 active:translate-y-0 active:shadow-none",
        /* Peach fill — accent/warm CTA */
        peach:
          "border-ink bg-peach-300 text-ink shadow-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-md active:translate-x-0 active:translate-y-0 active:shadow-none",
        /* Ghost — transparent, ink color, border on hover */
        ghost:
          "border-transparent bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-white",
        /* Destructive */
        destructive:
          "border-ink bg-destructive text-destructive-foreground shadow-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-md",
        /* Text link */
        link:
          "border-transparent bg-transparent text-primary underline-offset-4 hover:underline",
        /* Secondary — sky-100 fill */
        secondary:
          "border-ink bg-secondary text-secondary-foreground shadow-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-md",
      },
      size: {
        default: "h-10 px-5 py-2.5 text-[15px]",
        sm:      "h-9 px-3 py-2 text-[13px]",
        lg:      "h-12 px-6 py-3 text-[17px]",
        icon:    "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
