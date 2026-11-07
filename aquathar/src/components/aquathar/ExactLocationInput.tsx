"use client";

import { useState } from "react";
import { LocateFixed, MapPin, Search, Loader2, AlertCircle } from "lucide-react";
import { useAquaStore } from "@/store/aqua-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ExactLocationInputProps {
  /** Compact layout (no heading) — used in toolbars. */
  compact?: boolean;
  className?: string;
}

/**
 * Convert decimal degrees to degrees/minutes/seconds.
 * Used to display the human-readable form of an exact coordinate.
 */
function toDMS(decimal: number, isLat: boolean): string {
  const abs = Math.abs(decimal);
  const deg = Math.floor(abs);
  const minFloat = (abs - deg) * 60;
  const min = Math.floor(minFloat);
  const sec = Math.round((minFloat - min) * 60 * 10) / 10;
  const hemisphere = isLat
    ? decimal >= 0
      ? "N"
      : "S"
    : decimal >= 0
      ? "E"
      : "W";
  return `${deg}°${min.toString().padStart(2, "0")}'${sec.toString().padStart(4, "0")}"${hemisphere}`;
}

const THAR_LAT_MIN = 24.0;
const THAR_LAT_MAX = 25.5;
const THAR_LNG_MIN = 69.4;
const THAR_LNG_MAX = 71.0;

function withinTharparkar(lat: number, lng: number): boolean {
  return (
    lat >= THAR_LAT_MIN &&
    lat <= THAR_LAT_MAX &&
    lng >= THAR_LNG_MIN &&
    lng <= THAR_LNG_MAX
  );
}

export function ExactLocationInput({
  compact,
  className,
}: ExactLocationInputProps) {
  const selectLocation = useAquaStore((s) => s.selectLocation);
  const [latStr, setLatStr] = useState("");
  const [lngStr, setLngStr] = useState("");
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGeoError(null);

    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      setGeoError("Please enter valid numeric latitude and longitude.");
      return;
    }
    if (lat < -90 || lat > 90) {
      setGeoError("Latitude must be between -90 and 90.");
      return;
    }
    if (lng < -180 || lng > 180) {
      setGeoError("Longitude must be between -180 and 180.");
      return;
    }

    const insideThar = withinTharparkar(lat, lng);
    selectLocation({
      lat,
      lng,
      label: insideThar ? "Exact coordinate (in Tharparkar)" : "Exact coordinate (outside Tharparkar)",
    });

    if (!insideThar) {
      toast.warning("Coordinate is outside Tharparkar", {
        description:
          "We'll still show the nearest surveyed Tharparkar town, but the estimate may be less relevant for your point.",
      });
    } else {
      toast.success("Exact location set", {
        description: `Lat ${lat.toFixed(4)}, Lng ${lng.toFixed(4)} → showing analysis.`,
      });
    }
  }

  function handleGeolocate() {
    setGeoError(null);
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoError("Geolocation is not supported by this browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const { latitude, longitude, accuracy } = pos.coords;
        setLatStr(latitude.toFixed(6));
        setLngStr(longitude.toFixed(6));
        const insideThar = withinTharparkar(latitude, longitude);
        selectLocation({
          lat: latitude,
          lng: longitude,
          label: insideThar
            ? "My GPS location (in Tharparkar)"
            : "My GPS location (outside Tharparkar)",
        });
        toast.success("Got your GPS location", {
          description: `Accurate to ~${Math.round(accuracy)} m. ${
            insideThar
              ? "Within Tharparkar — showing analysis."
              : "Outside Tharparkar — nearest surveyed town will still be shown."
          }`,
        });
      },
      (err) => {
        setLocating(false);
        const messages: Record<number, string> = {
          1: "Permission denied. Please enable location access or enter coordinates manually.",
          2: "Position unavailable. Try again or enter coordinates manually.",
          3: "Location request timed out. Try again.",
        };
        setGeoError(messages[err.code] ?? err.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }

  const latNum = parseFloat(latStr);
  const lngNum = parseFloat(lngStr);
  const hasValidCoord =
    !Number.isNaN(latNum) && !Number.isNaN(lngNum) && latNum >= -90 && latNum <= 90 && lngNum >= -180 && lngNum <= 180;

  return (
    <div className={cn("w-full", className)}>
      {!compact && (
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-foreground">
            Use exact coordinates
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Enter precise latitude / longitude from your GPS device, field survey, or
            maps app — or use your device&apos;s GPS.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="lat-input" className="text-[11px] font-medium text-muted-foreground">
              Latitude
            </Label>
            <Input
              id="lat-input"
              type="number"
              step="any"
              inputMode="decimal"
              value={latStr}
              onChange={(e) => setLatStr(e.target.value)}
              placeholder="24.7408"
              className="h-9 font-mono text-sm"
              aria-label="Latitude in decimal degrees"
            />
          </div>
          <div>
            <Label htmlFor="lng-input" className="text-[11px] font-medium text-muted-foreground">
              Longitude
            </Label>
            <Input
              id="lng-input"
              type="number"
              step="any"
              inputMode="decimal"
              value={lngStr}
              onChange={(e) => setLngStr(e.target.value)}
              placeholder="69.8011"
              className="h-9 font-mono text-sm"
              aria-label="Longitude in decimal degrees"
            />
          </div>
        </div>

        {hasValidCoord && (
          <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-[11px] text-muted-foreground">
            <p className="font-mono">
              <span className="text-foreground">{latNum.toFixed(6)}</span>,{" "}
              <span className="text-foreground">{lngNum.toFixed(6)}</span>
            </p>
            <p className="mt-0.5">
              DMS:{" "}
              <span className="font-mono text-foreground">
                {toDMS(latNum, true)}, {toDMS(lngNum, false)}
              </span>
            </p>
            <p className="mt-0.5">
              {withinTharparkar(latNum, lngNum) ? (
                <span className="text-emerald-700">✓ Within Tharparkar bounds</span>
              ) : (
                <span className="text-amber-700">⚠ Outside Tharparkar bounds (still queryable)</span>
              )}
            </p>
          </div>
        )}

        {geoError && (
          <p className="flex items-start gap-1.5 text-[11px] text-rose-700">
            <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />
            {geoError}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <Button type="submit" size="sm" className="flex-1 sm:flex-none">
            <Search className="mr-1.5 h-3.5 w-3.5" />
            Analyse exact location
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleGeolocate}
            disabled={locating}
          >
            {locating ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <LocateFixed className="mr-1.5 h-3.5 w-3.5" />
            )}
            {locating ? "Locating…" : "Use my GPS"}
          </Button>
        </div>
      </form>

      {compact && (
        <p className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
          <MapPin className="h-3 w-3" />
          Tip: Tharparkar spans approx. 24.0–25.5°N, 69.4–71.0°E.
        </p>
      )}
    </div>
  );
}
