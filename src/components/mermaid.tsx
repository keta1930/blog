'use client';

import { useTheme } from 'fumadocs-ui/provider/base';
import { useEffect, useId, useState } from 'react';

export function Mermaid({ chart }: { chart: string }) {
  const id = `mermaid-${useId().replaceAll(':', '')}`;
  const { resolvedTheme } = useTheme();
  const [svg, setSvg] = useState<string>();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function renderChart() {
      try {
        const { default: mermaid } = await import('mermaid');
        const isDark = resolvedTheme === 'dark';

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          fontFamily: 'Arial, Helvetica, sans-serif',
          theme: 'base',
          themeVariables: {
            background: isDark ? '#1d1d19' : '#f4efe4',
            primaryColor: isDark ? '#26251f' : '#e9e0cf',
            primaryTextColor: isDark ? '#eee8db' : '#28251f',
            primaryBorderColor: isDark ? '#9cc2a6' : '#3f614e',
            lineColor: isDark ? '#d18768' : '#a45439',
            secondaryColor: isDark ? '#464238' : '#c7d86d',
            tertiaryColor: isDark ? '#23231e' : '#fbf7ee',
          },
        });

        const result = await mermaid.render(id, chart.replaceAll('\\n', '\n'));
        if (!cancelled) {
          setSvg(result.svg);
          setFailed(false);
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    }

    void renderChart();
    return () => {
      cancelled = true;
    };
  }, [chart, id, resolvedTheme]);

  if (failed) return <pre className="mermaid-fallback">{chart}</pre>;
  if (!svg) return <div className="mermaid-loading" aria-hidden="true" />;

  return (
    <div
      className="mermaid-diagram"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
