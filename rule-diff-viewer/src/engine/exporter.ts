import type { DifferenceRow } from "../types";

function escapeCSV(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function toCSV(
  rows: DifferenceRow[],
  systemAName: string,
  systemBName: string
): string {
  const BOM = "\uFEFF";
  const header = [
    "代表字",
    "音韻地位",
    "聲母",
    "韻",
    "等",
    "開合",
    "聲",
    systemAName,
    systemBName,
  ]
    .map(escapeCSV)
    .join(",");

  const body = rows
    .map((row) =>
      [
        row.representativeChar,
        row.position,
        row.initial,
        row.rhyme,
        row.division,
        row.openness,
        row.tone,
        row.resultA,
        row.resultB,
      ]
        .map(escapeCSV)
        .join(",")
    )
    .join("\n");

  return BOM + header + "\n" + body;
}

export function downloadCSV(
  csvContent: string,
  filename: string
): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
