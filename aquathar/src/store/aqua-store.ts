/**
 * AquaThar — shared client state.
 *
 * A single source of truth for the active "page" (view) and the currently
 * selected location. Kept deliberately tiny: only the bits of UI state that
 * more than one component needs to read or mutate.
 */

import { create } from "zustand";

export type AquaView = "dashboard" | "map" | "analysis" | "research" | "about";

export interface SelectedLocation {
  lat: number;
  lng: number;
  /** Optional human label (e.g. "Mithi" when picked from the search box). */
  label?: string;
  /** Optional record id when the user picked a known surveyed town. */
  recordId?: string;
}

interface AquaState {
  view: AquaView;
  selected: SelectedLocation | null;

  setView: (view: AquaView) => void;
  selectLocation: (loc: SelectedLocation) => void;
  clearSelection: () => void;
}

export const useAquaStore = create<AquaState>((set) => ({
  view: "dashboard",
  selected: null,
  setView: (view) => set({ view }),
  selectLocation: (loc) => set({ selected: loc, view: "analysis" }),
  clearSelection: () => set({ selected: null }),
}));
