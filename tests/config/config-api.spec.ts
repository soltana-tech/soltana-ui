import { test, expect } from '@playwright/test';
import { setupSoltanaPage } from '../fixtures/soltana-page';
import {
  getTierAttributes,
  captureWarnings,
  captureErrors,
  getInlineStyleProperty,
} from '../fixtures/helpers';

const enhancerHTML = `
  <button data-modal-open="test-modal">Open</button>
  <div id="test-modal" data-sol-modal aria-hidden="true">
    <div class="modal-backdrop"></div>
    <div class="modal" role="dialog" aria-modal="true">
      <button data-modal-close>Close</button>
      <input type="text" />
    </div>
  </div>
  <div data-sol-tabs id="test-tabs">
    <div role="tablist">
      <button role="tab" aria-selected="true">Tab 1</button>
      <button role="tab">Tab 2</button>
    </div>
    <div role="tabpanel">Panel 1</div>
    <div role="tabpanel" hidden>Panel 2</div>
  </div>
  <button data-sol-tooltip="Tip text" style="margin:100px;">Hover</button>`;

test.describe('initSoltana', () => {
  test('applies default config (auto/neumorphic/matte)', async ({ page }) => {
    await setupSoltanaPage(page);
    await page.evaluate(() => window.SoltanaUI.initSoltana());

    const attrs = await getTierAttributes(page);
    expect(['dark', 'light']).toContain(attrs.theme);
    expect(attrs.relief).toBe('neumorphic');
    expect(attrs.finish).toBe('matte');
  });

  test('applies custom config (light/skeuomorphic/frosted)', async ({ page }) => {
    await setupSoltanaPage(page);
    await page.evaluate(() =>
      window.SoltanaUI.initSoltana({
        theme: 'light',
        relief: 'skeuomorphic',
        finish: 'frosted',
      })
    );

    const attrs = await getTierAttributes(page);
    expect(attrs).toEqual({
      theme: 'light',
      relief: 'skeuomorphic',
      finish: 'frosted',
    });
  });

  test('setTheme updates data-theme', async ({ page }) => {
    await setupSoltanaPage(page);
    await page.evaluate(() => {
      const s = window.SoltanaUI.initSoltana();
      s.setTheme('sepia');
    });

    const attrs = await getTierAttributes(page);
    expect(attrs.theme).toBe('sepia');
  });

  test('setRelief updates data-relief', async ({ page }) => {
    await setupSoltanaPage(page);
    await page.evaluate(() => {
      const s = window.SoltanaUI.initSoltana();
      s.setRelief('glassmorphic');
    });

    const attrs = await getTierAttributes(page);
    expect(attrs.relief).toBe('glassmorphic');
  });

  test('setFinish updates data-finish', async ({ page }) => {
    await setupSoltanaPage(page);
    await page.evaluate(() => {
      const s = window.SoltanaUI.initSoltana();
      s.setFinish('tinted');
    });

    const attrs = await getTierAttributes(page);
    expect(attrs.finish).toBe('tinted');
  });

  test('setOverrides applies inline CSS variables', async ({ page }) => {
    await setupSoltanaPage(page);
    await page.evaluate(() => {
      const s = window.SoltanaUI.initSoltana();
      s.setOverrides({ '--custom-color': '#ff0000' });
    });

    const value = await getInlineStyleProperty(page, '--custom-color');
    expect(value).toBe('#ff0000');
  });

  test('reset restores defaults and clears overrides', async ({ page }) => {
    await setupSoltanaPage(page);
    await page.evaluate(() => {
      const s = window.SoltanaUI.initSoltana({
        theme: 'sepia',
        relief: 'skeuomorphic',
      });
      s.setOverrides({ '--custom': 'value' });
      s.reset();
    });

    const attrs = await getTierAttributes(page);
    expect(['dark', 'light']).toContain(attrs.theme);
    expect(attrs.relief).toBe('neumorphic');
    expect(attrs.finish).toBe('matte');

    const overrideValue = await getInlineStyleProperty(page, '--custom');
    expect(overrideValue).toBe('');
  });

  test('getState returns current config', async ({ page }) => {
    await setupSoltanaPage(page);
    const state = await page.evaluate(() => {
      const s = window.SoltanaUI.initSoltana({ theme: 'light', relief: 'glassmorphic' });
      return s.getState();
    });

    expect(state.theme).toBe('light');
    expect(state.relief).toBe('glassmorphic');
    expect(state.finish).toBe('matte');
  });

  test('auto theme resolves to dark or light', async ({ page }) => {
    await setupSoltanaPage(page);
    const result = await page.evaluate(() => {
      const s = window.SoltanaUI.initSoltana({ theme: 'auto' });
      return {
        resolved: document.documentElement.getAttribute('data-theme'),
        stateTheme: s.getState().theme,
      };
    });

    expect(['dark', 'light']).toContain(result.resolved);
    expect(result.stateTheme).toBe('auto');
  });

  test('destroy removes all data attributes and inline styles', async ({ page }) => {
    await setupSoltanaPage(page);
    await page.evaluate(() => {
      const s = window.SoltanaUI.initSoltana({
        theme: 'sepia',
        relief: 'skeuomorphic',
        finish: 'frosted',
      });
      s.setOverrides({ '--x': '10' });
      s.destroy();
    });

    const attrs = await getTierAttributes(page);
    expect(attrs.theme).toBeNull();
    expect(attrs.relief).toBeNull();
    expect(attrs.finish).toBeNull();

    const styleAttr = await page.evaluate(() => document.documentElement.getAttribute('style'));
    // Real browsers may return "" instead of null after style manipulation
    expect(styleAttr === null || styleAttr === '').toBe(true);
  });

  for (const [tier, config] of [
    ['theme', { theme: 'neon', strict: true }],
    ['relief', { relief: 'paper', strict: true }],
    ['finish', { finish: 'satin', strict: true }],
  ] as const) {
    test(`throws on unknown ${tier} in strict mode`, async ({ page }) => {
      await setupSoltanaPage(page);
      const error = await page.evaluate((cfg) => {
        try {
          window.SoltanaUI.initSoltana(cfg);
          return null;
        } catch (e) {
          return (e as Error).message;
        }
      }, config);

      expect(error).not.toBeNull();
      expect(error).toContain(`Unknown ${tier}`);
    });
  }

  test('warns on custom tier values in non-strict mode', async ({ page }) => {
    await setupSoltanaPage(page);
    const warnings = await captureWarnings(page, async () => {
      await page.evaluate(() =>
        window.SoltanaUI.initSoltana({
          theme: 'neon',
          relief: 'paper',
          finish: 'satin',
        })
      );
    });

    expect(warnings.length).toBe(3);
    expect(warnings.every((w) => w.includes('Unknown'))).toBe(true);
  });

  test('custom tier values set data attributes', async ({ page }) => {
    await setupSoltanaPage(page);
    const state = await page.evaluate(() => {
      const s = window.SoltanaUI.initSoltana({
        theme: 'neon',
        relief: 'glass',
        finish: 'satin',
      });
      return s.getState();
    });

    const attrs = await getTierAttributes(page);
    expect(attrs).toEqual({
      theme: 'neon',
      relief: 'glass',
      finish: 'satin',
    });
    expect(state.theme).toBe('neon');
    expect(state.relief).toBe('glass');
  });

  test('setTheme accepts custom values', async ({ page }) => {
    await setupSoltanaPage(page);
    const result = await page.evaluate(() => {
      const s = window.SoltanaUI.initSoltana();
      s.setTheme('neon');
      return {
        attr: document.documentElement.getAttribute('data-theme'),
        state: s.getState().theme,
      };
    });

    expect(result.attr).toBe('neon');
    expect(result.state).toBe('neon');
  });

  test('registerRecipe adds a recipe that applyRecipe can use', async ({ page }) => {
    await setupSoltanaPage(page);
    await page.evaluate(() => {
      const s = window.SoltanaUI.initSoltana();
      s.registerRecipe('my-preset', {
        name: 'My Preset',
        description: 'Custom recipe for testing.',
        theme: 'dark',
        relief: 'flat',
        finish: 'matte',
      });
      s.applyRecipe('my-preset');
    });

    const attrs = await getTierAttributes(page);
    expect(attrs.relief).toBe('flat');
  });

  test('default config does not inject font links', async ({ page }) => {
    await setupSoltanaPage(page);
    await page.evaluate(() => window.SoltanaUI.initSoltana());

    const linkCount = await page.evaluate(() => document.head.querySelectorAll('link').length);
    expect(linkCount).toBe(0);
  });

  test('setTheme to auto installs matchMedia listener', async ({ page }) => {
    await setupSoltanaPage(page);

    // Start with light theme, then switch to auto
    await page.evaluate(() => {
      const s = window.SoltanaUI.initSoltana({ theme: 'light' });
      s.setTheme('auto');
    });

    // The attribute should have resolved to dark or light
    const resolvedBefore = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(['dark', 'light']).toContain(resolvedBefore);

    // Emulate color scheme change and verify the listener responds
    await page.emulateMedia({ colorScheme: 'light' });
    await page.waitForFunction(
      () => document.documentElement.getAttribute('data-theme') === 'light'
    );

    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForFunction(
      () => document.documentElement.getAttribute('data-theme') === 'dark'
    );
  });

  test('destroy tears down auto-theme listener', async ({ page }) => {
    await setupSoltanaPage(page);
    await page.emulateMedia({ colorScheme: 'dark' });

    await page.evaluate(() => {
      const s = window.SoltanaUI.initSoltana({ theme: 'auto' });
      s.destroy();
    });

    // After destroy, emulating color scheme change should NOT update the attribute
    // (attribute is already removed by destroy)
    await page.emulateMedia({ colorScheme: 'light' });
    // Yield a frame to confirm no async listener fires
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(r)));
    const attr = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(attr).toBeNull();
  });

  test('multiple initSoltana calls do not accumulate listeners', async ({ page }) => {
    await setupSoltanaPage(page);
    await page.emulateMedia({ colorScheme: 'dark' });

    // Init twice with auto theme
    await page.evaluate(() => {
      window.SoltanaUI.initSoltana({ theme: 'auto' });
      window.SoltanaUI.initSoltana({ theme: 'auto' });
    });

    const attr = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(attr).toBe('dark');

    // Switch to light and verify only one update (attribute should be 'light')
    await page.emulateMedia({ colorScheme: 'light' });
    await page.waitForFunction(
      () => document.documentElement.getAttribute('data-theme') === 'light'
    );
  });

  test('switching from auto to fixed and back preserves listener behavior', async ({ page }) => {
    await setupSoltanaPage(page);
    await page.emulateMedia({ colorScheme: 'dark' });

    await page.evaluate(() => {
      const s = window.SoltanaUI.initSoltana({ theme: 'auto' });
      // Switch to fixed
      s.setTheme('light');
      // Switch back to auto
      s.setTheme('auto');
    });

    // Should respond to system changes again
    await page.emulateMedia({ colorScheme: 'light' });
    await page.waitForFunction(
      () => document.documentElement.getAttribute('data-theme') === 'light'
    );

    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForFunction(
      () => document.documentElement.getAttribute('data-theme') === 'dark'
    );
  });

  test('rapid theme changes settle correctly', async ({ page }) => {
    await setupSoltanaPage(page);

    const finalTheme = await page.evaluate(() => {
      const s = window.SoltanaUI.initSoltana({ theme: 'dark' });
      s.setTheme('light');
      s.setTheme('sepia');
      s.setTheme('dark');
      s.setTheme('auto');
      s.setTheme('light');
      return document.documentElement.getAttribute('data-theme');
    });

    expect(finalTheme).toBe('light');
  });

  test('rapid system color scheme changes resolve correctly', async ({ page }) => {
    await setupSoltanaPage(page);

    await page.evaluate(() => {
      window.SoltanaUI.initSoltana({ theme: 'auto' });
    });

    // Rapid system scheme changes
    await page.emulateMedia({ colorScheme: 'light' });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.emulateMedia({ colorScheme: 'light' });

    await page.waitForFunction(
      () => document.documentElement.getAttribute('data-theme') === 'light'
    );
  });
});

