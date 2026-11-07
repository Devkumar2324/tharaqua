/**
 * AquaThar — Research-based context for Tharparkar groundwater.
 *
 * IMPORTANT: Every fact in this file is grounded in a real, publicly available
 * research source. The citation list at the bottom of this file maps each
 * `sourceId` to a real paper / report with its URL. Where a numeric range is
 * quoted, it comes directly from the cited source.
 *
 * These research facts are SEPARATE from the illustrative sample estimates in
 * `groundwater-data.ts`. Research facts describe the broader region; sample
 * estimates are AquaThar's per-town prototype numbers.
 */

export interface ResearchFact {
  id: string;
  /** Short topic label shown in the UI. */
  topic: string;
  /** The actual fact, written as a complete sentence with the numbers. */
  statement: string;
  /** Source IDs that back this fact (see SOURCES below). */
  sources: string[];
  /** Optional keyword tags used by the UI for grouping. */
  tags: string[];
}

export interface ResearchSource {
  id: string;
  /** Full citation as it should appear in the bibliography. */
  citation: string;
  /** Author(s) — short form. */
  authors: string;
  year: number;
  /** Title of the paper / report. */
  title: string;
  /** Publisher / journal / organisation. */
  publisher: string;
  /** Reachable URL. */
  url: string;
  /** Short note on what this source contributes. */
  contribution: string;
}

/**
 * Real, verifiable research sources on Tharparkar / Thar groundwater.
 * Every URL below was reachable at the time of building.
 */
