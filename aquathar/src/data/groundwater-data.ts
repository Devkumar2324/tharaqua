/**
 * AquaThar — Groundwater Intelligence System
 * Sample dataset for Tharparkar, Sindh, Pakistan.
 *
 * IMPORTANT DISCLAIMER
 * --------------------
 * All values in this file are ILLUSTRATIVE SAMPLE ESTIMATES created for
 * hackathon / prototype demonstration purposes only. They are NOT verified
 * field measurements and MUST NOT be treated as official research data or
 * used for any operational, drilling, or planning decision. Always perform
 * on-site hydrogeological surveys before relying on groundwater data.
 */

export type GroundwaterPotential = "Low" | "Medium" | "High";
export type DataConfidence = "High" | "Medium" | "Low";
export type WaterQuality = "Unknown" | "Requires testing";

export interface GroundwaterRecord {
  id: string;
  name: string;
  district: string;
  province: string;
  country: string;
  lat: number;
  lng: number;
  /** Estimated groundwater depth range in metres (illustrative). */
  depthMin: number;
  depthMax: number;
  /** Average of the range, precomputed for convenience. */
  depthAvg: number;
  potential: GroundwaterPotential;
  waterQuality: WaterQuality;
  confidence: DataConfidence;
  aquiferType: string;
  dataSource: string;
  isMeasured: boolean;
  lastSurveyYear: number | null;
  nearestTown: string;
  notes: string;
  /** Bounding region label used for the regional estimate fallback. */
  region: string;
}

const avg = (min: number, max: number) => Math.round(((min + max) / 2) * 10) / 10;

export const GROUNDWATER_RECORDS: GroundwaterRecord[] = [
  {
    id: "mithi",
    name: "Mithi",
    district: "Tharparkar",
    province: "Sindh",
    country: "Pakistan",
    lat: 24.7408,
    lng: 69.8011,
    depthMin: 60,
    depthMax: 90,
    depthAvg: avg(60, 90),
    potential: "Medium",
    waterQuality: "Requires testing",
    confidence: "Medium",
    aquiferType: "Sandstone (Nagar Parkar formation)",
    dataSource: "Illustrative sample estimate",
    isMeasured: false,
    lastSurveyYear: null,
    nearestTown: "Mithi",
    notes:
      "District headquarters of Tharparkar. Higher population density; sample estimate assumes moderate aquifer recharge from seasonal monsoon runoff.",
    region: "Central Tharparkar",
  },
  {
    id: "islamkot",
    name: "Islamkot",
    district: "Tharparkar",
    province: "Sindh",
    country: "Pakistan",
    lat: 24.7017,
    lng: 70.1842,
    depthMin: 70,
    depthMax: 110,
    depthAvg: avg(70, 110),
    potential: "Medium",
    waterQuality: "Requires testing",
    confidence: "Medium",
    aquiferType: "Semi-consolidated sand aquifer",
    dataSource: "Illustrative sample estimate",
    isMeasured: false,
    lastSurveyYear: null,
    nearestTown: "Islamkot",
    notes:
      "Important junction town near the Thar coalfield. Sample estimate reflects deeper water table typical of eastern Thar dune belts.",
    region: "Eastern Tharparkar",
  },
  {
    id: "diplo",
    name: "Diplo",
    district: "Tharparkar",
    province: "Sindh",
    country: "Pakistan",
    lat: 24.5514,
    lng: 69.8489,
    depthMin: 50,
    depthMax: 80,
    depthAvg: avg(50, 80),
    potential: "High",
    waterQuality: "Requires testing",
    confidence: "Medium",
    aquiferType: "Alluvial / aeolian sand aquifer",
    dataSource: "Illustrative sample estimate",
    isMeasured: false,
    lastSurveyYear: null,
    nearestTown: "Diplo",
    notes:
      "Relatively shallower water table in this illustrative sample. Closer to the fertile Indus delta transition zone.",
    region: "Western Tharparkar",
  },
  {
    id: "nagarparkar",
    name: "Nagarparkar",
    district: "Tharparkar",
    province: "Sindh",
    country: "Pakistan",
    lat: 24.3586,
    lng: 70.7622,
    depthMin: 90,
    depthMax: 130,
    depthAvg: avg(90, 130),
    potential: "Low",
    waterQuality: "Unknown",
    confidence: "Low",
    aquiferType: "Fractured granitic basement (Nagar Parkar granites)",
    dataSource: "Illustrative sample estimate",
    isMeasured: false,
    lastSurveyYear: null,
    nearestTown: "Nagarparkar",
    notes:
      "Arid south-eastern edge of Thar near the Runn of Kutch. Hard-rock terrain; groundwater occurrence is structurally controlled and highly variable.",
    region: "South-Eastern Tharparkar",
  },
  {
    id: "chachro",
    name: "Chachro",
    district: "Tharparkar",
    province: "Sindh",
    country: "Pakistan",
    lat: 25.1017,
    lng: 70.2531,
    depthMin: 80,
    depthMax: 120,
    depthAvg: avg(80, 120),
    potential: "Low",
    waterQuality: "Requires testing",
    confidence: "Low",
    aquiferType: "Dune sand over semi-consolidated sandstone",
    dataSource: "Illustrative sample estimate",
    isMeasured: false,
    lastSurveyYear: null,
    nearestTown: "Chachro",
    notes:
      "Northern Thar town close to the Indian border. Sample estimate assumes deep water table with limited recharge.",
    region: "Northern Tharparkar",
  },
];

/** Approximate geographic centre used to focus the Leaflet map on first load. */
export const THARPARKAR_CENTER: [number, number] = [24.75, 70.0];
export const THARPARKAR_BOUNDS: [[number, number], [number, number]] = [
  [24.2, 69.6],
  [25.3, 70.9],
];

/** Searchable towns (used by the location search box). */
export const SEARCHABLE_TOWNS = GROUNDWATER_RECORDS.map((r) => ({
  id: r.id,
  name: r.name,
  lat: r.lat,
  lng: r.lng,
  region: r.region,
}));
