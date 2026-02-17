import { test, expect } from '@playwright/test';
import { setupSoltanaPage } from '../fixtures/soltana-page';
import { captureChangeEvent } from '../fixtures/helpers';

test.describe('soltana:change event', () => {
  test('fires on setTheme', async ({ page }) => {
    await setupSoltanaPage(page);
    await page.evaluate(() => {
      (window as any).__soltanaInstance = window.SoltanaUI.initSoltana();
    });

    const detail = await captureChangeEvent(page, async () => {
      await page.evaluate(() => (window as any).__soltanaInstance.setTheme('light'));
    });

    expect(detail).toEqual({ type: 'theme', value: 'light' });
  });

  test('fires on setRelief', async ({ page }) => {
    await setupSoltanaPage(page);
    await page.evaluate(() => {
      (window as any).__soltanaInstance = window.SoltanaUI.initSoltana();
    });

    const detail = await captureChangeEvent(page, async () => {
      await page.evaluate(() => (window as any).__soltanaInstance.setRelief('flat'));
    });

    expect(detail.type).toBe('relief');
    expect(detail.value).toBe('flat');
  });

  test('fires on setFinish', async ({ page }) => {
    await setupSoltanaPage(page);
    await page.evaluate(() => {
      (window as any).__soltanaInstance = window.SoltanaUI.initSoltana();
    });

    const detail = await captureChangeEvent(page, async () => {
      await page.evaluate(() => (window as any).__soltanaInstance.setFinish('frosted'));
    });

    expect(detail.type).toBe('finish');
    expect(detail.value).toBe('frosted');
  });

  test('fires on setOrnament', async ({ page }) => {
    await setupSoltanaPage(page);
    await page.evaluate(() => {
      (window as any).__soltanaInstance = window.SoltanaUI.initSoltana();
    });

    const detail = await captureChangeEvent(page, async () => {
      await page.evaluate(() => (window as any).__soltanaInstance.setOrnament('gilt'));
    });

    expect(detail.type).toBe('ornament');
    expect(detail.value).toBe('gilt');
  });

  test('fires on setOverrides', async ({ page }) => {
    await setupSoltanaPage(page);
    await page.evaluate(() => {
      (window as any).__soltanaInstance = window.SoltanaUI.initSoltana();
    });

    const detail = await captureChangeEvent(page, async () => {
      await page.evaluate(() => (window as any).__soltanaInstance.setOverrides({ '--x': '1' }));
    });

    expect(detail.type).toBe('overrides');
  });

  test('fires on removeOverrides', async ({ page }) => {
    await setupSoltanaPage(page);
    await page.evaluate(() => {
      const s = window.SoltanaUI.initSoltana();
      s.setOverrides({ '--x': '1' });
      (window as any).__soltanaInstance = s;
    });

    const detail = await captureChangeEvent(page, async () => {
      await page.evaluate(() => (window as any).__soltanaInstance.removeOverrides(['--x']));
    });

    expect(detail.type).toBe('overrides');
  });

  test('fires on reset', async ({ page }) => {
    await setupSoltanaPage(page);
    await page.evaluate(() => {
      (window as any).__soltanaInstance = window.SoltanaUI.initSoltana();
    });

    const detail = await captureChangeEvent(page, async () => {
      await page.evaluate(() => (window as any).__soltanaInstance.reset());
    });

    expect(detail.type).toBe('reset');
  });
});
