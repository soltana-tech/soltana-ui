/** Web Components page — Shadow DOM component demos with live attribute playgrounds. */

function sectionHeading(title: string, id: string, description?: string): string {
  return `
    <div class="section-heading" id="${id}">
      <h2 class="text-3xl font-bold">${title}</h2>
      ${description ? `<p class="text-secondary mt-2">${description}</p>` : ''}
    </div>
    <div class="section-divider"></div>`;
}

export function renderWebComponents(): string {
  return `
<div class="page-web-components">

  ${sectionHeading('Web Components', 'wc-intro', 'Shadow DOM Web Components with encapsulated estate styling. Each component observes the active theme and exposes attributes for customization.')}

  <!-- sol-card -->
  <h3 class="text-xl font-semibold mt-8 mb-4 font-serif" id="wc-card">sol-card</h3>
  <p class="text-secondary mb-4">Card with ornamental corners, gold borders, and multiple variants.</p>
  <div class="grid grid-cols-2 gap-6" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))">
    <sol-card variant="default" elevation="raised">
      <span slot="header">Default Card</span>
      <p>Neumorphic raised card with soft depth.</p>
    </sol-card>
    <sol-card variant="ornate" elevation="raised">
      <span slot="header">Ornate Card</span>
      <p>Four corner ornaments for a classical frame.</p>
    </sol-card>
    <sol-card variant="baroque" elevation="raised">
      <span slot="header">Baroque Card</span>
      <p>Full ornamental frame, medallion, carved relief, and corner flourishes.</p>
    </sol-card>
    <sol-card variant="carved" elevation="raised">
      <span slot="header">Carved Card</span>
      <p>Stone-cut frame with raised rim, chiseled edges, and corner rosette.</p>
    </sol-card>
    <sol-card variant="stained-glass" elevation="raised">
      <span slot="header">Stained Glass Card</span>
      <p>Theme-colored translucent panel with lead-line frame.</p>
    </sol-card>
    <sol-card variant="marble" elevation="floating">
      <span slot="header">Marble Card</span>
      <p>Marble-textured background for a material feel.</p>
    </sol-card>
    <sol-card variant="glass" elevation="raised">
      <span slot="header">Glass Card</span>
      <p>Crystal glass with backdrop blur effect.</p>
    </sol-card>
    <sol-card variant="default" elevation="raised" gold-border>
      <span slot="header">Gold Border Card</span>
      <p>Metallic gold gradient border treatment.</p>
    </sol-card>
  </div>

  <div class="ornament-divider mt-12 mb-12"></div>

  <!-- sol-button -->
  <h3 class="text-xl font-semibold mt-8 mb-4 font-serif" id="wc-button">sol-button</h3>
  <p class="text-secondary mb-4">Button with neumorphic base, metallic finishes, and structural variants.</p>

  <h4 class="text-lg font-semibold mt-4 mb-3">Standard Variants</h4>
  <div class="flex flex-wrap gap-4 items-center">
    <sol-button variant="primary">Primary</sol-button>
    <sol-button variant="secondary">Secondary</sol-button>
    <sol-button variant="outline">Outline</sol-button>
    <sol-button variant="ghost">Ghost</sol-button>
    <sol-button variant="embossed">Embossed</sol-button>
    <sol-button variant="danger">Danger</sol-button>
    <sol-button variant="primary" disabled>Disabled</sol-button>
  </div>

  <h4 class="text-lg font-semibold mt-6 mb-3">Metallic Variants</h4>
  <div class="flex flex-wrap gap-4 items-center">
    <sol-button variant="gold">Gold</sol-button>
    <sol-button variant="silver">Silver</sol-button>
    <sol-button variant="bronze">Bronze</sol-button>
    <sol-button variant="platinum">Platinum</sol-button>
  </div>

  <h4 class="text-lg font-semibold mt-6 mb-3">Structural Variants</h4>
  <div class="flex flex-wrap gap-4 items-center">
    <sol-button variant="chiseled">Chiseled</sol-button>
    <sol-button variant="baroque">Baroque</sol-button>
    <sol-button variant="faceted">Faceted</sol-button>
    <sol-button variant="medallion">M</sol-button>
  </div>

  <h4 class="text-lg font-semibold mt-6 mb-3">Sizes</h4>
  <div class="flex flex-wrap gap-4 items-center">
    <sol-button variant="primary" size="xs">Extra Small</sol-button>
    <sol-button variant="primary" size="sm">Small</sol-button>
    <sol-button variant="primary" size="md">Medium</sol-button>
    <sol-button variant="primary" size="lg">Large</sol-button>
    <sol-button variant="primary" size="xl">Extra Large</sol-button>
  </div>

  <div class="ornament-divider mt-12 mb-12"></div>

  <!-- sol-divider -->
  <h3 class="text-xl font-semibold mt-8 mb-4 font-serif" id="wc-divider">sol-divider</h3>
  <p class="text-secondary mb-4">Decorative divider with classical patterns.</p>
  <div class="flex flex-col gap-6">
    <div>
      <code class="text-xs text-muted">pattern="simple"</code>
      <sol-divider pattern="simple" color="gold"></sol-divider>
    </div>
    <div>
      <code class="text-xs text-muted">pattern="greek-key"</code>
      <sol-divider pattern="greek-key" color="gold"></sol-divider>
    </div>
    <div>
      <code class="text-xs text-muted">pattern="scrollwork"</code>
      <sol-divider pattern="scrollwork" color="gold"></sol-divider>
    </div>
    <div>
      <code class="text-xs text-muted">pattern="dentil"</code>
      <sol-divider pattern="dentil" color="gold"></sol-divider>
    </div>
    <div>
      <code class="text-xs text-muted">pattern="medallion"</code>
      <sol-divider pattern="medallion" color="gold"></sol-divider>
    </div>
  </div>

  <div class="ornament-divider mt-12 mb-12"></div>

  <!-- sol-badge -->
  <h3 class="text-xl font-semibold mt-8 mb-4 font-serif" id="wc-badge">sol-badge</h3>
  <p class="text-secondary mb-4">Medallion-style badges with jewel tones.</p>
  <div class="flex flex-wrap gap-4 items-center">
    <sol-badge variant="default">Default</sol-badge>
    <sol-badge variant="primary">Primary</sol-badge>
    <sol-badge variant="success">Success</sol-badge>
    <sol-badge variant="warning">Warning</sol-badge>
    <sol-badge variant="error">Error</sol-badge>
    <sol-badge variant="gold">Gold</sol-badge>
    <sol-badge variant="medallion">M</sol-badge>
  </div>

  <div class="ornament-divider mt-12 mb-12"></div>

  <!-- sol-input -->
  <h3 class="text-xl font-semibold mt-8 mb-4 font-serif" id="wc-input">sol-input</h3>
  <p class="text-secondary mb-4">Input with gold underline focus animation and validation states.</p>
  <div class="grid grid-cols-2 gap-6" style="max-width: 600px">
    <sol-input label="Full Name" placeholder="Enter your name" help="Required field"></sol-input>
    <sol-input label="Email" type="email" placeholder="you@example.com"></sol-input>
    <sol-input label="With Error" placeholder="Invalid" error="This field is required"></sol-input>
    <sol-input label="Disabled" placeholder="Cannot edit" disabled></sol-input>
  </div>

  <div class="ornament-divider mt-12 mb-12"></div>

  <!-- sol-progress -->
  <h3 class="text-xl font-semibold mt-8 mb-4 font-serif" id="wc-progress">sol-progress</h3>
  <p class="text-secondary mb-4">Progress bar with ornamental track ends.</p>
  <div class="flex flex-col gap-4" style="max-width: 500px">
    <div>
      <code class="text-xs text-muted">variant="default" value="65"</code>
      <sol-progress value="65" variant="default"></sol-progress>
    </div>
    <div>
      <code class="text-xs text-muted">variant="gold" value="80"</code>
      <sol-progress value="80" variant="gold"></sol-progress>
    </div>
    <div>
      <code class="text-xs text-muted">variant="jewel" value="45"</code>
      <sol-progress value="45" variant="jewel"></sol-progress>
    </div>
  </div>

  <div class="ornament-divider mt-12 mb-12"></div>

  <!-- sol-tooltip -->
  <h3 class="text-xl font-semibold mt-8 mb-4 font-serif" id="wc-tooltip">sol-tooltip</h3>
  <p class="text-secondary mb-4">Classical-styled tooltip with directional positioning.</p>
  <div class="flex flex-wrap gap-6 items-center">
    <sol-tooltip text="Tooltip on top" position="top">
      <span class="btn btn-secondary">Hover (Top)</span>
    </sol-tooltip>
    <sol-tooltip text="Tooltip on bottom" position="bottom">
      <span class="btn btn-secondary">Hover (Bottom)</span>
    </sol-tooltip>
    <sol-tooltip text="Tooltip on left" position="left">
      <span class="btn btn-secondary">Hover (Left)</span>
    </sol-tooltip>
    <sol-tooltip text="Tooltip on right" position="right">
      <span class="btn btn-secondary">Hover (Right)</span>
    </sol-tooltip>
  </div>

  <div class="ornament-divider mt-12 mb-12"></div>

  <!-- sol-panel -->
  <h3 class="text-xl font-semibold mt-8 mb-4 font-serif" id="wc-panel">sol-panel</h3>
  <p class="text-secondary mb-4">Panel with optional column-inspired borders.</p>
  <div class="grid grid-cols-2 gap-6" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))">
    <sol-panel variant="default">
      <span slot="header">Default Panel</span>
      <p>Standard panel with subtle borders.</p>
    </sol-panel>
    <sol-panel variant="marble" columns>
      <span slot="header">Marble Panel</span>
      <p>Column-inspired side borders with marble background.</p>
    </sol-panel>
    <sol-panel variant="glass">
      <span slot="header">Glass Panel</span>
      <p>Crystal glass with backdrop blur.</p>
    </sol-panel>
  </div>

</div>
`;
}
