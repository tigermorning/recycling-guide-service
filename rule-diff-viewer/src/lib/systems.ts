import type { SystemMeta, SystemId } from "../types";

const CDN_BASE = "https://cdn.jsdelivr.net/gh/nk2028/tshet-uinh-examples@main/";

export const SYSTEMS: Record<SystemId, SystemMeta> = {
  tupa: {
    id: "tupa",
    name: "切韻拼音",
    nameEn: "Tshet-uinh Pinyin",
    category: "romanization",
    cdnPath: `${CDN_BASE}tupa.js`,
  },
  baxter: {
    id: "baxter",
    name: "Baxter 轉寫",
    nameEn: "Baxter (1992/2014)",
    category: "romanization",
    cdnPath: `${CDN_BASE}baxter.js`,
  },
  unt: {
    id: "unt",
    name: "unt 擬音",
    nameEn: "unt Reconstruction",
    category: "reconstruction",
    cdnPath: `${CDN_BASE}unt.js`,
  },
  panwuyun: {
    id: "panwuyun",
    name: "潘悟雲 擬音",
    nameEn: "Pan Wuyun Reconstruction",
    category: "reconstruction",
    cdnPath: `${CDN_BASE}panwuyun.js`,
  },
  karlgren: {
    id: "karlgren",
    name: "高本漢 擬音",
    nameEn: "Karlgren Reconstruction",
    category: "reconstruction",
    cdnPath: `${CDN_BASE}karlgren.js`,
  },
  wangli: {
    id: "wangli",
    name: "王力 擬音",
    nameEn: "Wang Li Reconstruction",
    category: "reconstruction",
    cdnPath: `${CDN_BASE}wangli.js`,
  },
  msoeg_v8: {
    id: "msoeg_v8",
    name: "msoeg 擬音 (V8)",
    nameEn: "msoeg Reconstruction (V8)",
    category: "reconstruction",
    cdnPath: `${CDN_BASE}msoeg_v8.js`,
  },
};

export const SYSTEM_LIST: SystemMeta[] = Object.values(SYSTEMS);
export const SYSTEM_IDS: SystemId[] = Object.keys(SYSTEMS) as SystemId[];
