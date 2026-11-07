"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Sidebar } from "@/components/aquathar/Sidebar";
import { DashboardView } from "@/components/aquathar/DashboardView";
import { MapView } from "@/components/aquathar/MapView";
import { LocationAnalysisView } from "@/components/aquathar/LocationAnalysisView";
import { ResearchView } from "@/components/aquathar/ResearchView";
import { AboutView } from "@/components/aquathar/AboutView";
import { useAquaStore } from "@/store/aqua-store";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export default function Home() {
  const view = useAquaStore((s) => s.view);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const renderView = () => {
    switch (view) {
      case "dashboard":
        return <DashboardView />;
      case "map":
        return <MapView />;
      case "analysis":
        return <LocationAnalysisView />;
      case "research":
        return <ResearchView />;
      case "about":
        return <AboutView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop sidebar */}
      <div className="hidden w-72 shrink-0 lg:block">
        <div className="sticky top-0 h-screen">
          <Sidebar />
        </div>
      </div>

      {/* Mobile sidebar (sheet) */}
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent
          side="left"
          className="w-72 p-0"
        >
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetDescription className="sr-only">
            AquaThar main navigation — switch between Dashboard, Groundwater Map, Location Analysis and About.
          </SheetDescription>
          <Sidebar onNavigate={() => setMobileNavOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main content area */}
      <div className="flex min-h-screen flex-1 flex-col">
        {/* Top bar (mobile + shared header) */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border/70 bg-background/90 px-4 py-3 backdrop-blur lg:px-8">
          <Button
            variant="outline"
            size="icon"
            aria-label="Open navigation"
            className="h-9 w-9 lg:hidden"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2">
            <span
              className={cn(
                "rounded-md bg-gradient-to-br from-sky-500 to-emerald-500 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-white shadow-sm",
              )}
            >
              {view === "dashboard" && "Dashboard"}
              {view === "map" && "Map"}
              {view === "analysis" && "Analysis"}
              {view === "research" && "Research"}
              {view === "about" && "About"}
            </span>
            <span className="text-[11px] text-muted-foreground">
              Tharparkar · Sindh · Pakistan
            </span>
          </div>

          <div className="ml-auto hidden items-center gap-1.5 text-[11px] text-muted-foreground sm:flex">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Prototype · sample data
          </div>

          {mobileNavOpen ? (
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto lg:hidden"
              aria-label="Close navigation"
              onClick={() => setMobileNavOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          ) : null}
        </header>

        {/* View content */}
        <main className="flex flex-1 flex-col overflow-hidden p-4 lg:p-8">
          <div className="mx-auto w-full max-w-7xl flex-1">
            {renderView()}
          </div>
        </main>

        {/* Sticky footer */}
        <footer className="mt-auto border-t border-border/70 bg-background px-4 py-4 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 text-[11px] text-muted-foreground sm:flex-row sm:items-center">
            <p>
              <span className="font-medium text-foreground">AquaThar</span> —
              Groundwater Intelligence System · Hackathon prototype
            </p>
            <p className="text-amber-700">
              ⚠ Illustrative estimates only — not verified measurements.
              Requires field verification.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
