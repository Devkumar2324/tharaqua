"use client";

import {
  Calculator,
  Layers,
  Radar,
  ShieldAlert,
  Route,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Methodology panel — explains how AquaThar derives the values shown
 * for a selected point. Shown on the Location Analysis page so the user
 * can see exactly how the answer was produced.
 */
export function MethodologyPanel({
  selectedLat,
  selectedLng,
  nearestTown,
  nearestDistanceKm,
  isApproximate,
}: {
  selectedLat: number;
  selectedLng: number;
  nearestTown: string;
  nearestDistanceKm: number;
  isApproximate: boolean;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Calculator className="h-4 w-4 text-sky-600" />
          How this answer was produced
        </CardTitle>
        <CardDescription className="text-xs">
          A transparent, step-by-step trace of how AquaThar turned your
          selected point into the groundwater estimate shown above.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Step
          n={1}
          icon={Route}
          title="Capture your exact point"
          body={
            <>
              We took your exact input coordinates:{" "}
              <span className="font-mono text-foreground">
                {selectedLat.toFixed(6)}°, {selectedLng.toFixed(6)}°
              </span>
              . This is treated as a precise point on the Earth&apos;s surface —
              not a town centroid.
            </>
          }
        />

        <Step
          n={2}
          icon={Calculator}
          title="Compute great-circle distance to every surveyed town"
          body={
            <>
              Using the <strong>haversine formula</strong> (great-circle
              distance on a sphere of radius 6,371 km), AquaThar computed the
              distance from your point to each of the 5 sample towns in the
              dataset. The nearest town is{" "}
              <strong>{nearestTown}</strong> at{" "}
              <strong>{Math.round(nearestDistanceKm * 10) / 10} km</strong>.
            </>
          }
        />

        <Step
          n={3}
          icon={Radar}
          title="Classify the match"
          body={
            isApproximate ? (
              <>
                Because the distance ({Math.round(nearestDistanceKm * 10) / 10}{" "}
                km) exceeds the 15 km threshold, the result is classified as an{" "}
                <strong className="text-amber-700">
                  Approximate regional estimate
                </strong>{" "}
                — the values shown are inherited from the nearest sample town
                but should be treated with extra caution.
              </>
            ) : (
              <>
                Because the distance ({Math.round(nearestDistanceKm * 10) / 10}{" "}
                km) is within the 15 km threshold, the result is classified as
                a <strong className="text-emerald-700">Near sample match</strong>{" "}
                — the values shown are taken from a nearby surveyed town.
              </>
            )
          }
        />

        <Step
          n={4}
          icon={Layers}
          title="Inherit sample-record attributes"
          body={
            <>
              The depth range, potential class, water quality and confidence
              values are inherited from the nearest sample record. These are{" "}
              <strong>illustrative prototype estimates</strong>, not field
              measurements.
            </>
          }
        />

        <Step
          n={5}
          icon={ShieldAlert}
          title="Add research-based context"
          body={
            <>
              Alongside the sample estimate, AquaThar surfaces real cited
              hydrogeological research about the same region (see the
              &quot;Research context&quot; card below). The research facts come
              from PCRWR, Elsevier journals and peer-reviewed hydrology studies.
            </>
          }
        />

        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-900">
          <strong>Important:</strong> the haversine distance and the match
          classification are computed exactly — those numbers are reliable. The
          depth / potential / quality values shown are illustrative and require
          field verification.
        </div>
      </CardContent>
    </Card>
  );
}

function Step({
  n,
  icon: Icon,
  title,
  body,
}: {
  n: number;
  icon: React.ElementType;
  title: string;
  body: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-[12px] font-semibold text-sky-700">
          {n}
        </span>
        <span className="mt-1 w-px flex-1 bg-border" />
      </div>
      <div className="flex-1 pb-1">
        <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          <Icon className="h-3.5 w-3.5 text-sky-600" />
          {title}
        </p>
        <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">
          {body}
        </p>
      </div>
    </div>
  );
}
