"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  accent?: "sky" | "emerald" | "amber" | "rose";
}

const ACCENT_STYLES: Record<NonNullable<StatCardProps["accent"]>, string> = {
  sky: "from-sky-500/15 to-sky-500/5 text-sky-700",
  emerald: "from-emerald-500/15 to-emerald-500/5 text-emerald-700",
  amber: "from-amber-500/15 to-amber-500/5 text-amber-700",
  rose: "from-rose-500/15 to-rose-500/5 text-rose-700",
};

const ICON_BG: Record<NonNullable<StatCardProps["accent"]>, string> = {
  sky: "bg-sky-500/15 text-sky-600",
  emerald: "bg-emerald-500/15 text-emerald-600",
  amber: "bg-amber-500/15 text-amber-600",
  rose: "bg-rose-500/15 text-rose-600",
};

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "sky",
}: StatCardProps) {
  return (
    <Card className="relative overflow-hidden p-5">
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br",
          ACCENT_STYLES[accent],
        )}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 truncate text-2xl font-semibold text-foreground">
            {value}
          </p>
          {hint ? (
            <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
              {hint}
            </p>
          ) : null}
        </div>
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            ICON_BG[accent],
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}
