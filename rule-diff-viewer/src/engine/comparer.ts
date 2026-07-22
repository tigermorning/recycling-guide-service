import { 資料 } from "tshet-uinh";
import type { CompiledDeriver, ComparisonResult, DifferenceRow } from "../types";

function getRepresentativeChar(position: unknown): string {
  const entries = 資料.query音韻地位(position as Parameters<typeof 資料.query音韻地位>[0]);
  const guangyunEntry = entries.find(
    (e) => e.來源 && "文獻" in e.來源 && e.來源.文獻 === "廣韻"
  );
  return guangyunEntry?.字頭 ?? entries[0]?.字頭 ?? "";
}

function getOpenness(pos: unknown): string {
  const p = pos as { 呼: string | null };
  return p.呼 ?? "中立";
}

function getInitial(pos: unknown): string {
  return (pos as { 母: string }).母;
}

function getRhyme(pos: unknown): string {
  return (pos as { 韻: string }).韻;
}

function getDivision(pos: unknown): string {
  return (pos as { 等: string }).等;
}

function getTone(pos: unknown): string {
  return (pos as { 聲: string }).聲;
}

function getPositionDescription(pos: unknown): string {
  return (pos as { 描述: string }).描述;
}

export function compareSystems(
  systemA: CompiledDeriver,
  systemB: CompiledDeriver,
  onProgress?: (current: number, total: number) => void
): ComparisonResult {
  const allPositions = Array.from(資料.iter音韻地位());
  const totalPositions = allPositions.length;
  const differences: DifferenceRow[] = [];
  let errors = 0;

  for (let i = 0; i < totalPositions; i++) {
    const position = allPositions[i];

    let resultA: string;
    let resultB: string;
    try {
      resultA = systemA.derive(position);
    } catch {
      resultA = "";
      errors++;
    }
    try {
      resultB = systemB.derive(position);
    } catch {
      resultB = "";
      errors++;
    }

    if (resultA !== resultB) {
      differences.push({
        position: getPositionDescription(position),
        representativeChar: getRepresentativeChar(position),
        initial: getInitial(position),
        rhyme: getRhyme(position),
        division: getDivision(position),
        openness: getOpenness(position),
        tone: getTone(position),
        resultA,
        resultB,
      });
    }

    if (onProgress && i % 200 === 0) {
      onProgress(i, totalPositions);
    }
  }

  return { totalPositions, differences, errors };
}