test.describe('enhancer integration', () => {
  test('does not initialize enhancers by default', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: enhancerHTML });
    await page.evaluate(() => window.SoltanaUI.initSoltana());

    // Modal: clicking open button should NOT add .active (enhancers off by default)
    await page.click('[data-modal-open="test-modal"]');
    const modalInactive = await page.evaluate(() =>
      document.getElementById('test-modal')?.classList.contains('active')
    );
    expect(modalInactive).toBe(false);
  });

  test('initializes enhancers when opted in', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: enhancerHTML });
    await page.evaluate(() => window.SoltanaUI.initSoltana({ enhancers: true }));

    // Modal: clicking open button should add .active
    await page.click('[data-modal-open="test-modal"]');
    const modalActive = await page.evaluate(() =>
      document.getElementById('test-modal')?.classList.contains('active')
    );
    expect(modalActive).toBe(true);

    // Tabs: clicking tab 2 should switch panels
    const tab2 = page.locator('[data-sol-tabs] [role="tab"]').nth(1);
    await tab2.click();
    const panel2Hidden = await page.evaluate(() => {
      const panels = document.querySelectorAll('[role="tabpanel"]');
      return { first: panels[0].hasAttribute('hidden'), second: !panels[1].hasAttribute('hidden') };
    });
    expect(panel2Hidden.first).toBe(true);
    expect(panel2Hidden.second).toBe(true);

    // Tooltip: hovering should create a tooltip element
    await page.hover('[data-sol-tooltip]');
    await page.waitForFunction(() => document.querySelector('.tooltip') !== null);
  });

  test('skips enhancers when enhancers: false', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: enhancerHTML });
    await page.evaluate(() => window.SoltanaUI.initSoltana({ enhancers: false }));

    // Modal: clicking open button should NOT add .active
    await page.click('[data-modal-open="test-modal"]');
    const modalActive = await page.evaluate(() =>
      document.getElementById('test-modal')?.classList.contains('active')
    );
    expect(modalActive).toBe(false);

    // Tabs: clicking tab 2 should NOT switch panels
    const tab2 = page.locator('[data-sol-tabs] [role="tab"]').nth(1);
    await tab2.click();
    const panel1Visible = await page.evaluate(
      () => !document.querySelectorAll('[role="tabpanel"]')[0].hasAttribute('hidden')
    );
    expect(panel1Visible).toBe(true);
  });

  test('destroy cleans up enhancer listeners', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: enhancerHTML });
    await page.evaluate(() => {
      const s = window.SoltanaUI.initSoltana({ enhancers: true });
      s.destroy();
    });

    // After destroy, clicking the open button should not open the modal
    // Re-set the page with attributes so the button is in a clean state
    await setupSoltanaPage(page, { bodyHTML: enhancerHTML });
    await page.evaluate(() => {
      const s = window.SoltanaUI.initSoltana({ enhancers: true });
      s.destroy();
    });

    await page.click('[data-modal-open="test-modal"]');
    const modalActive = await page.evaluate(() =>
      document.getElementById('test-modal')?.classList.contains('active')
    );
    expect(modalActive).toBe(false);

    // Tabs should not respond
    const tab2 = page.locator('[data-sol-tabs] [role="tab"]').nth(1);
    await tab2.click();
    const panel1Visible = await page.evaluate(
      () => !document.querySelectorAll('[role="tabpanel"]')[0].hasAttribute('hidden')
    );
    expect(panel1Visible).toBe(true);
  });

  test('reinitEnhancers re-initializes enhancers', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: enhancerHTML });
    await page.evaluate(() => {
      const s = window.SoltanaUI.initSoltana({ enhancers: true });
      s.destroy();
      // Re-init by calling initSoltana again
      const s2 = window.SoltanaUI.initSoltana({ enhancers: true });
      s2.reinitEnhancers();
    });

    // After reinit, modal should respond again
    await page.click('[data-modal-open="test-modal"]');
    const modalActive = await page.evaluate(() =>
      document.getElementById('test-modal')?.classList.contains('active')
    );
    expect(modalActive).toBe(true);
  });

  test('reset re-initializes enhancers', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: enhancerHTML });
    await page.evaluate(() => {
      const s = window.SoltanaUI.initSoltana({ enhancers: true });
      s.reset();
    });

    // After reset, modal should still respond
    await page.click('[data-modal-open="test-modal"]');
    const modalActive = await page.evaluate(() =>
      document.getElementById('test-modal')?.classList.contains('active')
    );
    expect(modalActive).toBe(true);
  });

  test('reinitEnhancers respects enhancers: false', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: enhancerHTML });
    await page.evaluate(() => {
      const s = window.SoltanaUI.initSoltana({ enhancers: false });
      s.reinitEnhancers();
    });

    // With enhancers: false, reinit should not activate enhancers
    await page.click('[data-modal-open="test-modal"]');
    const modalActive = await page.evaluate(() =>
      document.getElementById('test-modal')?.classList.contains('active')
    );
    expect(modalActive).toBe(false);
  });

  test('multiple initSoltana calls clean up previous enhancers', async ({ page }) => {
    await setupSoltanaPage(page, { bodyHTML: enhancerHTML });
    await page.evaluate(() => {
      window.SoltanaUI.initSoltana({ enhancers: true });
      window.SoltanaUI.initSoltana({ enhancers: true });
    });

    // The second init should still have working enhancers
    await page.click('[data-modal-open="test-modal"]');
    const modalActive = await page.evaluate(() =>
      document.getElementById('test-modal')?.classList.contains('active')
    );
    expect(modalActive).toBe(true);
  });
});

