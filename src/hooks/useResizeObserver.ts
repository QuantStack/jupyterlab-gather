import { useEffect, useRef, useState } from 'react';

export function useResizeObserver() {
  const [rootDimensions, setRootDimensions] = useState({ width: 0, height: 0 });

  const widget = document.getElementById('jlab-gather-root-id');
  const widgetRef = useRef(widget);

  useEffect(() => {
    if (!widgetRef.current) {
      return;
    }

    const observer = new ResizeObserver(entries => {
      setRootDimensions({
        width: entries[0].contentBoxSize[0].inlineSize,
        height: entries[0].contentBoxSize[0].blockSize
      });
    });

    observer.observe(widgetRef.current);

    return () => observer.disconnect();
  }, []);

  return rootDimensions;
}
