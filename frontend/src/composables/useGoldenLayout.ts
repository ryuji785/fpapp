import { ref, onMounted, provide, inject, createApp, type Component } from 'vue';
import {
  GoldenLayout,
  type ComponentContainer,
  type LayoutConfig,
  ComponentItem
} from 'golden-layout'
import { panelRegistry, type PanelDefinition } from '../panels'

const GoldenLayoutSymbol = Symbol('GoldenLayout')
const STORAGE_KEY = 'gl-layout-v0.4-spa'

const baseConfig: LayoutConfig = {
  root: {
    type: 'row',
    content: [
      { type: 'stack', header: { show: 'top' }, width: 34, content: [] },
      { type: 'stack', header: { show: 'top' }, width: 33, content: [] },
      { type: 'stack', header: { show: 'top' }, width: 33, content: [] }
    ]
  },
  settings: {
    hasHeaders: true,
    reorderEnabled: true,
    popoutEnabled: true,
    closeEnabled: true,
    showPopoutIcon: true,
    showCloseIcon: true
  }
} as unknown as LayoutConfig

export function provideGoldenLayout (initial: string) {
  const container = ref<HTMLElement | null>(null)
  let layout: GoldenLayout | undefined
  const instances: Record<string, ComponentItem[]> = {}

  onMounted(() => {
    if (!container.value) return

    layout = new GoldenLayout(container.value)
    layout.resizeWithContainerAutomatically = true

    // Register components
    Object.values(panelRegistry).forEach((def: PanelDefinition) => {
      layout!.registerComponentFactoryFunction(def.componentName, async (cont: ComponentContainer) => {
        const mount = document.createElement('div')
        mount.style.height = '100%'
        cont.element.appendChild(mount)
        const comp: Component = (await def.loader()).default
        const app = createApp(comp)
        app.mount(mount)
        cont.on('destroy', () => app.unmount())
      })
    })

    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      layout.loadLayout(JSON.parse(saved) as LayoutConfig)
    } else {
      layout.loadLayout(baseConfig)
      addPanel(initial)
    }

    if (!layout.rootItem || (layout.rootItem as any).contentItems.length === 0) {
      layout.loadLayout(baseConfig)
      addPanel(initial)
    }

    layout.on('stateChanged', () => {
      const state = layout!.saveLayout()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    })
  })

  // recursively find the first stack starting from the given item
  function findFirstStack(item: any): any | null {
    if (!item) return null;
    if (item.isStack) return item;
    const children = item.contentItems as any[] | undefined;
    if (!children) return null;
    for (const child of children) {
      const found = findFirstStack(child);
      if (found) return found;
    }
    return null;
  }

  function addPanel(key: string, newInstance = false) {
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

    const root = layout!.rootItem;
    if (!root) return;

    const target = (findFirstStack(root) ?? root) as any;

    const itemConfig = {
      type: 'component',
      componentType: def.componentName,
      title: newInstance ? `${def.title} ${(instances[key]?.length ?? 0) + 1}` : def.title,
      componentState: {}
    };

    const added = target.addChild(itemConfig) as ComponentItem;
    (instances[key] ||= []).push(added);
    added.container.on('destroy', () => {
      instances[key] = instances[key].filter(i => i !== added);
    });
    added.focus();
  }

  provide(GoldenLayoutSymbol, addPanel);
  return { container, addPanel };
}

export function useGoldenLayout() {
  const addPanel = inject<(key: string, newInstance?: boolean) => void>(GoldenLayoutSymbol);
  if (!addPanel) throw new Error('GoldenLayout not provided');
  return addPanel;
}
