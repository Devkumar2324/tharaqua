"use client";

import Link from "next/link";
import { Droplets, LayoutDashboard, Map, Microscope, BookOpen, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAquaStore, type AquaView } from "@/store/aqua-store";
import { Badge } from "@/components/ui/badge";

const NAV_ITEMS: {
  id: AquaView;
  label: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    description: "Overview & stats",
    icon: LayoutDashboard,
  },
  {
    id: "map",
    label: "Groundwater Map",
    description: "Interactive Leaflet map",
    icon: Map,
  },
  {
    id: "analysis",
    label: "Location Analysis",
    description: "Selected location details",
    icon: Microscope,
  },
  {
    id: "research",
    label: "Research & Sources",
    description: "Cited hydrogeology facts",
    icon: BookOpen,
  },
  {
    id: "about",
    label: "About AquaThar",
    description: "Project & disclaimer",
    icon: Info,
  },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const view = useAquaStore((s) => s.view);
  const setView = useAquaStore((s) => s.setView);

  return (
    <aside className="flex h-full w-full flex-col bg-sidebar text-sidebar-foreground">
      {/* Brand */}
      <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 shadow-lg shadow-sky-500/20">
          <Droplets className="h-5 w-5 text-white" />
        </div>
        <div className="leading-tight">
          <p className="text-base font-semibold tracking-tight text-white">
            AquaThar
          </p>
          <p className="text-[11px] uppercase tracking-wider text-sky-300/80">
            Groundwater Intelligence
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4 scroll-thin overflow-y-auto">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-sky-300/60">
          Navigation
        </p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = view === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setView(item.id);
                onNavigate?.();
              }}
              className={cn(
                "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                active
                  ? "bg-sidebar-accent text-white"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-white",
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  active
                    ? "text-sky-300"
                    : "text-sky-300/60 group-hover:text-sky-300",
                )}
              />
              <span className="flex-1">
                <span className="block font-medium leading-tight">
                  {item.label}
                </span>
                <span className="block text-[11px] text-sky-300/50">
                  {item.description}
                </span>
              </span>
            </button>
          );
        })}
      </nav>

      {/* Region badge */}
      <div className="border-t border-sidebar-border px-5 py-4">
        <div className="rounded-lg bg-white/5 px-3 py-3">
          <p className="text-[11px] uppercase tracking-wider text-sky-300/60">
            Region
          </p>
          <p className="text-sm font-medium text-white">Tharparkar, Sindh</p>
          <p className="text-[11px] text-sky-300/60">Pakistan</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Badge
              variant="secondary"
              className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20"
            >
              Prototype
            </Badge>
            <Badge
              variant="secondary"
              className="bg-amber-500/20 text-amber-300 hover:bg-amber-500/20"
            >
              Sample data
            </Badge>
          </div>
        </div>
        <p className="mt-3 text-[10px] leading-relaxed text-sky-300/50">
          Estimates require field verification. Not official research data.
        </p>
      </div>
    </aside>
  );
}

export function SidebarLinkList() {
  // helper kept for any future page-routed version of the app
  return (
    <div className="hidden">
      <Link href="/">AquaThar</Link>
    </div>
  );
}
