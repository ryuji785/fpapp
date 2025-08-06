import { ref, onMounted, provide, inject, createApp, type Component } from 'vue';
import {
  GoldenLayout,
  ComponentItem,
  type ComponentContainer,
  type LayoutConfig
} from 'golden-layout';
import { panelRegistry, type PanelDefinition } from '../panels';

const GoldenLayoutSymbol = Symbol('GoldenLayout');

export function provideGoldenLayout(initial: string) {
  const container = ref<HTMLElement | null>(null);
  let layout: GoldenLayout | undefined;
  const instances: Record<string, ComponentItem[]> = {};
  const baseConfig: LayoutConfig = {
    root: {
      type: 'row',
      content: []
    },
    settings: {
      hasHeaders: true,
      reorderEnabled: true,
      showPopoutIcon: true,
      showCloseIcon: true
    }
  };

  onMounted(() => {
    if (!container.value) return;
    layout = new GoldenLayout(container.value);
    Object.values(panelRegistry).forEach((def: PanelDefinition) => {
      layout!.registerComponentFactoryFunction(def.componentName, async (cont: ComponentContainer) => {
        const el = document.createElement('div');
        cont.element.appendChild(el);
        const comp: Component = (await def.loader()).default;
        const app = createApp(comp);
        app.mount(el);
        cont.on('destroy', () => {
          app.unmount();
        });
      });
    });

    const saved = localStorage.getItem('gl-layout');
    if (saved) {
      layout.loadLayout(JSON.parse(saved) as LayoutConfig);
    } else {
      layout.loadLayout(baseConfig);
      open(initial);
    }

    layout.on('stateChanged', () => {
      const state = layout!.saveLayout();
      localStorage.setItem('gl-layout', JSON.stringify(state));
    });
  });

  function ensureRoot() {
    if (!layout) return;
    if (!layout.rootItem) {
      layout.loadLayout(baseConfig);
    }
  }

  function open(key: string, newInstance = false) {
    if (!layout) return;
    const def = panelRegistry[key];
    if (!def) return;

    if (!newInstance) {
      const existing = instances[key]?.[0];
      if (existing) {
        existing.focus();
        return;
      }
    }

    ensureRoot();
    const id = `${key}-${Date.now()}`;
    const title = newInstance
      ? `${def.title} ${(instances[key]?.length ?? 0) + 1}`
      : def.title;
    const item = layout.newComponent(def.componentName, { id }, title);
    (instances[key] ||= []).push(item);
    item.on('destroy', () => {
      instances[key] = instances[key].filter((i) => i !== item);
    });
    item.focus();
  }

  provide(GoldenLayoutSymbol, open);

  return { container, open };
}

export function useGoldenLayout() {
  const open = inject<(key: string, newInstance?: boolean) => void>(GoldenLayoutSymbol);
  if (!open) {
    throw new Error('GoldenLayout not provided');
  }
  return open;
}
