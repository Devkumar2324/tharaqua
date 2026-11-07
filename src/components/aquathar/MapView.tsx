"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { MapPin, Crosshair, Info, ChevronDown, LocateFixed } from "lucide-react";
import { useAquaStore } from "@/store/aqua-store";
import { LocationSearch } from "./LocationSearch";
import { ExactLocationInput } from "./ExactLocationInput";
import { GROUNDWATER_RECORDS } from "@/data/groundwater-data";
import { getPotentialColor } from "@/lib/groundwater";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Leaflet must be loaded client-side only (no SSR).
const TharMap = dynamic(() => import("./TharMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-sky-100">
      <div className="flex flex-col items-center gap-3 text-sky-800">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-300 border-t-sky-700" />
        <p className="text-sm font-medium">Loading Tharparkar map…</p>
      </div>
    </div>
  ),
});

export function MapView() {
  const selected = useAquaStore((s) => s.selected);
  const selectLocation = useAquaStore((s) => s.selectLocation);
  const setView = useAquaStore((s) => s.setView);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    selected
      ? { lat: selected.lat, lng: selected.lng }
      : null,
  );
  const [exactOpen, setExactOpen] = useState(false);

  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      setCoords({ lat, lng });
      selectLocation({ lat, lng });
    },
    [selectLocation],
  );

  const handleRecordSelect = useCallback(
    (recordId: string) => {
      const r = GROUNDWATER_RECORDS.find((rec) => rec.id === recordId);
      if (!r) return;
      setCoords({ lat: r.lat, lng: r.lng });
      selectLocation({
        lat: r.lat,
        lng: r.lng,
        label: r.name,
        recordId: r.id,
      });
    },
    [selectLocation],
  );

  return (
    <div className="flex h-full flex-col gap-4 lg:flex-row">
      {/* Map area */}
      <div className="flex flex-1 flex-col">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Groundwater Map
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Click anywhere on the map, pick a surveyed town, or enter exact coordinates below.
            </p>
          </div>
          <div className="w-full sm:w-72">
            <LocationSearch compact />
          </div>
        </div>

        {/* Exact-coordinate input (collapsible) */}
        <Collapsible open={exactOpen} onOpenChange={setExactOpen} className="mb-3">
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <LocateFixed className="h-4 w-4 text-sky-600" />
                Use exact coordinates (GPS / lat-lng)
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${exactOpen ? "rotate-180" : ""}`}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <Card className="p-4">
              <ExactLocationInput compact />
            </Card>
          </CollapsibleContent>
        </Collapsible>

        <Card className="relative flex-1 overflow-hidden p-0">
          <div className="h-[60vh] min-h-[420px] w-full lg:h-[72vh]">
            <TharMap
              onMapClick={handleMapClick}
              onRecordSelect={handleRecordSelect}
            />
          </div>

          {/* Coordinate readout */}
          <div className="pointer-events-none absolute bottom-3 left-3 z-[500] flex flex-wrap items-center gap-2 rounded-lg border border-border/60 bg-white/90 px-3 py-2 text-xs shadow-md backdrop-blur">
            <Crosshair className="h-3.5 w-3.5 text-sky-600" />
            {coords ? (
              <span className="font-mono text-foreground">
                {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
              </span>
            ) : (
              <span className="text-muted-foreground">
                Click the map to view coordinates
              </span>
            )}
          </div>

          {/* Legend */}
          <div className="pointer-events-none absolute right-3 top-3 z-[500] rounded-lg border border-border/60 bg-white/90 px-3 py-2 text-xs shadow-md backdrop-blur">
            <p className="mb-1.5 flex items-center gap-1.5 font-semibold text-foreground">
              <Info className="h-3.5 w-3.5 text-sky-600" /> Groundwater potential
            </p>
            <div className="space-y-1">
              {(["High", "Medium", "Low"] as const).map((p) => (
                <div key={p} className="flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: getPotentialColor(p) }}
                  />
                  <span className="text-muted-foreground">{p}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {selected && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-sky-600" />
              <span className="text-muted-foreground">Selected:</span>
              <span className="font-medium text-foreground">
                {selected.label ?? "Custom point"}
              </span>
              <Badge variant="outline" className="font-mono text-[11px]">
                {selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}
              </Badge>
            </div>
            <Button size="sm" onClick={() => setView("analysis")}>
              View location analysis →
            </Button>
          </div>
        )}
      </div>

      {/* Side panel: surveyed towns */}
      <Card className="flex w-full shrink-0 flex-col lg:w-80">
        <div className="border-b px-4 py-3">
          <p className="text-sm font-semibold text-foreground">
            Surveyed sample towns
          </p>
          <p className="text-[11px] text-muted-foreground">
            Click a marker on the map or an item below.
          </p>
        </div>
        <div className="flex-1 overflow-y-auto scroll-thin px-2 py-2 max-h-[60vh] lg:max-h-[72vh]">
          {GROUNDWATER_RECORDS.map((r) => {
            const active =
              selected?.recordId === r.id || selected?.label === r.name;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => handleRecordSelect(r.id)}
                className={`mb-1 flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                  active
                    ? "bg-sky-50 ring-1 ring-sky-200"
                    : "hover:bg-muted/60"
                }`}
              >
                <span
                  className="mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: getPotentialColor(r.potential) }}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-foreground">
                      {r.name}
                    </span>
                    <Badge
                      variant="secondary"
                      className="shrink-0 text-[10px]"
                    >
                      {r.potential}
                    </Badge>
                  </span>
                  <span className="block text-[11px] text-muted-foreground">
                    Depth {r.depthMin}–{r.depthMax} m · {r.region}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <div className="border-t px-4 py-3 text-[11px] leading-relaxed text-muted-foreground">
          All markers indicate illustrative sample estimates — not verified well measurements.
        </div>
      </Card>
    </div>
  );
}
