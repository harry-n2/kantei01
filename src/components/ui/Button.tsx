import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost'
    size?: 'default' | 'lg' | 'sm'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'default', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-bold tracking-wide ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
                    {
                        'bg-gold-gradient text-white hover:shadow-[0_0_20px_rgba(245,158,11,0.6)] hover:brightness-110 border border-white/20': variant === 'primary',
                        'border-2 border-primary text-primary hover:bg-primary/10': variant === 'outline',
                        'hover:bg-white/10 text-white': variant === 'ghost',
                        'h-10 px-6 py-2': size === 'default',
                        'w-full h-14 text-lg md:text-xl': size === 'lg',
                        'h-9 rounded-md px-3': size === 'sm',
                    },
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
