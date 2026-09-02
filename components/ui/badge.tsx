import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  // text-label-md + font-black + tracking-wide (BUKAN text-label-sm/font-semibold/
  // tracking-widest bawaan shadcn) — disamakan permanen di sini dengan tombol lain
  // (mis. "LIHAT SITUS PUBLIK") supaya SEMUA badge di seluruh aplikasi otomatis
  // konsisten, tidak perlu di-override className per pemanggilan lagi.
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden text-label-md font-black tracking-wide whitespace-nowrap transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-0 has-data-[icon=inline-start]:pl-0 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        // Varian "text-only" shadcn asli — tanpa bg/border, untuk badge inline di dalam teks/link.
        default: "rounded-none border-0 bg-transparent px-0 py-0 text-foreground [a]:hover:text-foreground/70",
        secondary: "rounded-none border-0 bg-transparent px-0 py-0 text-muted-foreground [a]:hover:text-foreground",
        destructive:
          "rounded-none border-0 bg-transparent px-0 py-0 text-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:text-destructive/70",
        outline: "rounded-none border-0 bg-transparent px-0 py-0 text-foreground [a]:hover:text-foreground/70",
        ghost: "rounded-none border-0 bg-transparent px-0 py-0 text-muted-foreground hover:text-foreground",
        link: "rounded-none border-0 bg-transparent px-0 py-0 text-foreground underline-offset-4 hover:underline",
        // Varian "chip" brutalist — untuk badge kategori/status di atas kartu (CultureCard, FaunaCard, UMKMCard, dst).
        solid:
          "rounded-full border-2 border-on-surface bg-primary text-on-primary px-2.5 py-1 hard-shadow-sm",
        "solid-tertiary":
          "rounded-full border-2 border-on-surface bg-tertiary text-on-tertiary px-2.5 py-1 hard-shadow-sm",
        "solid-outline":
          "rounded-full border-2 border-on-surface bg-background text-on-surface px-2.5 py-1 hard-shadow-sm",
        "solid-cream":
          "rounded-full border-2 border-on-surface bg-cream text-on-surface px-2.5 py-1 hard-shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
