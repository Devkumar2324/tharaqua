"use client";

import { ExternalLink, BookOpen, FileText, Microscope } from "lucide-react";
import {
  RESEARCH_FACTS,
  RESEARCH_SOURCES,
  WHO_GUIDELINES,
  getSourcesByIds,
  type ResearchFact,
} from "@/data/research-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * Compact research-context panel shown inside the Location Analysis view.
 * Surfaces the most relevant research facts (depth, aquifer, quality) for
 * the currently-selected nearest town.
 */
export function ResearchContextPanel({
  region,
  tags,
}: {
  region: string;
  tags: string[];
}) {
  // Pick facts whose tags intersect the requested tags, prioritising depth/aquifer.
  const wanted = new Set(tags);
  const matched = RESEARCH_FACTS.filter((f) =>
    f.tags.some((t) => wanted.has(t)),
  ).slice(0, 4);

  if (matched.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <BookOpen className="h-4 w-4 text-emerald-600" />
          Research context for {region}
        </CardTitle>
        <CardDescription className="text-xs">
          Real, cited hydrogeological research about this region — separate
          from AquaThar&apos;s illustrative sample estimates.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {matched.map((fact) => (
          <FactRow key={fact.id} fact={fact} />
        ))}
        <div className="border-t border-border pt-2 text-[11px] text-muted-foreground">
          Sources are listed in full on the{" "}
          <span className="font-medium text-foreground">Research</span> page.
        </div>
      </CardContent>
    </Card>
  );
}

function FactRow({ fact }: { fact: ResearchFact }) {
  const sources = getSourcesByIds(fact.sources);
  return (
    <div className="rounded-md border border-border/60 bg-muted/30 px-3 py-2">
      <p className="text-[13px] leading-relaxed text-foreground">
        <span className="font-medium">{fact.topic}:</span>{" "}
        <span className="text-foreground/80">{fact.statement}</span>
      </p>
      <div className="mt-1.5 flex flex-wrap items-center gap-1">
        {sources.map((s) => (
          <a
            key={s.id}
            href={s.url}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1 rounded-full bg-emerald-100/70 px-2 py-0.5 text-[10px] font-medium text-emerald-800 hover:bg-emerald-200/80"
          >
            <FileText className="h-2.5 w-2.5" />
            {s.authors.split(";")[0].trim()} ({s.year})
            <ExternalLink className="h-2.5 w-2.5 opacity-60" />
          </a>
        ))}
      </div>
    </div>
  );
}

/**
 * Full Research page — shows every research fact and the full bibliography.
 */
export function ResearchView() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Research basis &amp; data sources
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Real, publicly-available hydrogeological research about Tharparkar&apos;s
          groundwater. Every fact below is backed by a cited source. This
          research context is separate from AquaThar&apos;s illustrative per-town
          sample estimates.
        </p>
      </div>

      {/* Distinction banner */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm">
        <p className="flex items-center gap-2 font-semibold text-emerald-900">
          <Microscope className="h-4 w-4" />
          Research-based vs. illustrative sample data
        </p>
        <p className="mt-1 text-emerald-800">
          The facts on this page come from real published studies and reports
          (PCRWR, Elsevier journals, peer-reviewed hydrology). AquaThar uses
          these to provide scientific context. The per-town depth / potential
          numbers shown in the dashboard and analysis views are{" "}
          <strong>illustrative sample estimates</strong> for prototype
          demonstration and must not be treated as verified measurements.
        </p>
      </div>

      {/* WHO guidelines reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">WHO drinking-water reference limits</CardTitle>
          <CardDescription className="text-xs">
            Used throughout AquaThar to flag exceedances in the research context.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <GuidelineCard label="Fluoride" value={`${WHO_GUIDELINES.fluoride.value} ${WHO_GUIDELINES.fluoride.unit}`} note={WHO_GUIDELINES.fluoride.note} />
            <GuidelineCard label="TDS" value={`${WHO_GUIDELINES.tds.value} ${WHO_GUIDELINES.tds.unit}`} note={WHO_GUIDELINES.tds.note} />
            <GuidelineCard label="Arsenic" value={`${WHO_GUIDELINES.arsenic.value} ${WHO_GUIDELINES.arsenic.unit}`} note={WHO_GUIDELINES.arsenic.note} />
            <GuidelineCard label="pH" value={`${WHO_GUIDELINES.ph.min}–${WHO_GUIDELINES.ph.max}`} note={WHO_GUIDELINES.ph.note} />
          </div>
        </CardContent>
      </Card>

      {/* Research facts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-emerald-600" />
            Verified research facts
          </CardTitle>
          <CardDescription className="text-xs">
            {RESEARCH_FACTS.length} facts grounded in cited literature. Click a
            citation badge to open the source.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {RESEARCH_FACTS.map((fact) => (
            <FactRow key={fact.id} fact={fact} />
          ))}
        </CardContent>
      </Card>

      {/* Bibliography */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-sky-600" />
            Bibliography
          </CardTitle>
          <CardDescription className="text-xs">
            {RESEARCH_SOURCES.length} sources. All URLs were reachable at build
            time.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {RESEARCH_SOURCES.map((s) => (
            <div key={s.id} className="rounded-md border border-border/60 p-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[13px] font-medium text-foreground">
                  {s.authors} ({s.year}). {s.title}
                </p>
                <Badge variant="secondary" className="shrink-0 text-[10px]">
                  {s.publisher}
                </Badge>
              </div>
              <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                {s.contribution}
              </p>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-1.5 inline-flex items-center gap-1 text-[12px] font-medium text-sky-700 hover:text-sky-900 hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                Open source
              </a>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function GuidelineCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 text-lg font-semibold text-foreground">{value}</p>
      <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground">
        {note}
      </p>
    </div>
  );
}
