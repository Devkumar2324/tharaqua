"use client";

import { Droplets, Gauge, Layers, MapPin, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { StatCard } from "./StatCard";
import { PotentialDistributionChart } from "./PotentialDistributionChart";
import { DepthComparisonChart } from "./DepthComparisonChart";
import { LocationSearch } from "./LocationSearch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TOTAL_SURVEYED_LOCATIONS,
  getDepthStats,
  getPotentialDistribution,
} from "@/lib/groundwater";
import { GROUNDWATER_RECORDS } from "@/data/groundwater-data";
import { useAquaStore } from "@/store/aqua-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function DashboardView() {
  const setView = useAquaStore((s) => s.setView);
  const selectLocation = useAquaStore((s) => s.selectLocation);
  const depthStats = getDepthStats();
  const distribution = getPotentialDistribution();
  const mediumHighCount =
    distribution.find((d) => d.potential === "Medium")?.count ?? 0 +
    (distribution.find((d) => d.potential === "High")?.count ?? 0);

  return (
    <div className="space-y-6">
      {/* Heading + search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Groundwater Intelligence Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Explore estimated groundwater availability across Tharparkar, Sindh, Pakistan.
          </p>
        </div>
        <div className="w-full max-w-sm">
          <LocationSearch />
        </div>
      </div>

      {/* Disclaimer banner */}
      <Alert className="border-amber-300/60 bg-amber-50 text-amber-900">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-900">Sample prototype data</AlertTitle>
        <AlertDescription className="text-amber-800">
          All figures shown are illustrative estimates created for this
          hackathon prototype. They are not verified field measurements and must
          not be used for drilling, planning or operational decisions. Always
          perform on-site hydrogeological surveys.
        </AlertDescription>
      </Alert>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Surveyed sample locations"
          value={TOTAL_SURVEYED_LOCATIONS}
          hint="Towns covered by the prototype dataset"
          icon={MapPin}
          accent="sky"
        />
        <StatCard
          label="Average depth (sample)"
          value={`${depthStats.average} m`}
          hint={`Range ${depthStats.shallowest}–${depthStats.deepest} m (illustrative)`}
          icon={Gauge}
          accent="emerald"
        />
        <StatCard
          label="Medium / High potential"
          value={mediumHighCount}
          hint="Sample locations with non-low potential"
          icon={Droplets}
          accent="sky"
        />
        <StatCard
          label="Avg. confidence"
          value="Medium"
          hint="Most records marked illustrative — needs field verification"
          icon={Layers}
          accent="amber"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PotentialDistributionChart />
        <DepthComparisonChart />
      </div>

      {/* Surveyed towns table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Surveyed Sample Locations</CardTitle>
          <CardDescription className="text-xs">
            Click a town to view its full groundwater analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto scroll-thin">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="py-2 pr-4 font-medium">Town</th>
                  <th className="py-2 pr-4 font-medium">Region</th>
                  <th className="py-2 pr-4 font-medium">Depth (m)</th>
                  <th className="py-2 pr-4 font-medium">Potential</th>
                  <th className="py-2 pr-4 font-medium">Confidence</th>
                  <th className="py-2 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {GROUNDWATER_RECORDS.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b last:border-0 hover:bg-muted/40"
                  >
                    <td className="py-3 pr-4">
                      <p className="font-medium text-foreground">{r.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {r.lat.toFixed(3)}, {r.lng.toFixed(3)}
                      </p>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {r.region}
                    </td>
                    <td className="py-3 pr-4 text-foreground">
                      {r.depthMin}–{r.depthMax}
                      <span className="ml-1 text-[11px] text-muted-foreground">
                        (avg {r.depthAvg} m)
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <PotentialBadge potential={r.potential} />
                    </td>
                    <td className="py-3 pr-4">
                      <ConfidencePill confidence={r.confidence} />
                    </td>
                    <td className="py-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          selectLocation({
                            lat: r.lat,
                            lng: r.lng,
                            label: r.name,
                            recordId: r.id,
                          })
                        }
                      >
                        Analyse
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-[11px] text-muted-foreground">
              Showing all {TOTAL_SURVEYED_LOCATIONS} sample locations.
            </p>
            <Button variant="ghost" size="sm" onClick={() => setView("map")}>
              Open interactive map →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PotentialBadge({
  potential,
}: {
  potential: "Low" | "Medium" | "High";
}) {
  const map: Record<typeof potential, string> = {
    High: "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15",
    Medium: "bg-amber-500/15 text-amber-700 hover:bg-amber-500/15",
    Low: "bg-rose-500/15 text-rose-700 hover:bg-rose-500/15",
  };
  return (
    <Badge variant="secondary" className={map[potential]}>
      {potential}
    </Badge>
  );
}

function ConfidencePill({
  confidence,
}: {
  confidence: "High" | "Medium" | "Low";
}) {
  const map: Record<typeof confidence, string> = {
    High: "text-emerald-700",
    Medium: "text-amber-700",
    Low: "text-rose-700",
  };
  return (
    <span className={`text-xs font-medium ${map[confidence]}`}>
      {confidence}
    </span>
  );
}
