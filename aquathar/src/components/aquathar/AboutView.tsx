"use client";

import {
  Droplets,
  Map as MapIcon,
  BarChart3,
  ShieldAlert,
  Github,
  Compass,
  Target,
  Code2,
  Layers,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAquaStore } from "@/store/aqua-store";

export function AboutView() {
  const setView = useAquaStore((s) => s.setView);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-sky-600 via-sky-700 to-emerald-700 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_30%,white_0,transparent_40%),radial-gradient(circle_at_80%_70%,white_0,transparent_45%)]" />
        <CardContent className="relative px-8 py-10 sm:px-12 sm:py-14">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <Droplets className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-sky-200">
                About
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                AquaThar — Groundwater Intelligence System
              </h1>
            </div>
          </div>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-sky-50">
            AquaThar is a hackathon prototype that helps communities,
            researchers and decision-makers explore estimated groundwater
            availability and depth across Tharparkar, Sindh, Pakistan. Users can
            search a town or click anywhere on an interactive map to view
            groundwater potential, estimated depth, water-quality status, data
            confidence and the nearest surveyed sample location.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge className="bg-white/15 text-white hover:bg-white/20">
              Next.js 16 · App Router
            </Badge>
            <Badge className="bg-white/15 text-white hover:bg-white/20">
              TypeScript
            </Badge>
            <Badge className="bg-white/15 text-white hover:bg-white/20">
              Tailwind CSS 4
            </Badge>
            <Badge className="bg-white/15 text-white hover:bg-white/20">
              Leaflet + OpenStreetMap
            </Badge>
            <Badge className="bg-white/15 text-white hover:bg-white/20">
              Recharts
            </Badge>
            <Badge className="bg-white/15 text-white hover:bg-white/20">
              Vercel-ready
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer (critical) */}
      <Alert className="border-amber-300/60 bg-amber-50 text-amber-900">
        <ShieldAlert className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-900">
          Important data disclaimer
        </AlertTitle>
        <AlertDescription className="text-amber-800">
          All groundwater figures shown in AquaThar are{" "}
          <strong>illustrative sample estimates</strong> created for this
          hackathon prototype. They are <strong>not verified field
          measurements</strong> and must not be treated as official research
          data or used for any operational, drilling, agricultural, drinking-water
          or planning decision. Always perform on-site hydrogeological surveys
          and consult certified professionals before relying on groundwater
          information.
        </AlertDescription>
      </Alert>

      {/* What it does */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <FeatureCard
          icon={MapIcon}
          title="Interactive map"
          description="Search any surveyed town or click anywhere on the map. Colored markers indicate groundwater potential class."
        />
        <FeatureCard
          icon={Compass}
          title="Nearest-match logic"
          description="For any selected point, AquaThar finds the nearest surveyed location and clearly labels whether the result is a near-match or an approximate regional estimate."
        />
        <FeatureCard
          icon={BarChart3}
          title="Dashboard & analysis"
          description="Surveyed locations count, potential distribution, depth comparison and a per-location information panel with confidence and aquifer context."
        />
      </div>

      {/* Pages overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Application sections</CardTitle>
          <CardDescription className="text-xs">
            AquaThar is a single-page application with four logical sections.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <PageLink
            n="01"
            title="Dashboard"
            desc="Overview stats, charts and the full sample-locations table."
            onClick={() => setView("dashboard")}
          />
          <PageLink
            n="02"
            title="Groundwater Map"
            desc="Interactive Leaflet / OpenStreetMap with color-coded markers."
            onClick={() => setView("map")}
          />
          <PageLink
            n="03"
            title="Location Analysis"
            desc="Per-location depth, potential, quality, confidence and notes."
            onClick={() => setView("analysis")}
          />
          <PageLink
            n="04"
            title="About AquaThar"
            desc="Project background, technology and disclaimers."
            onClick={() => setView("about")}
          />
        </CardContent>
      </Card>

      {/* How it works */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4 text-sky-600" />
              How AquaThar works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-foreground/80">
            <Step
              n={1}
              text="A small local JSON dataset defines five illustrative sample locations in Tharparkar (Mithi, Islamkot, Diplo, Nagarparkar and Chachro) with estimated depth ranges, potential, water quality and confidence."
            />
            <Step
              n={2}
              text="When you click the map, AquaThar uses the haversine formula to find the nearest sample record to your clicked coordinate."
            />
            <Step
              n={3}
              text="If the click is within ~15 km of a sample location it is labelled a “near match”; otherwise it is explicitly flagged as an “approximate regional estimate”."
            />
            <Step
              n={4}
              text="The location-analysis panel shows groundwater presence, estimated depth, potential, water quality, data confidence and the nearest surveyed town — with a clear “illustrative estimate” disclaimer."
            />
            <Step
              n={5}
              text="No backend, no paid APIs, no authentication. Leaflet maps load on the client only via dynamic import with SSR disabled."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Code2 className="h-4 w-4 text-emerald-600" />
              Technology stack
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <StackRow k="Framework" v="Next.js 16 (App Router)" />
              <StackRow k="Language" v="TypeScript" />
              <StackRow k="Styling" v="Tailwind CSS 4 + shadcn/ui" />
              <StackRow k="Mapping" v="Leaflet + react-leaflet" />
              <StackRow k="Tiles" v="OpenStreetMap" />
              <StackRow k="Charts" v="Recharts" />
              <StackRow k="State" v="Zustand" />
              <StackRow k="Hosting" v="Vercel-ready" />
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Sample coverage */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Layers className="h-4 w-4 text-sky-600" />
            Sample dataset coverage
          </CardTitle>
          <CardDescription className="text-xs">
            Five illustrative towns across the Tharparkar region. Coordinates are
            approximate. <strong>All values are illustrative — not verified.</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              "Mithi — Central Tharparkar",
              "Islamkot — Eastern Tharparkar",
              "Diplo — Western Tharparkar",
              "Nagarparkar — South-Eastern Tharparkar",
              "Chachro — Northern Tharparkar",
            ].map((t) => (
              <Badge
                key={t}
                variant="secondary"
                className="bg-sky-50 text-sky-700 hover:bg-sky-100"
              >
                {t}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card className="bg-gradient-to-br from-emerald-50 to-sky-50">
        <CardContent className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base font-semibold text-foreground">
              Ready to explore Tharparkar groundwater data?
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Open the interactive map and click anywhere to begin.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setView("map")}>
              <MapIcon className="mr-2 h-4 w-4" /> Open map
            </Button>
            <Button variant="outline" asChild>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer noopener"
              >
                <Github className="mr-2 h-4 w-4" /> View on GitHub
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
          <Icon className="h-5 w-5" />
        </div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

function PageLink({
  n,
  title,
  desc,
  onClick,
}: {
  n: string;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-sky-300 hover:bg-sky-50/40"
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-sky-600">
        {n}
      </p>
      <p className="mt-1 text-sm font-medium text-foreground group-hover:text-sky-700">
        {title}
      </p>
      <p className="mt-1 text-[12px] leading-snug text-muted-foreground">
        {desc}
      </p>
    </button>
  );
}

function Step({ n, text }: { n: number; text: string }) {
  return (
    <div className="flex gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-100 text-[11px] font-semibold text-sky-700">
        {n}
      </span>
      <p className="text-[13px] leading-relaxed text-foreground/80">{text}</p>
    </div>
  );
}

function StackRow({ k, v }: { k: string; v: string }) {
  return (
    <li className="flex items-center justify-between gap-2 border-b border-border/60 pb-1.5 last:border-0 last:pb-0">
      <span className="text-[12px] uppercase tracking-wider text-muted-foreground">
        {k}
      </span>
      <span className="text-[13px] font-medium text-foreground">{v}</span>
    </li>
  );
}
