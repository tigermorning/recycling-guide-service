import { useMemo } from "react";
import { useStore } from "../store/useStore";
import type { FilterState } from "../types";

function getUniqueValues(
  rows: { initial: string; rhyme: string; division: string; openness: string; tone: string }[],
  key: keyof FilterState
): string[] {
  const set = new Set(rows.map((r) => r[key]));
  return Array.from(set).sort();
}

export default function FilterBar() {
  const { result, filters, setFilter, resetFilters } = useStore();

  const options = useMemo(() => {
    if (!result) return null;
    return {
      initial: getUniqueValues(result.differences, "initial"),
      rhyme: getUniqueValues(result.differences, "rhyme"),
      division: getUniqueValues(result.differences, "division"),
      openness: getUniqueValues(result.differences, "openness"),
      tone: getUniqueValues(result.differences, "tone"),
    };
  }, [result]);

  if (!options) return null;

  const filterConfigs: { key: keyof FilterState; label: string; values: string[] }[] = [
    { key: "initial", label: "聲母", values: options.initial },
    { key: "rhyme", label: "韻", values: options.rhyme },
    { key: "division", label: "等", values: options.division },
    { key: "openness", label: "開合", values: options.openness },
    { key: "tone", label: "聲", values: options.tone },
  ];

  return (
    <div className="filter-bar">
      {filterConfigs.map(({ key, label, values }) => (
        <div key={key} className="filter-group">
          <label htmlFor={`filter-${key}`}>{label}</label>
          <select
            id={`filter-${key}`}
            value={filters[key]}
            onChange={(e) => setFilter(key, e.target.value)}
          >
            <option value="">All</option>
            {values.map((v) => (
              <option key={v} value={v}>
                {v || "(empty)"}
              </option>
            ))}
          </select>
        </div>
      ))}
      <button className="btn btn-secondary" onClick={resetFilters}>
        Reset
      </button>
    </div>
  );
}
