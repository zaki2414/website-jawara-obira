import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-black uppercase tracking-wider transition-all duration-150 cursor-pointer disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-on-primary border-2 border-on-surface rounded-xl hard-shadow-sm hard-shadow-hover press-effect",
        // Varian aksen tema — dipakai untuk mencocokkan warna section admin
        // (KKN=primary, Budaya=tertiary, Fauna/Toga=cream), bukan cuma
        // primary/netral. Pasangan teks sudah divalidasi WCAG (lihat catatan
        // di components/admin/*/*.ts): cream sengaja pakai text-on-surface,
        // BUKAN text-on-cream — itu token untuk aksen kartu, bukan tombol.
        tertiary:
          "bg-tertiary text-on-tertiary border-2 border-on-surface rounded-xl hard-shadow-sm hard-shadow-hover press-effect",
        cream:
          "bg-cream text-on-surface border-2 border-on-surface rounded-xl hard-shadow-sm hard-shadow-hover press-effect",
        secondary:
          "bg-surface-container text-on-surface border-2 border-on-surface rounded-xl hard-shadow-sm hard-shadow-hover press-effect",
        destructive:
          "bg-error text-on-error border-2 border-on-surface rounded-xl hard-shadow-sm hard-shadow-hover press-effect",
        outline:
          "bg-transparent text-on-surface border-2 border-on-surface rounded-xl hover:bg-surface-container-low press-effect",
        ghost:
          "bg-transparent text-on-surface-variant border-2 border-transparent rounded-xl hover:bg-surface-container-low hover:text-on-surface",
      },
      size: {
        sm: "h-9 px-3 text-label-sm has-[>svg]:px-2.5",
        default: "h-11 px-5 text-label-md has-[>svg]:px-4",
        lg: "h-13 px-7 text-headline-md has-[>svg]:px-5",
        icon: "size-11 shrink-0 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
  }

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  if (asChild) {
    return (
      <Slot.Root
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </Slot.Root>
    )
  }

  return (
    <button
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  )
}

export { Button, buttonVariants }