test.describe('stale instance', () => {
  test('stale instance destroy() is a no-op', async ({ page }) => {
    await setupSoltanaPage(page);
    const warnings = await captureWarnings(page, async () => {
      await page.evaluate(() => {
        const first = window.SoltanaUI.initSoltana({ theme: 'sepia' });
        window.SoltanaUI.initSoltana({ theme: 'light' });
        first.destroy();
      });
    });

    // Data attributes should remain (set by the second instance)
    const attrs = await getTierAttributes(page);
    expect(attrs.theme).toBe('light');
    expect(attrs.relief).toBe('neumorphic');
    expect(warnings.some((w) => w.includes('Stale instance'))).toBe(true);
  });

  test('stale instance reset() is a no-op', async ({ page }) => {
    await setupSoltanaPage(page);
    const warnings = await captureWarnings(page, async () => {
      await page.evaluate(() => {
        const first = window.SoltanaUI.initSoltana({ theme: 'sepia' });
        window.SoltanaUI.initSoltana({ theme: 'light' });
        first.reset();
      });
    });

    const attrs = await getTierAttributes(page);
    expect(attrs.theme).toBe('light');
    expect(warnings.some((w) => w.includes('Stale instance'))).toBe(true);
  });
});

test.describe('overrides via API', () => {
  test('setOverrides accumulates across multiple calls', async ({ page }) => {
    await setupSoltanaPage(page);
    const result = await page.evaluate(() => {
      const s = window.SoltanaUI.initSoltana();
      s.setOverrides({ '--a': '1' });
      s.setOverrides({ '--b': '2' });
      return {
        a: document.documentElement.style.getPropertyValue('--a'),
        b: document.documentElement.style.getPropertyValue('--b'),
        overrides: s.getState().overrides,
      };
    });

    expect(result.a).toBe('1');
    expect(result.b).toBe('2');
    expect(result.overrides).toEqual({ '--a': '1', '--b': '2' });
  });

  test('applies overrides from initial config', async ({ page }) => {
    await setupSoltanaPage(page);
    await page.evaluate(() =>
      window.SoltanaUI.initSoltana({ overrides: { '--init-var': 'hello' } })
    );

    const value = await getInlineStyleProperty(page, '--init-var');
    expect(value).toBe('hello');
  });

  test('removeOverrides removes individual keys', async ({ page }) => {
    await setupSoltanaPage(page);
    const result = await page.evaluate(() => {
      const s = window.SoltanaUI.initSoltana();
      s.setOverrides({ '--a': '1', '--b': '2', '--c': '3' });
      s.removeOverrides(['--a', '--c']);
      return {
        a: document.documentElement.style.getPropertyValue('--a'),
        b: document.documentElement.style.getPropertyValue('--b'),
        c: document.documentElement.style.getPropertyValue('--c'),
        overrides: s.getState().overrides,
      };
    });

    expect(result.a).toBe('');
    expect(result.b).toBe('2');
    expect(result.c).toBe('');
    expect(result.overrides).toEqual({ '--b': '2' });
  });

  test('errors on non-custom-property override keys', async ({ page }) => {
    await setupSoltanaPage(page);
    const errors = await captureErrors(page, async () => {
      await page.evaluate(() => {
        const s = window.SoltanaUI.initSoltana();
        s.setOverrides({ color: 'red' });
      });
    });

    expect(errors.some((e) => e.includes('not a CSS custom property'))).toBe(true);
  });

  test('skips non-custom-property override keys', async ({ page }) => {
    await setupSoltanaPage(page);
    const result = await page.evaluate(() => {
      window.SoltanaUI.initSoltana({ overrides: { color: 'red', '--valid': 'ok' } });
      return {
        color: document.documentElement.style.getPropertyValue('color'),
        valid: document.documentElement.style.getPropertyValue('--valid'),
      };
    });

    expect(result.color).toBe('');
    expect(result.valid).toBe('ok');
  });
});
