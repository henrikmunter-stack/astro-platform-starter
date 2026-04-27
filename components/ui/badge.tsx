import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[#1B4F72] text-white",
        secondary: "border-transparent bg-[#2E86AB] text-white",
        success: "border-transparent bg-[#1E8449] text-white",
        warning: "border-transparent bg-[#D4AC0D] text-white",
        destructive: "border-transparent bg-[#C0392B] text-white",
        outline: "border-[#1B4F72] text-[#1B4F72]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
