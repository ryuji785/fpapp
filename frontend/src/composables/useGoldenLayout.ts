import { ref, onMounted, provide, inject, createApp, type Component } from 'vue';
import { GoldenLayout, ComponentItem, type ComponentContainer } from 'golden-layout';
import { panelRegistry, type PanelDefinition } from '../panels';

const GoldenLayoutSymbol = Symbol('GoldenLayout');

export function provideGoldenLayout(initial: string) {
  const container = ref<HTMLElement | null>(null);
  let layout: GoldenLayout | undefined;
  const instances: Record<string, ComponentItem> = {};

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
    layout.init();
    open(initial);
  });

  function open(key: string) {
    if (!layout) return;
    const def = panelRegistry[key];
    if (!def) return;
    const existing = instances[key];
    if (existing) {
      existing.focus();
      return;
    }
    const item = layout.newComponent(def.componentName, undefined, def.title);
    instances[key] = item;
    item.on('destroy', () => {
      delete instances[key];
    });
  }

  provide(GoldenLayoutSymbol, open);

  return { container, open };
}

export function useGoldenLayout() {
  const open = inject<(key: string) => void>(GoldenLayoutSymbol);
  if (!open) {
    throw new Error('GoldenLayout not provided');
  }
  return open;
}
