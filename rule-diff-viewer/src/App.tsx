import SystemSelector from "./components/SystemSelector";
import CompareButton from "./components/CompareButton";
import FilterBar from "./components/FilterBar";
import DifferenceTable from "./components/DifferenceTable";
import ExportButton from "./components/ExportButton";
import StatusBar from "./components/StatusBar";

export default function App() {
  return (
    <div className="app">
      <h1>Rule Diff Viewer</h1>
      <p className="subtitle">
        Compare historical phonology reconstruction systems
      </p>
      <div className="controls">
        <SystemSelector />
        <CompareButton />
      </div>
      <FilterBar />
      <div className="table-controls">
        <ExportButton />
      </div>
      <DifferenceTable />
      <StatusBar />
    </div>
  );
}