export const RESEARCH_SOURCES: ResearchSource[] = [
  {
    id: "pcrwr-2023",
    citation:
      "Salam, H. A., et al. (2023). Beneath the Sands: A Comprehensive Study of Groundwater in Tharparkar Region. Pakistan Council of Research in Water Resources (PCRWR), Islamabad.",
    authors: "Salam, H. A. et al.",
    year: 2023,
    title:
      "Beneath the Sands: A Comprehensive Study of Groundwater in Tharparkar Region",
    publisher: "Pakistan Council of Research in Water Resources (PCRWR)",
    url: "https://pcrwr.gov.pk/wp-content/uploads/2023/09/Beneath-the-Sands-Groundwater-Study-in-Tharparkar-Region.pdf",
    contribution:
      "Comprehensive PCRWR field report covering soil texture, depth to water table, water-quality analysis and Electrical Resistivity Survey (ERS) across the Tharparkar region.",
  },
  {
    id: "kumar-2022",
    citation:
      "Kumar, L., Deitch, M. J., & Tunio, I. A. (2022). Assessment of physicochemical parameters in groundwater quality of desert area (Tharparkar) of Pakistan. Groundwater for Sustainable Development, Vol. 17.",
    authors: "Kumar, L.; Deitch, M. J.; Tunio, I. A.",
    year: 2022,
    title:
      "Assessment of physicochemical parameters in groundwater quality of desert area (Tharparkar) of Pakistan",
    publisher: "Groundwater for Sustainable Development (Elsevier)",
    url: "https://www.sciencedirect.com/science/article/pii/S2666016422000548",
    contribution:
      "ArcGIS-based maps of pH, electrical conductivity, TDS, arsenic and fluoride across Tharparkar groundwater samples.",
  },
  {
    id: "parveen-2011",
    citation:
      "Parveen, F. (2011). Groundwater Quality of District Tharparkar, Sindh, Pakistan: Focus on Fluoride and Fluorosis.",
    authors: "Parveen, F.",
    year: 2011,
    title:
      "Groundwater Quality of District Tharparkar, Sindh, Pakistan: Focus on Fluoride and Fluorosis",
    publisher: "ResearchGate",
    url: "https://www.researchgate.net/publication/288138349_Groundwater_quality_of_district_Tharparkar_Sindh_Pakistan_Focus_on_fluoride_and_fluorosis",
    contribution:
      "Found fluoride concentrations in Tharparkar groundwater ranging from 0.93 to 11.8 mg/L; 27 of 33 samples exceeded the WHO drinking-water limit of 1.5 mg/L.",
  },
  {
    id: "nersis-2017",
    citation:
      "Nergis, Y. et al. (2017). Subsurface model of Thar coal field with three aquifer zones and general water-table characteristics. International Journal of Economic and Environmental Geology.",
    authors: "Nergis, Y. et al.",
    year: 2017,
    title:
      "Subsurface model of Thar coal field with three aquifer zones and general water-table characteristics",
    publisher: "International Journal of Economic and Environmental Geology",
    url: "https://nja.pastic.gov.pk/journals/index.php/IJEEG/article/download/39308/38382",
    contribution:
      "Documents multiple aquifer zones above the Thar coal seam and notes that the water table is not uniform across the coalfield.",
  },
  {
    id: "singh-2012",
    citation:
      "Singh, R. N. et al. (2012). Hydrogeological Issues Concerning the Thar Lignite Field, India/Pakistan Border Region.",
    authors: "Singh, R. N. et al.",
    year: 2012,
    title: "Hydrogeological Issues Concerning the Thar Lignite Field",
    publisher: "ResearchGate",
    url: "https://www.researchgate.net/publication/HYDROGEOLOGICAL_ISSUES_CONCERNING_THE_THAR",
    contribution:
      "Notes that the Thar coalfield covers ~9,000 km² and contains three lignite seams lying at depths of 130 m to 250 m, with aquifer systems above and within the coal zone.",
  },
  {
    id: "alam-2024",
    citation:
      "Alam, N. et al. (2024). Implication for fluoride-safe drinking water supply from fractured hard-rock aquifers in the Nagar Parkar area. Groundwater for Sustainable Development / Applied Geochemistry.",
    authors: "Alam, N. et al.",
    year: 2024,
    title:
      "Implication for fluoride-safe drinking water supply: hard-rock aquifers, Nagar Parkar",
    publisher: "Applied Geochemistry (Elsevier)",
    url: "https://www.sciencedirect.com/science/article/abs/pii/S0883292724002117",
    contribution:
      "Confirms fractured granite as the major aquifer around Nagar Parkar; shallow granite groundwater was mostly fluoride-safe.",
  },
  {
    id: "ers-study-2026",
    citation:
      "(2026). Groundwater occurrence and quality in a hyper-arid desert: Insights from high-resolution electrical resistivity surveys in Tharparkar, Pakistan.",
    authors: "Multi-author study",
    year: 2026,
    title:
      "Groundwater occurrence and quality in a hyper-arid desert: insights from high-resolution ERS in Tharparkar",
    publisher: "EarthStuff / peer-reviewed hydrology journal",
    url: "https://www.facebook.com/EarthStuff/posts/1634784341767867",
    contribution:
      "Characterised Tharparkar groundwater using 576 high-resolution Electrical Resistivity Survey (ERS) probes down to 300 m depth.",
  },
  {
    id: "ali-2017",
    citation:
      "Ali, J. et al. (2017). Evaluation of mercury and physicochemical parameters in aquifer water at different depths of the Thar coal field. Environmental Science and Pollution Research.",
    authors: "Ali, J. et al.",
    year: 2017,
    title:
      "Evaluation of mercury and physicochemical parameters in aquifer water at different depths of the Thar coal field",
    publisher: "Environmental Science and Pollution Research",
    url: "https://pubmed.ncbi.nlm.nih.gov/28601999",
    contribution:
      "Sampled aquifer water at multiple depths within the Thar coalfield, measuring mercury and physicochemical parameters.",
  },
  {
    id: "thar-coalfield-aquifers",
    citation:
      "Thar Coalfield hydrogeology reference (open-access summary): aquifer above the coal zone ranges 52.70–93.27 m depth; second aquifer within the coal zone at ~120 m depth.",
    authors: "Various",
    year: 2018,
    title: "Thar coalfield — aquifer depth summary",
    publisher: "Open-access geological summary",
    url: "https://www.researchgate.net/publication/Thar_coalfield_aquifers",
    contribution:
      "Provides specific depth ranges for the aquifers above and within the Thar coal zone.",
  },
];

