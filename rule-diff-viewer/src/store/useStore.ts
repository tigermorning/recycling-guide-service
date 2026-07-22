import { create } from "zustand";
import type { SystemId, ComparisonResult, DifferenceRow, FilterState } from "../types";
import { EMPTY_FILTERS } from "../types";
import { loadDeriver } from "../engine/loader";
import { compareSystems } from "../engine/comparer";

interface AppState {
  systemA: SystemId;
  systemB: SystemId;
  setSystemA: (id: SystemId) => void;
  setSystemB: (id: SystemId) => void;

  status: "idle" | "loading" | "comparing" | "done" | "error";
  result: ComparisonResult | null;
  error: string | null;
  progress: { current: number; total: number } | null;
  compare: () => Promise<void>;

  filters: FilterState;
  setFilter: (key: keyof FilterState, value: string) => void;
  resetFilters: () => void;
  filteredRows: DifferenceRow[];
}

export const useStore = create<AppState>((set, get) => ({
  systemA: "tupa",
  systemB: "baxter",
  setSystemA: (id) => {
    set({ systemA: id, status: "idle", result: null, error: null, filteredRows: [] });
  },
  setSystemB: (id) => {
    set({ systemB: id, status: "idle", result: null, error: null, filteredRows: [] });
  },

  status: "idle",
  result: null,
  error: null,
  progress: null,
  filteredRows: [],

  compare: async () => {
    const { systemA, systemB } = get();
    if (systemA === systemB) {
      set({ error: "Please select two different systems." });
      return;
    }

    set({ status: "loading", error: null, progress: null });

    try {
      const [deriverA, deriverB] = await Promise.all([
        loadDeriver(systemA),
        loadDeriver(systemB),
      ]);

      set({ status: "comparing" });

      const result = compareSystems(deriverA, deriverB, (current, total) => {
        set({ progress: { current, total } });
      });

      set({
        status: "done",
        result,
        progress: null,
        filteredRows: result.differences,
      });
    } catch (err) {
      set({
        status: "error",
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  },

  filters: { ...EMPTY_FILTERS },
  setFilter: (key, value) => {
    const newFilters = { ...get().filters, [key]: value };
    set({ filters: newFilters });
    applyFilters(get().result, newFilters, set);
  },
  resetFilters: () => {
    set({ filters: { ...EMPTY_FILTERS } });
    applyFilters(get().result, EMPTY_FILTERS, set);
  },
}));

function applyFilters(
  result: ComparisonResult | null,
  filters: FilterState,
  set: (partial: Partial<AppState>) => void
) {
  if (!result) {
    set({ filteredRows: [] });
    return;
  }

  const filtered = result.differences.filter((row) => {
    if (filters.initial && row.initial !== filters.initial) return false;
    if (filters.rhyme && row.rhyme !== filters.rhyme) return false;
    if (filters.division && row.division !== filters.division) return false;
    if (filters.openness && row.openness !== filters.openness) return false;
    if (filters.tone && row.tone !== filters.tone) return false;
    return true;
  });

  set({ filteredRows: filtered });
}
