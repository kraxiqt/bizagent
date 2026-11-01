import { create } from 'zustand';
import { storage } from '@/shared/lib/storage';

export type PanelName = 'history' | 'plan';

// Границы и ширина по умолчанию (px) для боковых панелей чата.
export const PANEL_LIMITS: Record<PanelName, { min: number; max: number; def: number }> = {
  history: { min: 200, max: 480, def: 256 },
  plan: { min: 260, max: 560, def: 320 },
};

// Сколько места всегда остаётся диалогу посередине.
const MIN_CENTER = 420;
// Брейкпоинты, с которых панели вообще видны (md и lg в Tailwind).
const HISTORY_VISIBLE_FROM = 768;
const PLAN_VISIBLE_FROM = 1024;

const STORAGE_KEY = 'chat-panels';

interface SavedWidths {
  history?: number;
  plan?: number;
}

const clamp = (panel: PanelName, value: unknown): number => {
  const { min, max, def } = PANEL_LIMITS[panel];
  if (typeof value !== 'number' || !Number.isFinite(value)) return def;
  return Math.max(min, Math.min(max, Math.round(value)));
};

// Максимум для панели с учётом окна и соседней панели, чтобы диалог не сжимался в ноль.
export function panelMax(panel: PanelName, viewport: number, otherWidth: number): number {
  const otherVisible = panel === 'history' ? viewport >= PLAN_VISIBLE_FROM : viewport >= HISTORY_VISIBLE_FROM;
  const free = viewport - (otherVisible ? otherWidth : 0) - MIN_CENTER;
  const { min, max } = PANEL_LIMITS[panel];
  return Math.max(min, Math.min(max, free));
}

interface PanelsState {
  historyWidth: number;
  planWidth: number;
  setWidth: (panel: PanelName, width: number) => void;
  resetWidth: (panel: PanelName) => void;
}

const saved = storage.get<SavedWidths>(STORAGE_KEY, {});

export const usePanelsStore = create<PanelsState>((set, get) => {
  const persist = () => {
    const { historyWidth, planWidth } = get();
    storage.set<SavedWidths>(STORAGE_KEY, { history: historyWidth, plan: planWidth });
  };
  const apply = (panel: PanelName, width: number) => {
    set(panel === 'history' ? { historyWidth: clamp(panel, width) } : { planWidth: clamp(panel, width) });
    persist();
  };

  return {
    historyWidth: clamp('history', saved.history),
    planWidth: clamp('plan', saved.plan),
    setWidth: apply,
    resetWidth: (panel) => apply(panel, PANEL_LIMITS[panel].def),
  };
});
