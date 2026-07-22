import { useStore } from "../store/useStore";

export default function CompareButton() {
  const { status, compare, progress } = useStore();
  const isLoading = status === "loading" || status === "comparing";

  return (
    <div className="compare-section">
      <button
        className="btn btn-primary"
        onClick={compare}
        disabled={isLoading}
      >
        {isLoading ? "Comparing..." : "Compare"}
      </button>
      {progress && (
        <span className="progress-text">
          {progress.current.toLocaleString()} / {progress.total.toLocaleString()}
        </span>
      )}
    </div>
  );
}
