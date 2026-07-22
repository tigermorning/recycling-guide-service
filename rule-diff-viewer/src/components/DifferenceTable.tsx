import { useStore } from "../store/useStore";

export default function DifferenceTable() {
  const { filteredRows, systemA, systemB, result } = useStore();

  if (!result) return null;

  return (
    <div className="table-wrapper">
      <table className="diff-table">
        <thead>
          <tr>
            <th>代表字</th>
            <th>音韻地位</th>
            <th>聲母</th>
            <th>韻</th>
            <th>等</th>
            <th>開合</th>
            <th>聲</th>
            <th>{systemA}</th>
            <th>{systemB}</th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.map((row, i) => (
            <tr key={`${row.position}-${row.representativeChar}-${i}`}>
              <td className="char-cell">{row.representativeChar}</td>
              <td>{row.position}</td>
              <td>{row.initial}</td>
              <td>{row.rhyme}</td>
              <td>{row.division}</td>
              <td>{row.openness}</td>
              <td>{row.tone}</td>
              <td className="result-cell">{row.resultA}</td>
              <td className="result-cell">{row.resultB}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
