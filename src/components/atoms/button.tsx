import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/tailwind-merge";

const buttonVariants = cva(
  "inline-flex items-center whitespace-nowrap rounded-md text-sm ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-white text-primary hover:bg-white/70 text-center justify-center hover:shadow-lg hover:-translate-y-1 hover:shadow-black/30",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-lg hover:-translate-y-1 hover:shadow-black/30",
        outline: "border border-zinc-300 hover:border-primary hover:shadow-lg",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-lg hover:-translate-y-1 hover:shadow-black/30",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline hover:shadow-lg hover:-translate-y-1 hover:shadow-black/30",
        specialBlue:
          "text-primary bg-secondary shadow-lg border border-white justify-between hover:shadow-xl hover:-translate-y-0.5 hover:shadow-black/30 hover:opacity-70",
        specialGray:
          "text-whitish-beige bg-indigo-950 border border-white justify-between shadow-lg hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30 hover:opacity-70",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        md: "h-9 rounded-full w-[150px] px-5",
        lg: "h-11 rounded-full px-4 w-[215px]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
