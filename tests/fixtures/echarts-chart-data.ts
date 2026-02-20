/** Chart option configs for ECharts visual regression tests. */
export const CHART_CONFIGS: Record<string, Record<string, unknown>> = {
  tree: {
    animation: false,
    title: { text: 'Org Chart', subtext: 'Tree layout' },
    series: {
      type: 'tree',
      layout: 'orthogonal',
      orient: 'TB',
      symbol: 'circle',
      symbolSize: 12,
      label: { show: true, fontSize: 11 },
      data: [
        {
          name: 'CEO',
          children: [
            {
              name: 'VP Engineering',
              children: [{ name: 'Frontend Lead' }, { name: 'Backend Lead' }, { name: 'QA Lead' }],
            },
            {
              name: 'VP Product',
              children: [{ name: 'PM Alpha' }, { name: 'PM Beta' }],
            },
            {
              name: 'VP Design',
              children: [{ name: 'UX Lead' }, { name: 'UI Lead' }],
            },
          ],
        },
      ],
    },
  },

  treemap: {
    animation: false,
    title: { text: 'Disk Usage', subtext: 'Treemap layout' },
    series: {
      type: 'treemap',
      breadcrumb: { show: true },
      label: { show: true, fontSize: 11 },
      data: [
        {
          name: 'Documents',
          value: 40,
          children: [
            { name: 'Reports', value: 20 },
            { name: 'Invoices', value: 12 },
            { name: 'Contracts', value: 8 },
          ],
        },
        {
          name: 'Media',
          value: 30,
          children: [
            { name: 'Photos', value: 18 },
            { name: 'Videos', value: 12 },
          ],
        },
        {
          name: 'Source',
          value: 25,
          children: [
            { name: 'Frontend', value: 10 },
            { name: 'Backend', value: 8 },
            { name: 'Shared', value: 7 },
          ],
        },
        { name: 'Config', value: 10 },
        { name: 'Logs', value: 8 },
        { name: 'Temp', value: 5 },
      ],
    },
  },

  sankey: {
    animation: false,
    title: { text: 'Budget Flow', subtext: 'Sankey diagram' },
    series: {
      type: 'sankey',
      layout: 'none',
      label: { show: true, fontSize: 11 },
      data: [
        { name: 'Revenue' },
        { name: 'Grants' },
        { name: 'Engineering' },
        { name: 'Marketing' },
        { name: 'Operations' },
        { name: 'Salaries' },
        { name: 'Tools' },
        { name: 'Cloud' },
      ],
      links: [
        { source: 'Revenue', target: 'Engineering', value: 40 },
        { source: 'Revenue', target: 'Marketing', value: 25 },
        { source: 'Revenue', target: 'Operations', value: 15 },
        { source: 'Grants', target: 'Engineering', value: 20 },
        { source: 'Engineering', target: 'Salaries', value: 35 },
        { source: 'Engineering', target: 'Tools', value: 15 },
        { source: 'Engineering', target: 'Cloud', value: 10 },
        { source: 'Marketing', target: 'Salaries', value: 15 },
        { source: 'Operations', target: 'Cloud', value: 15 },
      ],
    },
  },

  sunburst: {
    animation: false,
    title: { text: 'Category Breakdown', subtext: 'Sunburst chart' },
    series: {
      type: 'sunburst',
      radius: ['15%', '90%'],
      label: { show: true, fontSize: 10 },
      data: [
        {
          name: 'A',
          children: [
            {
              name: 'A1',
              children: [
                { name: 'A1a', value: 5 },
                { name: 'A1b', value: 3 },
              ],
            },
            { name: 'A2', value: 8 },
          ],
        },
        {
          name: 'B',
          children: [
            { name: 'B1', value: 6 },
            {
              name: 'B2',
              children: [
                { name: 'B2a', value: 4 },
                { name: 'B2b', value: 2 },
              ],
            },
          ],
        },
        {
          name: 'C',
          children: [
            { name: 'C1', value: 7 },
            { name: 'C2', value: 3 },
            { name: 'C3', value: 2 },
          ],
        },
      ],
    },
  },

  gauge: {
    animation: false,
    title: { text: 'Performance', subtext: 'Gauge' },
    series: {
      type: 'gauge',
      min: 0,
      max: 100,
      detail: { formatter: '{value}%', fontSize: 20 },
      axisTick: { show: true },
      splitLine: { show: true },
      axisLabel: { show: true, fontSize: 10 },
      data: [{ value: 72, name: 'Score' }],
    },
  },

  'graph-circular': {
    animation: false,
    title: { text: 'Network', subtext: 'Circular graph layout' },
    series: {
      type: 'graph',
      layout: 'circular',
      symbolSize: 30,
      label: { show: true, fontSize: 10 },
      edgeSymbol: ['none', 'arrow'],
      edgeSymbolSize: 8,
      lineStyle: { curveness: 0.3 },
      data: [
        { name: 'N1' },
        { name: 'N2' },
        { name: 'N3' },
        { name: 'N4' },
        { name: 'N5' },
        { name: 'N6' },
        { name: 'N7' },
        { name: 'N8' },
      ],
      links: [
        { source: 'N1', target: 'N2' },
        { source: 'N1', target: 'N3' },
        { source: 'N2', target: 'N4' },
        { source: 'N3', target: 'N5' },
        { source: 'N4', target: 'N6' },
        { source: 'N5', target: 'N7' },
        { source: 'N6', target: 'N8' },
        { source: 'N7', target: 'N1' },
        { source: 'N8', target: 'N2' },
        { source: 'N3', target: 'N6' },
        { source: 'N4', target: 'N7' },
        { source: 'N5', target: 'N8' },
      ],
    },
  },

  'datazoom-gantt': {
    animation: false,
    title: { text: 'Project Timeline', subtext: 'Gantt via stacked bar + dataZoom' },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 120, right: 40, top: 80, bottom: 80 },
    xAxis: {
      type: 'value',
      min: 0,
      max: 30,
      name: 'Days',
    },
    yAxis: {
      type: 'category',
      data: ['Research', 'Design', 'Prototype', 'Dev Sprint 1', 'Dev Sprint 2', 'QA', 'Launch'],
      inverse: true,
    },
    dataZoom: [{ type: 'slider', xAxisIndex: 0, bottom: 20 }],
    series: [
      {
        name: 'Offset',
        type: 'bar',
        stack: 'gantt',
        itemStyle: { color: 'transparent' },
        data: [0, 3, 5, 8, 14, 20, 26],
      },
      {
        name: 'Duration',
        type: 'bar',
        stack: 'gantt',
        data: [3, 4, 5, 6, 6, 6, 4],
      },
    ],
  },
};
