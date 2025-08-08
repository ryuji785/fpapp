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
      popoutEnabled: true,
      closeEnabled: true,
      showPopoutIcon: true,
      showCloseIcon: true
    }
  } as unknown as LayoutConfig;

  onMounted(() => {
    if (!container.value) return;
    layout = new GoldenLayout(container.value);
    layout.resizeWithContainerAutomatically = true;
    Object.values(panelRegistry).forEach((def: PanelDefinition) => {
      layout!.registerComponentFactoryFunction(
        def.componentName,
        async (cont: ComponentContainer) => {
          const el = document.createElement('div');
          cont.element.appendChild(el);
          const comp: Component = (await def.loader()).default;
          const app = createApp(comp);
          app.mount(el);
          cont.on('destroy', () => {
            app.unmount();
          });
        }
      );
    });

    const saved = localStorage.getItem('gl-layout');
    if (saved) {
      layout.loadLayout(JSON.parse(saved) as LayoutConfig);
    } else {
      layout.loadLayout(baseConfig);
      addPanel(initial);
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
      for (const key in instances) {
        delete instances[key];
      }
    }
  }

  function addPanel(key: string) {
    if (!layout) return;
    const def = panelRegistry[key];
    if (!def) return;

    ensureRoot();
    const id = `${key}-${Date.now()}`;
    const count = (instances[key]?.length ?? 0) + 1;
    const title = count > 1 ? `${def.title} ${count}` : def.title;
    const config = {
      type: 'component' as const,
      componentType: def.componentName,
      title,
      componentState: { id }
    };
    const root = layout.rootItem;
    if (root) {
      const target = root.contentItems[0] || root;
      const item = (target as any).addChild(config) as ComponentItem;
      (instances[key] ||= []).push(item);
      item.container.on('destroy', () => {
        instances[key] = instances[key].filter((i) => i !== item);
        if (instances[key].length === 0) {
          delete instances[key];
        }
      });
      item.focus();
    }
  }

  provide(GoldenLayoutSymbol, addPanel);

  return { container, addPanel };
}

export function useGoldenLayout() {
  const addPanel = inject<(key: string) => void>(GoldenLayoutSymbol);
  if (!addPanel) {
    throw new Error('GoldenLayout not provided');
  }
  return addPanel;
}
