import { useEffect, useRef, useState } from 'react';

export function useResizeObserver() {
  const [rootDimensions, setRootDimensions] = useState({ width: 0, height: 0 });

  const widget = document.getElementById('gather-jupyterlab');
  const widgetRef = useRef(widget);

  useEffect(() => {
    if (!widgetRef.current) {
      return;
    }

    const observer = new ResizeObserver(entries => {
      setRootDimensions({
        width: entries[0].contentRect.width,
        height: entries[0].contentRect.height
      });
    });

    observer.observe(widgetRef.current);

    return () => observer.disconnect();
  }, []);

  return rootDimensions;
}
