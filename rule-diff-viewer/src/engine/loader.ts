import { 推導方案 } from "tshet-uinh-deriver-tools";
import type { 原始推導函數 } from "tshet-uinh-deriver-tools";
import { 音韻地位 } from "tshet-uinh";
import type { SystemId, CompiledDeriver } from "../types";
import { SYSTEMS } from "../lib/systems";

const scriptCache = new Map<SystemId, CompiledDeriver>();

function flattenResult(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.map(flattenResult).join("");
  if (typeof value === "object" && "tag" in value) {
    const node = value as { tag: unknown; children?: unknown[] };
    if (node.children) return flattenResult(node.children);
    return "";
  }
  return String(value);
}

export async function loadDeriver(
  systemId: SystemId,
  signal?: AbortSignal
): Promise<CompiledDeriver> {
  const cached = scriptCache.get(systemId);
  if (cached) return cached;

  const meta = SYSTEMS[systemId];
  const response = await fetch(meta.cdnPath, { cache: "no-cache", signal });
  if (!response.ok) {
    throw new Error(
      `Failed to load ${meta.name}: ${response.status} ${response.statusText}`
    );
  }

  const source = await response.text();
  const rawDeriver = new Function(
    "選項",
    "音韻地位",
    "字頭",
    "require",
    source
  ) as 原始推導函數<unknown>;

  const scheme = new 推導方案(rawDeriver);
  const derive = scheme.推導({});

  const wrappedDerive = (position: unknown): string => {
    try {
      const result = derive(position as 音韻地位, null);
      return flattenResult(result);
    } catch {
      return "";
    }
  };

  const compiled: CompiledDeriver = {
    id: systemId,
    name: meta.name,
    derive: wrappedDerive,
  };

  scriptCache.set(systemId, compiled);
  return compiled;
}
