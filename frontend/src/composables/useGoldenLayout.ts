import { ref, onMounted, provide, inject, createApp, type Component } from 'vue';
import {
  GoldenLayout,
  type ComponentContainer,
  type LayoutConfig,
  type ContentItem,
  type Stack,
  ComponentItem
} from 'golden-layout';
import { panelRegistry, type PanelDefinition } from '../panels';

const GoldenLayoutSymbol = Symbol('GoldenLayout');
const LAYOUT_KEY = 'gl-layout-v3'; // bump version when structure changes

function defaultLayout(): LayoutConfig {
  return {
    root: {
      type: 'column',
      content: [
        {
          type: 'stack',
          height: 38,
          content: [
            {
              type: 'component',
              componentType: panelRegistry['cashflow'].componentName,
              title: panelRegistry['cashflow'].title
            }
          ]
        },
        {
          type: 'row',
          height: 62,
          content: [
            {
              type: 'stack',
              width: 68,
              content: [
                { type: 'component', componentType: panelRegistry['family-info'].componentName,    title: panelRegistry['family-info'].title },
                { type: 'component', componentType: panelRegistry['asset-management'].componentName, title: panelRegistry['asset-management'].title },
                { type: 'component', componentType: panelRegistry['life-plan'].componentName,       title: panelRegistry['life-plan'].title },
                { type: 'component', componentType: panelRegistry['dashboard'].componentName,       title: panelRegistry['dashboard'].title }
              ]
            },
            {
              type: 'column',
              width: 32,
              content: [
                { type: 'stack', height: 50, content: [
                  { type: 'component', componentType: panelRegistry['household-manager'].componentName, title: panelRegistry['household-manager'].title }
                ]},
                { type: 'stack', height: 50, content: [
                  { type: 'component', componentType: panelRegistry['data-entry'].componentName, title: panelRegistry['data-entry'].title }
                ]}
              ]
            }
          ]
        }
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
  } as unknown as LayoutConfig;
}

export function provideGoldenLayout(initialKey?: string) {
  const container = ref<HTMLElement | null>(null);
  let layout: GoldenLayout | undefined;
  const instances: Record<string, ComponentItem[]> = {};

  onMounted(() => {
    if (!container.value) return;

    layout = new GoldenLayout(container.value);
    layout.resizeWithContainerAutomatically = true;

    // Register components
    Object.values(panelRegistry).forEach((def: PanelDefinition) => {
      layout!.registerComponentFactoryFunction(def.componentName, async (cont: ComponentContainer) => {
        const mount = document.createElement('div');
        mount.style.height = '100%';
        cont.element.appendChild(mount);
        const comp: Component = (await def.loader()).default;
        const app = createApp(comp);
        app.mount(mount);
        cont.on('destroy', () => app.unmount());
      });
    });

    // Load layout (cast to LayoutConfig; do not use ResolvedLayoutConfig)
    const saved = localStorage.getItem(LAYOUT_KEY);
    if (saved) {
      try {
        const cfg = JSON.parse(saved) as unknown as LayoutConfig;
        layout.loadLayout(cfg);
      } catch {
        layout.loadLayout(defaultLayout());
      }
    } else {
      layout.loadLayout(defaultLayout());
    }

    // Persist
    layout.on('stateChanged', () => {
      const state = layout!.saveLayout();
      localStorage.setItem(LAYOUT_KEY, JSON.stringify(state));
    });
  });

  function findFirstStack(): Stack | ContentItem | undefined {
    if (!layout?.rootItem) return undefined;
    const stacks = layout.rootItem.getItemsByFilter((it: ContentItem) => (it as any).isStack === true);
    return (stacks[0] as unknown as Stack) || layout.rootItem;
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

    const target = findFirstStack();
    if (!target) return;

    const itemConfig = {
      type: 'component' as const,
      componentType: def.componentName,
      title: newInstance ? `${def.title} ${(instances[key]?.length ?? 0) + 1}` : def.title,
      componentState: {}
    };

    const added = (target as any).addChild(itemConfig) as ComponentItem;
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
