"use client";

import { useMemo } from "react";
import {
  Droplets,
  Gauge,
  Activity,
  Beaker,
  MapPin,
  Database,
  Crosshair,
  AlertTriangle,
  ArrowLeft,
  Layers3,
} from "lucide-react";
import {
  findNearestRecord,
  describeMatchType,
  getPotentialColor,
  getConfidenceColor,
  type NearestRecordResult,
} from "@/lib/groundwater";
import { useAquaStore } from "@/store/aqua-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell,
} from "recharts";
import { GROUNDWATER_RECORDS } from "@/data/groundwater-data";
import { MethodologyPanel } from "./MethodologyPanel";
import { ResearchContextPanel } from "./ResearchView";
import { ExactLocationInput } from "./ExactLocationInput";

export function LocationAnalysisView() {
  const selected = useAquaStore((s) => s.selected);
  const setView = useAquaStore((s) => s.setView);

  const nearest: NearestRecordResult | null = useMemo(() => {
    if (!selected) return null;
    return findNearestRecord(selected.lat, selected.lng);
  }, [selected]);

  const match = nearest ? describeMatchType(nearest.distanceKm) : null;

  const scatterData = useMemo(
    () =>
      GROUNDWATER_RECORDS.map((r) => ({
        x: r.lng,
        y: r.lat,
        z: r.depthAvg,
        name: r.name,
        potential: r.potential,
        color: getPotentialColor(r.potential),
        depth: r.depthAvg,
      })),
    [],
  );

  if (!selected || !nearest || !match) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Location Analysis
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Select a location on the map or from the dashboard to view its groundwater analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="flex flex-col items-center justify-center gap-4 px-6 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <p className="text-base font-medium text-foreground">
                No location selected yet
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Pick a surveyed town, click the map, or enter exact coordinates.
              </p>
            </div>
            <Button onClick={() => setView("map")}>
              <Crosshair className="mr-2 h-4 w-4" />
              Open the map
            </Button>
          </Card>

          <Card className="p-5">
            <ExactLocationInput />
          </Card>
        </div>
      </div>
    );
  }

  const record = nearest.record;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView("map")}
            className="mb-2 -ml-2 text-muted-foreground"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to map
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {selected.label ? selected.label : "Selected point"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Lat {selected.lat.toFixed(4)} · Lng {selected.lng.toFixed(4)} · Tharparkar, Sindh
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <Badge
            variant="secondary"
            className={
              match.isApproximate
                ? "bg-amber-500/15 text-amber-700 hover:bg-amber-500/15"
                : "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15"
            }
          >
            {match.label}
          </Badge>
          <span className="text-[11px] text-muted-foreground">
            Nearest sample location: <strong>{record.name}</strong> ({nearest.distanceLabel})
          </span>
        </div>
      </div>

      {/* Disclaimer */}
      <Alert className="border-amber-300/60 bg-amber-50 text-amber-900">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-900">
          Illustrative estimate — not a verified measurement
        </AlertTitle>
        <AlertDescription className="text-amber-800">
          {match.description} The figures below are derived from sample
          prototype data and require field verification before any operational
          use.
        </AlertDescription>
      </Alert>

      {/* Info cards grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Groundwater presence */}
        <InfoCard
          icon={Droplets}
          label="Groundwater presence"
          value={record.isMeasured ? "Measured" : "Potential"}
          hint={
            record.isMeasured
              ? "Sample survey indicates water presence."
              : "Likely presence inferred from regional context."
          }
          accent="sky"
        />

        {/* Estimated depth */}
        <InfoCard
          icon={Gauge}
          label="Estimated groundwater depth"
          value={`${record.depthMin}–${record.depthMax} m`}
          hint={`Average ≈ ${record.depthAvg} m (illustrative)`}
          accent="emerald"
        />

        {/* Potential */}
        <InfoCard
          icon={Activity}
          label="Groundwater potential"
          value={record.potential}
          hint={`Colour-coded: ${record.potential.toLowerCase()} potential class`}
          accent={record.potential === "High" ? "emerald" : record.potential === "Medium" ? "amber" : "rose"}
        />

        {/* Water quality */}
        <InfoCard
          icon={Beaker}
          label="Water quality"
          value={record.waterQuality}
          hint="Chemical & bacterial testing required on site."
          accent="amber"
        />

        {/* Data confidence */}
        <InfoCard
          icon={Database}
          label="Data confidence"
          value={record.confidence}
          hint={record.confidence === "Low" ? "Sparse data — treat cautiously." : "Moderate confidence in the regional estimate."}
          accent={record.confidence === "High" ? "emerald" : record.confidence === "Medium" ? "amber" : "rose"}
        />

        {/* Nearest survey location */}
        <InfoCard
          icon={MapPin}
          label="Nearest survey location"
          value={record.name}
          hint={`${nearest.distanceLabel} from selected point · ${record.region}`}
          accent="sky"
        />
      </div>

      {/* Detailed info + comparison chart */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Location information panel</CardTitle>
            <CardDescription className="text-xs">
              Detailed attributes of the nearest sample record.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <DetailRow label="Town" value={record.name} />
            <DetailRow label="Region" value={record.region} />
            <DetailRow
              label="Coordinates"
              value={`${record.lat.toFixed(4)}, ${record.lng.toFixed(4)}`}
            />
            <Separator />
            <DetailRow
              label="Aquifer type"
              value={record.aquiferType}
            />
            <DetailRow
              label="Depth range"
              value={`${record.depthMin}–${record.depthMax} m (avg ${record.depthAvg} m)`}
            />
            <DetailRow
              label="Potential"
              value={
                <span
                  className="inline-flex items-center gap-2 font-medium"
                  style={{ color: getPotentialColor(record.potential) }}
                >
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: getPotentialColor(record.potential) }}
                  />
                  {record.potential}
                </span>
              }
            />
            <DetailRow label="Water quality" value={record.waterQuality} />
            <DetailRow
              label="Confidence"
              value={
                <span
                  className="font-medium"
                  style={{ color: getConfidenceColor(record.confidence) }}
                >
                  {record.confidence}
                </span>
              }
            />
            <DetailRow
              label="Last survey year"
              value={
                record.lastSurveyYear ? String(record.lastSurveyYear) : "Not available"
              }
            />
            <DetailRow label="Data source" value={record.dataSource} />
            <Separator />
            <div>
              <p className="mb-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                Notes
              </p>
              <p className="text-[13px] leading-relaxed text-foreground/80">
                {record.notes}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Comparison chart */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Layers3 className="h-4 w-4 text-sky-600" />
              Groundwater comparison
            </CardTitle>
            <CardDescription className="text-xs">
              Sample town positions (longitude × latitude) — bubble size = estimated depth. Selected nearest town highlighted.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 12, right: 12, bottom: 24, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Longitude"
                    domain={["dataMin - 0.05", "dataMax + 0.05"]}
                    tickFormatter={(v) => v.toFixed(2)}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    label={{
                      value: "Longitude (°E)",
                      position: "insideBottom",
                      offset: -12,
                      style: { fontSize: 11, fill: "hsl(var(--muted-foreground))" },
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Latitude"
                    domain={["dataMin - 0.05", "dataMax + 0.05"]}
                    tickFormatter={(v) => v.toFixed(2)}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    label={{
                      value: "Latitude (°N)",
                      angle: -90,
                      position: "insideLeft",
                      offset: 12,
                      style: { fontSize: 11, fill: "hsl(var(--muted-foreground))" },
                    }}
                  />
                  <ZAxis
                    type="number"
                    dataKey="z"
                    range={[80, 600]}
                    name="Depth (m)"
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const p = payload[0].payload as {
                        name: string;
                        depth: number;
                        potential: string;
                      };
                      return (
                        <div className="rounded-lg border border-border bg-white p-2 text-xs shadow-md">
                          <p className="font-semibold text-foreground">{p.name}</p>
                          <p className="text-muted-foreground">
                            Depth avg: <span className="text-foreground">{p.depth} m</span>
                          </p>
                          <p className="text-muted-foreground">
                            Potential:{" "}
                            <span className="text-foreground">{p.potential}</span>
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Scatter data={scatterData}>
                    {scatterData.map((d, i) => (
                      <Cell
                        key={d.name}
                        fill={d.name === record.name ? "#0ea5e9" : d.color}
                        stroke={d.name === record.name ? "#0369a1" : "none"}
                        strokeWidth={d.name === record.name ? 2 : 0}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
              The highlighted bubble marks <strong>{record.name}</strong>, the nearest sample location to your selected point.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Methodology + research context */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <MethodologyPanel
          selectedLat={selected.lat}
          selectedLng={selected.lng}
          nearestTown={record.name}
          nearestDistanceKm={nearest.distanceKm}
          isApproximate={match.isApproximate}
        />
        <ResearchContextPanel
          region={record.region}
          tags={[
            "depth",
            "aquifer",
            "water-quality",
            "fluoride",
            "coalfield",
            "nagarparkar",
            "geology",
            "methodology",
          ]}
        />
      </div>
    </div>
  );
}

interface InfoCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  hint?: string;
  accent?: "sky" | "emerald" | "amber" | "rose";
}

const ACCENT_MAP: Record<NonNullable<InfoCardProps["accent"]>, string> = {
  sky: "from-sky-500/15 to-sky-500/5 text-sky-700",
  emerald: "from-emerald-500/15 to-emerald-500/5 text-emerald-700",
  amber: "from-amber-500/15 to-amber-500/5 text-amber-700",
  rose: "from-rose-500/15 to-rose-500/5 text-rose-700",
};

const ICON_BG: Record<NonNullable<InfoCardProps["accent"]>, string> = {
  sky: "bg-sky-500/15 text-sky-600",
  emerald: "bg-emerald-500/15 text-emerald-600",
  amber: "bg-amber-500/15 text-amber-600",
  rose: "bg-rose-500/15 text-rose-600",
};

function InfoCard({ icon: Icon, label, value, hint, accent = "sky" }: InfoCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${ACCENT_MAP[accent]}`}
      />
      <CardContent className="relative flex items-start gap-3 p-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${ICON_BG[accent]}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-0.5 truncate text-lg font-semibold text-foreground">
            {value}
          </p>
          {hint ? (
            <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
              {hint}
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="text-[13px] font-medium text-foreground sm:text-right">
        {value}
      </span>
    </div>
  );
}
