/** Inputs component page — text fields, selects, textareas, checkboxes, and radios. */

import { sectionHeading, specimen } from '../../utils/helpers';

export function renderInputs(): string {
  return `
<div class="page-inputs">
  ${sectionHeading('Inputs', 'inputs', 'Text fields, selects, textareas, checkboxes, and radio buttons.')}

  ${specimen(
    'Text Inputs',
    'input-text',
    `
    <div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))">
      <div class="input-group">
        <label class="input-label">Text Input</label>
        <input type="text" class="input" placeholder="Enter text..." />
        <span class="input-help">Helper text goes here</span>
      </div>
      <div class="input-group">
        <label class="input-label">Email</label>
        <input type="email" class="input" placeholder="user@example.com" />
      </div>
      <div class="input-group">
        <label class="input-label">Password</label>
        <input type="password" class="input" value="password123" />
      </div>
      <div class="input-group">
        <label class="input-label">Disabled</label>
        <input type="text" class="input" disabled value="Cannot edit" />
      </div>
      <div class="input-group">
        <label class="input-label">Error State</label>
        <input type="text" class="input input-error" value="Invalid value" />
        <span class="input-error-text">This field is required</span>
      </div>
      <div class="input-group">
        <label class="input-label">Select</label>
        <select class="select">
          <option>Option 1</option>
          <option>Option 2</option>
          <option>Option 3</option>
        </select>
      </div>
      <div class="input-group">
        <label class="input-label">Small Input</label>
        <input type="text" class="input input-sm" placeholder="Small size" />
      </div>
      <div class="input-group">
        <label class="input-label">Large Input</label>
        <input type="text" class="input input-lg" placeholder="Large size" />
      </div>
    </div>
  `
  )}

  ${specimen(
    'Textarea',
    'input-textarea',
    `
    <textarea class="textarea" placeholder="Write a longer message..."></textarea>
  `
  )}

  ${specimen(
    'Checkboxes & Radios',
    'input-checks',
    `
    <div class="flex flex-wrap gap-8">
      <div>
        <p class="text-sm font-medium mb-3">Checkboxes</p>
        <div class="flex flex-col gap-2">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" class="checkbox" checked /> <span class="text-sm">Option A</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" class="checkbox" /> <span class="text-sm">Option B</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" class="checkbox" disabled /> <span class="text-sm text-muted">Disabled</span>
          </label>
        </div>
      </div>
      <div>
        <p class="text-sm font-medium mb-3">Radio Buttons</p>
        <div class="flex flex-col gap-2">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="radio-demo" class="radio" checked /> <span class="text-sm">Choice 1</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="radio-demo" class="radio" /> <span class="text-sm">Choice 2</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="radio-demo" class="radio" /> <span class="text-sm">Choice 3</span>
          </label>
        </div>
      </div>
    </div>
  `
  )}

  ${specimen(
    'Extended Inputs',
    'input-extended',
    `
    <p class="text-secondary mb-4">Input field with label, validation states, and icons.</p>
    <div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))">
      <div class="input-group">
        <label class="input-label">Default Input</label>
        <input class="input" placeholder="Enter text..." />
      </div>
      <div class="input-group">
        <label class="input-label">With Value</label>
        <input class="input" value="Hello World" />
      </div>
      <div class="input-group">
        <label class="input-label">Disabled</label>
        <input class="input" placeholder="Cannot edit" disabled />
      </div>
    </div>
  `
  )}
</div>`;
}
