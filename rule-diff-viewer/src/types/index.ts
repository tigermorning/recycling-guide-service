export type SystemId =
  | "tupa"
  | "baxter"
  | "unt"
  | "panwuyun"
  | "karlgren"
  | "wangli"
  | "msoeg_v8";

export interface SystemMeta {
  id: SystemId;
  name: string;
  nameEn: string;
  category: "romanization" | "reconstruction";
  cdnPath: string;
}

export interface CompiledDeriver {
  id: SystemId;
  name: string;
  derive: (position: unknown) => string;
}

export interface DifferenceRow {
  position: string;
  representativeChar: string;
  initial: string;
  rhyme: string;
  division: string;
  openness: string;
  tone: string;
  resultA: string;
  resultB: string;
}

export interface ComparisonResult {
  totalPositions: number;
  differences: DifferenceRow[];
  errors: number;
}

export interface FilterState {
  initial: string;
  rhyme: string;
  division: string;
  openness: string;
  tone: string;
}

export const EMPTY_FILTERS: FilterState = {
  initial: "",
  rhyme: "",
  division: "",
  openness: "",
  tone: "",
};
