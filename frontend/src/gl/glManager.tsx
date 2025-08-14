import { GoldenLayout, LayoutConfig, ResolvedLayoutConfig } from 'golden-layout';
import { createRoot } from 'react-dom/client';
import { PANELS, PanelKey } from './panels';

const STORAGE_KEY = 'fpapp_gl_v1';

class GLManager {
  private gl?: GoldenLayout;

  init() {
    if (this.gl) return;
    const rootEl = document.getElementById('gl-root');
    if (!rootEl) return;

    this.gl = new GoldenLayout(rootEl);

    PANELS.forEach((p) => {
      this.gl!.registerComponentFactoryFunction(p.key, (container, state) => {
        const div = document.createElement('div');
        container.element.appendChild(div);
        const root = createRoot(div);
        root.render(<p.component {...(state as any)} />);
        container.on('destroy', () => root.unmount());
      });
    });

    const saved = localStorage.getItem(STORAGE_KEY);
    let config: LayoutConfig | ResolvedLayoutConfig = defaultLayout;
    if (saved) {
      try {
        config = JSON.parse(saved);
      } catch {
        config = defaultLayout;
      }
    }
    this.gl.loadLayout(config);
    this.gl.on('stateChanged', () => {
      const current = this.gl?.saveLayout();
      if (current) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      }
    });
  }

  open(key: PanelKey, opts?: { newInstance?: boolean; state?: any }) {
    if (!this.gl) return;
    if (!opts?.newInstance && this.activateIfExists(key)) return;
    this.gl.addComponent(key, opts?.state);
  }

  activateIfExists(key: PanelKey): boolean {
    if (!this.gl) return false;
    const root = this.gl.root;
    if (!root) return false;
    const items = root.getItemsByFilter((item) => {
      return (item.type === 'component' && (item as any).componentType === key);
    });
    if (items.length > 0) {
      items[0].focus();
      return true;
    }
    return false;
  }
}

export const glManager = new GLManager();

const defaultLayout: LayoutConfig = {
  root: {
    type: 'row',
    content: [
      { type: 'component', componentType: 'dashboard', title: 'ダッシュボード' },
      { type: 'component', componentType: 'data-entry', title: 'データ入力' },
      { type: 'component', componentType: 'list', title: '一覧' },
    ],
  },
};
