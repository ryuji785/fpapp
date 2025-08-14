import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoldenLayout, LayoutConfig } from 'golden-layout';
import 'golden-layout/dist/css/goldenlayout-base.css';
import 'golden-layout/dist/css/themes/goldenlayout-light-theme.css';

import { Dashboard } from './Dashboard';
import { DataEntry } from './DataEntry';

export function MainLayout() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const golden = new GoldenLayout(containerRef.current);

    // Register React components with Golden Layout
    golden.registerComponentFactoryFunction('Dashboard', (container) => {
      const div = document.createElement('div');
      container.element.appendChild(div);
      const root = createRoot(div);
      root.render(<Dashboard />);
      container.on('destroy', () => root.unmount());
    });

    golden.registerComponentFactoryFunction('DataEntry', (container) => {
      const div = document.createElement('div');
      container.element.appendChild(div);
      const root = createRoot(div);
      root.render(<DataEntry />);
      container.on('destroy', () => root.unmount());
    });

    const config: LayoutConfig = {
      root: {
        type: 'row',
        content: [
          {
            type: 'component',
            componentType: 'Dashboard',
            title: 'Dashboard',
          },
          {
            type: 'component',
            componentType: 'DataEntry',
            title: 'Data Entry',
          },
        ],
      },
    };

    golden.loadLayout(config);
    return () => golden.destroy();
  }, []);

  return <div className="w-full h-full" ref={containerRef} />;
}

export default MainLayout;
