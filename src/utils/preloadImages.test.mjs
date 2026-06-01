import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

async function loadPreloadImages() {
  const source = await readFile(new URL('./preloadImages.js', import.meta.url), 'utf8');
  const transformed = source
    .replace('export const preloadImages =', 'const preloadImages =')
    .concat('\nreturn { preloadImages };');

  return Function(`${transformed}`)();
}

test('preloadImages waits for every image and reports progress', async () => {
  const originalImage = globalThis.Image;
  const progress = [];

  class FakeImage {
    set src(value) {
      this._src = value;
      queueMicrotask(() => this.onload?.());
    }

    decode() {
      return Promise.resolve();
    }
  }

  globalThis.Image = FakeImage;

  try {
    const { preloadImages } = await loadPreloadImages();

    await preloadImages(['one.png', 'two.png'], {
      onProgress: (loaded, total, url) => progress.push({ loaded, total, url }),
    });

    assert.deepEqual(progress, [
      { loaded: 1, total: 2, url: 'one.png' },
      { loaded: 2, total: 2, url: 'two.png' },
    ]);
  } finally {
    globalThis.Image = originalImage;
  }
});