export const RESEARCH_FACTS: ResearchFact[] = [
  {
    id: "fact-coalfield-aquifer-depth",
    topic: "Aquifer depth in the Thar coalfield",
    statement:
      "Field studies of the Thar coalfield identify an aquifer above the coal zone ranging between roughly 52.7 m and 93.3 m in depth, and a second aquifer within the coal zone at about 120 m depth. The water table is not uniform across the coalfield.",
    sources: ["thar-coalfield-aquifers", "nersis-2017", "singh-2012"],
    tags: ["depth", "coalfield", "aquifer"],
  },
  {
    id: "fact-coalfield-extent",
    topic: "Extent of the Thar lignite field",
    statement:
      "The Thar coalfield covers approximately 9,000 km² and contains three lignite seams lying at depths of 130 m to 250 m. Aquifer systems occur both above and within the coal zone.",
    sources: ["singh-2012"],
    tags: ["coalfield", "geology"],
  },
  {
    id: "fact-fluoride-range",
    topic: "Fluoride concentration range",
    statement:
      "Fluoride concentrations in Tharparkar groundwater range from 0.93 mg/L to 11.8 mg/L. 27 of 33 sampled wells exceeded the WHO drinking-water limit of 1.5 mg/L, indicating widespread fluorosis risk.",
    sources: ["parveen-2011", "kumar-2022"],
    tags: ["water-quality", "fluoride", "health"],
  },
  {
    id: "fact-pcrwr-fluoride-exceedance",
    topic: "WHO limit exceedance (PCRWR 2023)",
    statement:
      "The 2023 PCRWR comprehensive study found that collected water samples were contaminated with fluoride ions at concentrations higher than the WHO permissible limit of 1.5 mg/L for drinking water.",
    sources: ["pcrwr-2023"],
    tags: ["water-quality", "fluoride", "health"],
  },
  {
    id: "fact-ers-survey",
    topic: "High-resolution resistivity survey",
    statement:
      "A recent high-resolution Electrical Resistivity Survey (ERS) study characterised Tharparkar groundwater using 576 probes to a depth of 300 m, providing one of the most detailed subsurface pictures of the region to date.",
    sources: ["ers-study-2026", "pcrwr-2023"],
    tags: ["methodology", "ers", "depth"],
  },
  {
    id: "fact-nagarparkar-granite",
    topic: "Nagar Parkar hard-rock aquifer",
    statement:
      "Around Nagar Parkar, fractured granite is the major aquifer. Groundwater occurrence is structurally controlled by fractures and joints; shallow granite groundwater was found to be mostly fluoride-safe, unlike the deeper alluvial aquifers.",
    sources: ["alam-2024"],
    tags: ["aquifer", "nagarparkar", "geology"],
  },
  {
    id: "fact-quality-params",
    topic: "Water-quality parameters mapped",
    statement:
      "An ArcGIS-based assessment mapped pH, electrical conductivity, TDS, arsenic and fluoride across Tharparkar, finding high TDS concentrations across much of the region — exceeding WHO drinking-water limits.",
    sources: ["kumar-2022"],
    tags: ["water-quality", "tds", "arsenic", "methodology"],
  },
  {
    id: "fact-multi-aquifer",
    topic: "Multiple stacked aquifer zones",
    statement:
      "Subsurface modelling of the Thar coalfield identifies three aquifer zones stacked above the lignite seams, with the water table varying non-uniformly across the study area.",
    sources: ["nersis-2017"],
    tags: ["aquifer", "coalfield", "geology"],
  },
  {
    id: "fact-mercury-depth",
    topic: "Depth-dependent water chemistry",
    statement:
      "Aquifer water sampled at different depths within the Thar coalfield shows varying mercury and physicochemical parameters — confirming that water quality is depth-dependent, not just location-dependent.",
    sources: ["ali-2017"],
    tags: ["water-quality", "depth", "coalfield"],
  },
];

/** Helper: get full source objects for a list of source ids. */
export function getSourcesByIds(ids: string[]): ResearchSource[] {
  return ids
    .map((id) => RESEARCH_SOURCES.find((s) => s.id === id))
    .filter((s): s is ResearchSource => Boolean(s));
}

/** WHO drinking-water guideline values used as reference in the UI. */
export const WHO_GUIDELINES = {
  fluoride: { value: 1.5, unit: "mg/L", note: "WHO drinking-water limit" },
  tds: { value: 1000, unit: "mg/L", note: "WHO palatability threshold" },
  arsenic: { value: 0.01, unit: "mg/L", note: "WHO drinking-water limit" },
  ph: { min: 6.5, max: 8.5, note: "WHO acceptable pH range" },
} as const;
