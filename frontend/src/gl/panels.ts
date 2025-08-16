import { Dashboard } from '../components/Dashboard';
import { DataEntry } from '../components/DataEntry';
import { List } from '../components/List';
import { FutureCF } from '../components/FutureCF';
import { LifeEvents } from '../components/LifeEvents';
import { Settings } from '../components/Settings';

export const PANELS = [
  { key: 'dashboard', title: 'ダッシュボード', component: Dashboard },
  { key: 'data-entry', title: 'データ入力', component: DataEntry },
  { key: 'list', title: '一覧', component: List },
  { key: 'future-cf', title: '将来CF', component: FutureCF },
  { key: 'life-events', title: 'ライフイベント', component: LifeEvents },
  { key: 'settings', title: '設定', component: Settings },
] as const;

export type PanelKey = typeof PANELS[number]['key'];
