/** Chart data configs for Plotly visual regression tests. */
export const CHART_CONFIGS: Record<string, { data: unknown[]; layout?: Record<string, unknown> }> =
  {
    bar: {
      data: [
        {
          type: 'bar',
          name: 'Q1',
          x: ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'],
          y: [20, 35, 30, 45, 25],
        },
        {
          type: 'bar',
          name: 'Q2',
          x: ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'],
          y: [28, 40, 22, 50, 32],
        },
      ],
      layout: {
        title: { text: 'Quarterly Revenue' },
        barmode: 'group',
      },
    },

    scatter: {
      data: [
        {
          type: 'scatter',
          mode: 'lines+markers',
          name: 'Series A',
          x: [1, 2, 3, 4, 5, 6, 7, 8],
          y: [10, 15, 13, 17, 20, 18, 25, 28],
        },
        {
          type: 'scatter',
          mode: 'lines+markers',
          name: 'Series B',
          x: [1, 2, 3, 4, 5, 6, 7, 8],
          y: [16, 12, 18, 14, 22, 19, 15, 23],
        },
        {
          type: 'scatter',
          mode: 'lines+markers',
          name: 'Series C',
          x: [1, 2, 3, 4, 5, 6, 7, 8],
          y: [5, 8, 12, 10, 15, 14, 20, 18],
        },
      ],
      layout: {
        title: { text: 'Trend Analysis' },
        xaxis: { title: { text: 'Period' } },
        yaxis: { title: { text: 'Value' } },
      },
    },

    pie: {
      data: [
        {
          type: 'pie',
          hole: 0.4,
          labels: ['Engineering', 'Marketing', 'Sales', 'Operations', 'Support'],
          values: [35, 20, 25, 12, 8],
          textinfo: 'label+percent',
        },
      ],
      layout: {
        title: { text: 'Department Budget' },
      },
    },

    heatmap: {
      data: [
        {
          type: 'heatmap',
          z: [
            [1, 20, 30, 50, 1],
            [20, 1, 60, 80, 30],
            [30, 60, 1, 5, 20],
            [50, 80, 5, 1, 10],
            [1, 30, 20, 10, 1],
          ],
          x: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          y: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
          coloraxis: 'coloraxis',
        },
      ],
      layout: {
        title: { text: 'Activity Heatmap' },
        coloraxis: { colorscale: 'Viridis' },
      },
    },

    box: {
      data: [
        {
          type: 'box',
          name: 'Control',
          y: [2.1, 2.5, 2.8, 3.0, 3.2, 3.5, 3.8, 4.0, 4.5, 5.0],
        },
        {
          type: 'box',
          name: 'Treatment A',
          y: [3.5, 4.0, 4.2, 4.5, 4.8, 5.0, 5.5, 6.0, 6.2, 7.0],
        },
        {
          type: 'box',
          name: 'Treatment B',
          y: [1.8, 2.2, 2.5, 3.0, 3.5, 3.8, 4.0, 4.2, 4.8, 5.5],
        },
      ],
      layout: {
        title: { text: 'Treatment Comparison' },
        yaxis: { title: { text: 'Response' } },
      },
    },

    sankey: {
      data: [
        {
          type: 'sankey',
          orientation: 'h',
          node: {
            label: ['Budget', 'Engineering', 'Marketing', 'Salaries', 'Tools', 'Ads'],
            pad: 15,
            thickness: 20,
          },
          link: {
            source: [0, 0, 0, 1, 1, 2],
            target: [1, 2, 3, 3, 4, 5],
            value: [40, 25, 15, 25, 15, 25],
          },
        },
      ],
      layout: {
        title: { text: 'Budget Flow' },
      },
    },

    choropleth: {
      data: [
        {
          type: 'choropleth',
          locations: ['USA', 'CAN', 'BRA', 'GBR', 'FRA', 'DEU', 'AUS', 'JPN'],
          z: [100, 80, 60, 75, 70, 85, 65, 90],
          text: ['US', 'Canada', 'Brazil', 'UK', 'France', 'Germany', 'Australia', 'Japan'],
          coloraxis: 'coloraxis',
        },
      ],
      layout: {
        title: { text: 'Global Index' },
        geo: { projection: { type: 'natural earth' } },
        coloraxis: { colorscale: 'Blues' },
      },
    },
  };
