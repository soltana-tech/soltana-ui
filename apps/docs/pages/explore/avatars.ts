/** Avatars component page — sizes and accent-colored avatars. */

import { sectionHeading, specimen } from '../../utils/helpers';

export function renderAvatars(): string {
  return `
<div class="page-avatars">
  ${sectionHeading('Avatars', 'avatars', 'User avatars in multiple sizes and accent colors.')}

  ${specimen(
    'Avatar Sizes & Colors',
    'avatar-sizes',
    `
    <div class="flex items-center gap-4">
      <div class="avatar avatar-sm">S</div>
      <div class="avatar">MD</div>
      <div class="avatar avatar-lg">LG</div>
      <div class="avatar avatar-xl">XL</div>
      <div class="avatar" style="background: var(--accent-primary); color: var(--text-inverse)">AC</div>
      <div class="avatar" style="background: var(--color-success); color: var(--text-inverse)">JS</div>
      <div class="avatar" style="background: var(--color-warning); color: var(--text-inverse)">RK</div>
    </div>
  `
  )}

  <div class="mt-10 pt-6" style="border-top: 1px solid var(--border-subtle)">
    <a href="#/playground?component=avatars" class="btn btn-primary">Open in Playground</a>
  </div>
</div>`;
}
