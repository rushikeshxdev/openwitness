"use client";

import { cn } from "@/lib/utils";
import {
  AuthBrandPanel,
  type AuthBrandVariant,
} from "./auth-brand-panel";
import { Globe2, Moon } from "lucide-react";

export interface AuthShellProps {
  variant: AuthBrandVariant;
  children: React.ReactNode;
  /** Top-right chrome for the form column (e.g. “Already have an account?”) */
  formHeader?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function AuthShell({
  variant,
  children,
  formHeader,
  footer,
  className,
}: AuthShellProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-[#0B0E11] text-zinc-100 lg:grid lg:grid-cols-2",
        className
      )}
    >
      <AuthBrandPanel variant={variant} className="order-2 lg:order-1" />

      <div className="relative order-1 flex min-h-screen flex-col lg:order-2">
        <div className="flex items-center justify-end gap-3 px-4 py-4 sm:px-8">
          {formHeader ?? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs text-zinc-400"
                aria-label="Language"
              >
                <Globe2 className="h-3.5 w-3.5" aria-hidden="true" />
                English
              </button>
              <button
                type="button"
                className="rounded-lg border border-white/10 bg-white/[0.03] p-2 text-zinc-400"
                aria-label="Theme"
              >
                <Moon className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-center px-4 pb-8 sm:px-8 lg:px-10 xl:px-16">
          {children}
        </div>

        {footer && (
          <div className="px-4 pb-6 sm:px-8 lg:px-10">{footer}</div>
        )}
      </div>
    </div>
  );
}
