import { useStore } from "../store/useStore";
import { SYSTEM_LIST } from "../lib/systems";
import type { SystemId } from "../types";

export default function SystemSelector() {
  const { systemA, systemB, setSystemA, setSystemB, status } = useStore();
  const disabled = status === "loading" || status === "comparing";

  return (
    <div className="system-selectors">
      <div className="selector-group">
        <label htmlFor="system-a">System A</label>
        <select
          id="system-a"
          value={systemA}
          onChange={(e) => setSystemA(e.target.value as SystemId)}
          disabled={disabled}
        >
          {SYSTEM_LIST.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.nameEn})
            </option>
          ))}
        </select>
      </div>
      <div className="selector-group">
        <label htmlFor="system-b">System B</label>
        <select
          id="system-b"
          value={systemB}
          onChange={(e) => setSystemB(e.target.value as SystemId)}
          disabled={disabled}
        >
          {SYSTEM_LIST.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.nameEn})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
