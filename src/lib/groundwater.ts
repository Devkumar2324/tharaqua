/**
 * Geo + groundwater utility helpers for AquaThar.
 * Pure functions — safe to use on both client and server.
 */

import {
  GROUNDWATER_RECORDS,
  type GroundwaterRecord,
  type GroundwaterPotential,
  type DataConfidence,
} from "@/data/groundwater-data";

/** Earth radius in km (mean radius, WGS-84 approximation). */
const EARTH_RADIUS_KM = 6371;

/** Convert degrees to radians. */
const toRad = (deg: number): number => (deg * Math.PI) / 180;

/**
 * Haversine great-circle distance between two coordinates, in kilometres.
 */
export function haversineKm(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number,
): number {
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

export interface NearestRecordResult {
  record: GroundwaterRecord;
  distanceKm: number;
  /** Distance from the queried point, rounded to 1 decimal place. */
  distanceLabel: string;
}

/**
 * Find the nearest sample groundwater record to a given coordinate.
 * Returns null only if the dataset is empty (defensive — never happens in practice).
 */
export function findNearestRecord(
  lat: number,
  lng: number,
): NearestRecordResult | null {
  if (GROUNDWATER_RECORDS.length === 0) return null;

  let best: NearestRecordResult | null = null;
  for (const record of GROUNDWATER_RECORDS) {
    const d = haversineKm(lat, lng, record.lat, record.lng);
    if (best === null || d < best.distanceKm) {
      best = {
        record,
        distanceKm: d,
        distanceLabel: `${Math.round(d * 10) / 10} km`,
      };
    }
  }
  return best;
}

/**
 * Decide whether the nearest record is close enough to be treated as a
 * "measured record" for the queried point, or whether it should be shown as
 * an "approximate regional estimate".
 *
 * Threshold (illustrative): within ~15 km we treat it as a near-exact match;
 * beyond that we explicitly label it as a regional estimate.
 */
export const MEASURED_THRESHOLD_KM = 15;

export function describeMatchType(distanceKm: number): {
  isApproximate: boolean;
  label: string;
  description: string;
} {
  if (distanceKm <= MEASURED_THRESHOLD_KM) {
    return {
      isApproximate: false,
      label: "Near sample location",
      description:
        "Query point is within the sample survey radius — treated as a near-match.",
    };
  }
  return {
    isApproximate: true,
    label: "Approximate regional estimate",
    description:
      "Query point is far from any sample location — shown as a regional estimate based on the nearest surveyed point.",
  };
}

/** Total count of surveyed sample locations (used by the dashboard stat). */
export const TOTAL_SURVEYED_LOCATIONS = GROUNDWATER_RECORDS.length;

/** Aggregate groundwater potential distribution. */
export interface PotentialDistribution {
  potential: GroundwaterPotential;
  count: number;
  percentage: number;
  color: string;
}

const POTENTIAL_META: Record<
  GroundwaterPotential,
  { color: string; hex: string }
> = {
  High: { color: "#16a34a", hex: "#16a34a" },
  Medium: { color: "#f59e0b", hex: "#f59e0b" },
  Low: { color: "#dc2626", hex: "#dc2626" },
};

export function getPotentialDistribution(): PotentialDistribution[] {
  const order: GroundwaterPotential[] = ["High", "Medium", "Low"];
  return order.map((potential) => {
    const count = GROUNDWATER_RECORDS.filter(
      (r) => r.potential === potential,
    ).length;
    return {
      potential,
      count,
      percentage:
        TOTAL_SURVEYED_LOCATIONS === 0
          ? 0
          : Math.round((count / TOTAL_SURVEYED_LOCATIONS) * 1000) / 10,
      color: POTENTIAL_META[potential].hex,
    };
  });
}

export function getPotentialColor(potential: GroundwaterPotential): string {
  return POTENTIAL_META[potential].hex;
}

export function getConfidenceColor(confidence: DataConfidence): string {
  switch (confidence) {
    case "High":
      return "#16a34a";
    case "Medium":
      return "#f59e0b";
    case "Low":
      return "#dc2626";
  }
}

/** Records formatted for charts (e.g. depth comparison bar chart). */
export interface ChartDatum {
  name: string;
  depthMin: number;
  depthMax: number;
  depthAvg: number;
  potential: GroundwaterPotential;
  color: string;
}

export function getDepthChartData(): ChartDatum[] {
  return GROUNDWATER_RECORDS.map((r) => ({
    name: r.name,
    depthMin: r.depthMin,
    depthMax: r.depthMax,
    depthAvg: r.depthAvg,
    potential: r.potential,
    color: getPotentialColor(r.potential),
  }));
}

/** Aggregate depth statistics across the dataset (used by dashboard cards). */
export function getDepthStats() {
  const avgs = GROUNDWATER_RECORDS.map((r) => r.depthAvg);
  const min = Math.min(...GROUNDWATER_RECORDS.map((r) => r.depthMin));
  const max = Math.max(...GROUNDWATER_RECORDS.map((r) => r.depthMax));
  const mean =
    avgs.reduce((acc, v) => acc + v, 0) / Math.max(avgs.length, 1);
  return {
    shallowest: min,
    deepest: max,
    average: Math.round(mean * 10) / 10,
  };
}
