/** Forms component reference — inputs, checkboxes, radios, range sliders, file inputs, number inputs, chips, toggles, segmented controls, combobox, color picker, and date picker. */

import {
  sectionHeading,
  specimen,
  codeExample,
  quickNavFromLabels,
  sectionDivider,
} from '../../../lib/helpers';

function classTable(rows: [string, string][]): string {
  return `
    <div class="table-responsive">
      <table class="table table-compact">
        <thead><tr><th>Class</th><th>Description</th></tr></thead>
        <tbody>
          ${rows.map(([cls, desc]) => `<tr><td><code>${cls}</code></td><td>${desc}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

export function renderFormsRef(): HTMLElement {
  const page = document.createElement('div');
  page.innerHTML = `
<div class="page-forms-reference">

  ${sectionHeading('Forms', 'forms', 'Text inputs, selection controls, pickers, and interactive form elements.')}

  ${quickNavFromLabels(
    [
      'Inputs',
      'Checkboxes',
      'Radios',
      'Range Sliders',
      'File Input',
      'Number Input',
      'Chips',
      'Toggle',
      'Segmented Controls',
      'Combobox',
      'Color Picker',
      'Date Picker',
    ],
    'forms-'
  )}

  ${sectionDivider()}

  ${sectionHeading('Inputs', 'forms-inputs', 'Text inputs, selects, textareas, and input groups with labels and help text.')}

  ${classTable([
    ['.input', 'Base text input'],
    ['.input-sm', 'Small input variant'],
    ['.input-lg', 'Large input variant'],
    ['.input-group', 'Wrapper for label + input + help text'],
    ['.input-label', 'Label element within an input group'],
    ['.input-help', 'Help text below the input'],
    ['.select', 'Styled <code>&lt;select&gt;</code> element'],
    ['.textarea', 'Styled <code>&lt;textarea&gt;</code> element'],
    ['.form-validated', 'Enables native validation styling on a <code>&lt;form&gt;</code>'],
  ])}

  ${specimen(
    'Input Group',
    'forms-input-group',
    `
    <div class="flex flex-col gap-4" style="max-width: 24rem">
      <div class="input-group">
        <label class="input-label">Label</label>
        <input type="text" class="input" placeholder="Enter text" />
        <span class="input-help">Help text</span>
      </div>
      <div class="input-group">
        <label class="input-label">Small</label>
        <input type="text" class="input input-sm" placeholder="Small input" />
      </div>
      <div class="input-group">
        <label class="input-label">Large</label>
        <input type="text" class="input input-lg" placeholder="Large input" />
      </div>
    </div>`,
    `<div class="input-group">
  <label class="input-label">Label</label>
  <input type="text" class="input" placeholder="Enter text" />
  <span class="input-help">Help text</span>
</div>`
  )}

  ${specimen(
    'Select & Textarea',
    'forms-select-textarea',
    `
    <div class="flex flex-col gap-4" style="max-width: 24rem">
      <select class="select">
        <option>Option A</option>
        <option>Option B</option>
        <option>Option C</option>
      </select>
      <textarea class="textarea" rows="3" placeholder="Enter long text..."></textarea>
    </div>`,
    `<select class="select">
  <option>Option A</option>
  <option>Option B</option>
</select>

<textarea class="textarea" rows="3" placeholder="Enter long text..."></textarea>`
  )}

  ${codeExample(`<!-- Form with native validation -->
<form class="form-validated">
  <div class="input-group">
    <label class="input-label">Email</label>
    <input type="email" class="input" required />
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>`)}

  ${sectionDivider()}

  ${sectionHeading('Checkboxes', 'forms-checkboxes', 'Styled checkbox inputs.')}

  ${classTable([['.checkbox', 'Styled checkbox control']])}

  ${specimen(
    'Checkbox',
    'forms-checkbox-example',
    `
    <div class="flex items-center gap-4">
      <input type="checkbox" class="checkbox" checked />
      <input type="checkbox" class="checkbox" />
      <input type="checkbox" class="checkbox" disabled />
    </div>`,
    `<input type="checkbox" class="checkbox" checked />
<input type="checkbox" class="checkbox" />
<input type="checkbox" class="checkbox" disabled />`
  )}

  ${sectionDivider()}

  ${sectionHeading('Radios', 'forms-radios', 'Styled radio button inputs.')}

  ${classTable([['.radio', 'Styled radio control']])}

  ${specimen(
    'Radio Buttons',
    'forms-radio-example',
    `
    <div class="flex items-center gap-4">
      <input type="radio" class="radio" name="demo-group" checked />
      <input type="radio" class="radio" name="demo-group" />
      <input type="radio" class="radio" name="demo-group" disabled />
    </div>`,
    `<input type="radio" class="radio" name="group" checked />
<input type="radio" class="radio" name="group" />
<input type="radio" class="radio" name="group" disabled />`
  )}

  ${sectionDivider()}

  ${sectionHeading('Range Sliders', 'forms-range-sliders', 'Styled range input sliders in multiple sizes.')}

  ${classTable([
    ['.range', 'Base range slider'],
    ['.range-sm', 'Small range slider'],
    ['.range-lg', 'Large range slider'],
  ])}

  ${specimen(
    'Range Sizes',
    'forms-range-sizes',
    `
    <div class="flex flex-col gap-4" style="max-width: 24rem">
      <input type="range" class="range range-sm" min="0" max="100" value="30" />
      <input type="range" class="range" min="0" max="100" value="50" />
      <input type="range" class="range range-lg" min="0" max="100" value="70" />
    </div>`,
    `<input type="range" class="range range-sm" min="0" max="100" value="30" />
<input type="range" class="range" min="0" max="100" value="50" />
<input type="range" class="range range-lg" min="0" max="100" value="70" />`
  )}

  ${sectionDivider()}

  ${sectionHeading('File Input', 'forms-file-input', 'Styled file upload inputs.')}

  ${classTable([
    ['.file-input', 'Base file input'],
    ['.file-input-sm', 'Small file input'],
    ['.file-input-lg', 'Large file input'],
  ])}

  ${specimen(
    'File Input Sizes',
    'forms-file-input-sizes',
    `
    <div class="flex flex-col gap-4" style="max-width: 24rem">
      <input type="file" class="file-input file-input-sm" />
      <input type="file" class="file-input" />
      <input type="file" class="file-input file-input-lg" />
    </div>`,
    `<input type="file" class="file-input file-input-sm" />
<input type="file" class="file-input" />
<input type="file" class="file-input file-input-lg" />`
  )}

  ${sectionDivider()}

  ${sectionHeading('Number Input', 'forms-number-input', 'Structured number input with increment and decrement step buttons.')}

  ${classTable([
    ['.input-number', 'Wrapper for the number input group'],
    ['.input-number-step', 'Increment / decrement button'],
  ])}

  ${specimen(
    'Number Input',
    'forms-number-input-example',
    `
    <div class="input-number">
      <button class="input-number-step">-</button>
      <input type="number" class="input" value="1" />
      <button class="input-number-step">+</button>
    </div>`,
    `<div class="input-number">
  <button class="input-number-step">-</button>
  <input type="number" class="input" value="1" />
  <button class="input-number-step">+</button>
</div>`
  )}

  ${sectionDivider()}

  ${sectionHeading('Chips', 'forms-chips', 'Compact labels for tags, categories, or dismissible selections.')}

  ${classTable([
    ['.chip', 'Base chip'],
    ['.chip-success', 'Success variant'],
    ['.chip-warning', 'Warning variant'],
    ['.chip-error', 'Error variant'],
    ['.chip-info', 'Info variant'],
    ['.close', 'Nested close button for dismissible chips'],
  ])}

  ${specimen(
    'Chip Variants',
    'forms-chip-variants',
    `
    <div class="flex flex-wrap items-center gap-3">
      <span class="chip">Default</span>
      <span class="chip chip-success">Success</span>
      <span class="chip chip-warning">Warning</span>
      <span class="chip chip-error">Error</span>
      <span class="chip chip-info">Info</span>
      <span class="chip">Dismissible <button class="close"></button></span>
    </div>`,
    `<span class="chip">Default</span>
<span class="chip chip-success">Success</span>
<span class="chip chip-warning">Warning</span>
<span class="chip chip-error">Error</span>
<span class="chip chip-info">Info</span>
<span class="chip">Dismissible <button class="close"></button></span>`
  )}

  ${sectionDivider()}

  ${sectionHeading('Toggle', 'forms-toggle', 'Toggle (Switch) — switch-style boolean controls. Tier-aware toggle consuming --relief-*, --finish-*, and --state-* tokens. Renders as a track with a sliding thumb pseudo-element.')}

  ${classTable([
    ['.toggle', 'Base toggle switch'],
    ['.toggle.active', 'Active (on) state'],
    ['.toggle.disabled', 'Disabled state'],
  ])}

  ${specimen(
    'Toggle States',
    'forms-toggle-states',
    `
    <div class="flex items-center gap-4">
      <div class="toggle active" role="switch" aria-checked="true" tabindex="0"></div>
      <div class="toggle" role="switch" aria-checked="false" tabindex="0"></div>
      <div class="toggle disabled"></div>
    </div>`,
    `<div class="toggle active" role="switch" aria-checked="true" tabindex="0"></div>
<div class="toggle" role="switch" aria-checked="false" tabindex="0"></div>
<div class="toggle disabled"></div>`
  )}

  ${codeExample(`<!-- ARIA: use role="switch" with aria-checked and tabindex -->
<div class="toggle active" role="switch" aria-checked="true" tabindex="0"></div>`)}

  ${sectionDivider()}

  ${sectionHeading('Segmented Controls', 'forms-segmented-controls', 'Inline group of mutually exclusive options. Uses BEM naming for child elements.')}

  ${classTable([
    ['.segmented-control', 'Base segmented control container'],
    ['.segmented-control-sm', 'Small variant'],
    ['.segmented-control-lg', 'Large variant'],
    ['.segmented-control__option', 'Individual option button (BEM child)'],
    ['.segmented-control__option.active', 'Active (selected) option'],
  ])}

  ${specimen(
    'Segmented Control',
    'forms-segmented-control-example',
    `
    <div class="flex flex-col gap-4">
      <div class="segmented-control segmented-control-sm">
        <button class="segmented-control__option active">Daily</button>
        <button class="segmented-control__option">Weekly</button>
        <button class="segmented-control__option">Monthly</button>
      </div>
      <div class="segmented-control">
        <button class="segmented-control__option active">Daily</button>
        <button class="segmented-control__option">Weekly</button>
        <button class="segmented-control__option">Monthly</button>
      </div>
      <div class="segmented-control segmented-control-lg">
        <button class="segmented-control__option active">Daily</button>
        <button class="segmented-control__option">Weekly</button>
        <button class="segmented-control__option">Monthly</button>
      </div>
    </div>`,
    `<div class="segmented-control">
  <button class="segmented-control__option active">Daily</button>
  <button class="segmented-control__option">Weekly</button>
  <button class="segmented-control__option">Monthly</button>
</div>`
  )}

  ${sectionDivider()}

  ${sectionHeading('Combobox', 'forms-combobox', 'Filterable dropdown combining a text input with a listbox. Requires the <code>initComboboxes()</code> enhancer.')}

  ${classTable([
    ['.combobox', 'Base combobox wrapper'],
    ['.combobox-input', 'Text input within the combobox'],
    ['.combobox-listbox', 'Dropdown list container'],
    ['.combobox-option', 'Individual option in the listbox'],
    ['.combobox-option.selected', 'Currently selected option'],
    ['.combobox-empty', 'Empty state message when no options match'],
  ])}

  ${specimen(
    'Combobox',
    'forms-combobox-example',
    `
    <div data-sol-combobox class="combobox" style="max-width: 24rem">
      <input class="combobox-input input" role="combobox" placeholder="Search..." />
      <ul class="combobox-listbox" role="listbox">
        <li class="combobox-option" role="option">Option 1</li>
        <li class="combobox-option" role="option">Option 2</li>
        <li class="combobox-option" role="option">Option 3</li>
      </ul>
    </div>`,
    `<div data-sol-combobox class="combobox">
  <input class="combobox-input input" role="combobox" />
  <ul class="combobox-listbox" role="listbox">
    <li class="combobox-option" role="option">Option 1</li>
  </ul>
</div>`
  )}

  ${codeExample(`<!-- JS enhancer activation -->
<script>
  import { initComboboxes } from 'soltana-ui';
  initComboboxes();
</script>`)}

  ${sectionDivider()}

  ${sectionHeading('Color Picker', 'forms-color-picker', 'HSV color selection with 2D area, hue slider, optional alpha, and swatches. Requires the <code>initColorPickers()</code> enhancer.')}

  ${classTable([
    ['.color-picker', 'Base color picker wrapper'],
    ['.color-picker-trigger', 'Button that opens the popup'],
    ['.color-picker-popup', 'Popup container for picker controls'],
    ['.color-picker-area', '2D saturation/value selection area'],
    ['.color-picker-hue', 'Hue slider'],
    ['.color-picker-alpha', 'Alpha (opacity) slider'],
    ['.color-picker-input', 'Hex/RGB text input'],
    ['.color-picker-swatches', 'Swatch palette container'],
    ['.color-picker-swatch', 'Individual swatch button'],
    ['.color-picker-preview', 'Live color preview area'],
  ])}

  ${specimen(
    'Color Picker',
    'forms-color-picker-example',
    `
    <div data-sol-color-picker class="color-picker">
      <button class="color-picker-trigger" style="background: #d4a843;"></button>
      <div class="color-picker-popup">
        <div class="color-picker-area"></div>
        <div class="color-picker-hue"></div>
        <input class="color-picker-input input" value="#d4a843" />
        <div class="color-picker-swatches" data-swatches='["#d4a843","#a855f7"]'></div>
      </div>
    </div>`,
    `<div data-sol-color-picker class="color-picker">
  <button class="color-picker-trigger" style="background: #d4a843;"></button>
  <div class="color-picker-popup">
    <div class="color-picker-area"></div>
    <div class="color-picker-hue"></div>
    <input class="color-picker-input input" value="#d4a843" />
    <div class="color-picker-swatches" data-swatches='["#d4a843","#a855f7"]'></div>
  </div>
</div>`
  )}

  ${codeExample(`<!-- JS enhancer activation -->
<script>
  import { initColorPickers } from 'soltana-ui';
  initColorPickers();
</script>`)}

  ${sectionDivider()}

  ${sectionHeading('Date Picker', 'forms-date-picker', 'Calendar-based date selection with navigation and grid layout. Requires the <code>initDatePickers()</code> enhancer.')}

  ${classTable([
    ['.date-picker', 'Base date picker wrapper'],
    ['.date-picker-input', 'Text input that displays the selected date'],
    ['.date-picker-popup', 'Popup container for the calendar'],
    ['.date-picker-header', 'Header with navigation and title'],
    ['.date-picker-nav', 'Previous / next month navigation buttons'],
    ['.date-picker-title', 'Month and year display'],
    ['.date-picker-grid', 'Calendar grid container'],
    ['.date-picker-weekday', 'Weekday column header'],
    ['.date-picker-cell', 'Individual day cell'],
    ['.date-picker-cell.today', 'Highlights the current date'],
    ['.date-picker-cell-other', 'Days outside the current month'],
  ])}

  ${specimen(
    'Date Picker',
    'forms-date-picker-example',
    `
    <div data-sol-date-picker class="date-picker" style="max-width: 24rem">
      <input class="date-picker-input input" placeholder="Pick a date" />
      <div class="date-picker-popup">
        <div class="date-picker-header">
          <button class="date-picker-nav">&lsaquo;</button>
          <span class="date-picker-title">February 2026</span>
          <button class="date-picker-nav">&rsaquo;</button>
        </div>
        <div class="date-picker-grid" role="grid">
          <div class="date-picker-weekday">Mo</div>
          <div class="date-picker-weekday">Tu</div>
          <div class="date-picker-weekday">We</div>
          <div class="date-picker-weekday">Th</div>
          <div class="date-picker-weekday">Fr</div>
          <div class="date-picker-weekday">Sa</div>
          <div class="date-picker-weekday">Su</div>
          <button class="date-picker-cell today" role="gridcell">19</button>
          <button class="date-picker-cell" role="gridcell">20</button>
          <button class="date-picker-cell" role="gridcell">21</button>
        </div>
      </div>
    </div>`,
    `<div data-sol-date-picker class="date-picker">
  <input class="date-picker-input input" placeholder="Pick a date" />
  <div class="date-picker-popup">
    <div class="date-picker-header">
      <button class="date-picker-nav">&lsaquo;</button>
      <span class="date-picker-title">February 2026</span>
      <button class="date-picker-nav">&rsaquo;</button>
    </div>
    <div class="date-picker-grid" role="grid">
      <div class="date-picker-weekday">Mo</div>
      <button class="date-picker-cell today" role="gridcell">19</button>
      <button class="date-picker-cell" role="gridcell">20</button>
    </div>
  </div>
</div>`
  )}

  ${codeExample(`<!-- JS enhancer activation -->
<script>
  import { initDatePickers } from 'soltana-ui';
  initDatePickers();
</script>`)}

</div>`;
  return page;
}
