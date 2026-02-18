/** Tables component page — striped data table with badges and actions. */

import { sectionHeading, specimen } from '../../utils/helpers';

export function renderTables(): string {
  return `
<div class="page-tables">
  ${sectionHeading('Tables', 'tables', 'Data tables with striping, badges, and inline actions.')}

  ${specimen(
    'Striped Table',
    'table-striped',
    `
    <div class="overflow-x-auto">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="font-medium">Alice Chen</td>
            <td class="text-secondary">Engineer</td>
            <td><span class="badge badge-success">Active</span></td>
            <td><button class="btn btn-ghost btn-xs">Edit</button></td>
          </tr>
          <tr>
            <td class="font-medium">Bob Martin</td>
            <td class="text-secondary">Designer</td>
            <td><span class="badge badge-success">Active</span></td>
            <td><button class="btn btn-ghost btn-xs">Edit</button></td>
          </tr>
          <tr>
            <td class="font-medium">Carol Davis</td>
            <td class="text-secondary">Product</td>
            <td><span class="badge badge-warning">Away</span></td>
            <td><button class="btn btn-ghost btn-xs">Edit</button></td>
          </tr>
          <tr>
            <td class="font-medium">Dan Lopez</td>
            <td class="text-secondary">Marketing</td>
            <td><span class="badge badge-error">Offline</span></td>
            <td><button class="btn btn-ghost btn-xs">Edit</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  `
  )}

  <div class="mt-10 pt-6" style="border-top: 1px solid var(--border-subtle)">
    <a href="#/playground?component=tables" class="btn btn-primary">Open in Playground</a>
  </div>
</div>`;
}
