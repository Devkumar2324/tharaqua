"use client";

import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { SEARCHABLE_TOWNS } from "@/data/groundwater-data";
import { useAquaStore } from "@/store/aqua-store";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface LocationSearchProps {
  className?: string;
  /** Hide the heading label (compact mode for the map toolbar). */
  compact?: boolean;
}

export function LocationSearch({ className, compact }: LocationSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selectLocation = useAquaStore((s) => s.selectLocation);

  const filtered = SEARCHABLE_TOWNS.filter((t) =>
    t.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  function handleSelect(id: string) {
    const town = SEARCHABLE_TOWNS.find((t) => t.id === id);
    if (!town) return;
    selectLocation({
      lat: town.lat,
      lng: town.lng,
      label: town.name,
      recordId: town.id,
    });
    setOpen(false);
    setQuery("");
    toast.success(`Selected ${town.name}`, {
      description: "Showing groundwater analysis for this location.",
    });
  }

  function handleManualSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    const town = SEARCHABLE_TOWNS.find(
      (t) => t.name.toLowerCase() === q.toLowerCase(),
    );
    if (town) {
      handleSelect(town.id);
      return;
    }
    toast.info("No exact town match", {
      description:
        "Try Mithi, Islamkot, Diplo, Nagarparkar or Chachro — or click the map directly.",
    });
  }

  return (
    <div className={cn("w-full", className)}>
      {!compact && (
        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Search a Tharparkar town
        </label>
      )}
      <form onSubmit={handleManualSearch}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                placeholder="e.g. Mithi, Islamkot, Diplo…"
                className="h-10 pl-9"
                aria-label="Search Tharparkar towns"
              />
            </div>
          </PopoverTrigger>
          <PopoverContent
            className="w-[--radix-popover-trigger-width] p-0"
            align="start"
          >
            <div className="max-h-72 overflow-y-auto scroll-thin">
              {filtered.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No matching towns. Try the map.
                </p>
              ) : (
                filtered.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSelect(t.id)}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm hover:bg-accent"
                  >
                    <MapPin className="h-4 w-4 shrink-0 text-sky-600" />
                    <span className="flex-1">
                      <span className="block font-medium text-foreground">
                        {t.name}
                      </span>
                      <span className="block text-[11px] text-muted-foreground">
                        {t.region} · {t.lat.toFixed(3)}, {t.lng.toFixed(3)}
                      </span>
                    </span>
                  </button>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>
      </form>
    </div>
  );
}
