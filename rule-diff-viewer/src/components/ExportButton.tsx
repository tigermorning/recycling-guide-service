import { useStore } from "../store/useStore";
import { toCSV, downloadCSV } from "../engine/exporter";
import { SYSTEMS } from "../lib/systems";

export default function ExportButton() {
  const { status, filteredRows, systemA, systemB } = useStore();
  const disabled = status !== "done" || filteredRows.length === 0;

  const handleExport = () => {
    const csv = toCSV(
      filteredRows,
      SYSTEMS[systemA].name,
      SYSTEMS[systemB].name
    );
    const filename = `rule-diff-${systemA}-vs-${systemB}.csv`;
    downloadCSV(csv, filename);
  };

  return (
    <button
      className="btn btn-secondary"
      onClick={handleExport}
      disabled={disabled}
    >
      Export CSV
    </button>
  );
}
