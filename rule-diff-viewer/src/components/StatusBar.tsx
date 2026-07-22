import { useStore } from "../store/useStore";

export default function StatusBar() {
  const { status, result, error, filteredRows } = useStore();

  if (error) {
    return <div className="status-bar status-error">{error}</div>;
  }

  if (status === "idle") {
    return <div className="status-bar">Select two systems and click Compare.</div>;
  }

  if (status === "loading") {
    return <div className="status-bar">Loading scripts...</div>;
  }

  if (status === "comparing") {
    return <div className="status-bar">Comparing...</div>;
  }

  if (status === "done" && result) {
    return (
      <div className="status-bar">
        {result.totalPositions.toLocaleString()} positions compared.
        {result.differences.length.toLocaleString()} differences found.
        {filteredRows.length !== result.differences.length &&
          ` Showing ${filteredRows.length.toLocaleString()} filtered.`}
        {result.errors > 0 && ` ${result.errors} errors.`}
      </div>
    );
  }

  return null;
}
