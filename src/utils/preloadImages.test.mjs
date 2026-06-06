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

test('preloadImages retries a failed image and reports retry state', async () => {
  const originalImage = globalThis.Image;
  const events = [];
  const attemptsByUrl = new Map();

  class FakeImage {
    set src(value) {
      this._src = value;
      const cacheKey = value.split('?')[0];
      const attempts = (attemptsByUrl.get(cacheKey) || 0) + 1;
      attemptsByUrl.set(cacheKey, attempts);
      queueMicrotask(() => {
        if (attempts === 1) {
          this.onerror?.();
          return;
        }

        this.onload?.();
      });
    }

    decode() {
      return Promise.resolve();
    }
  }

  globalThis.Image = FakeImage;

  try {
    const { preloadImages } = await loadPreloadImages();

    await preloadImages(['retry.png'], {
      retryDelay: 0,
      onStatus: (status) => events.push(status),
    });

    assert.equal(attemptsByUrl.get('retry.png'), 2);
    assert.equal(events.some((event) => event.status === 'retrying' && event.attempt === 1), true);
    assert.equal(events.at(-1).status, 'loaded');
  } finally {
    globalThis.Image = originalImage;
  }
});

test('preloadImages reports the blocked image after retries are exhausted', async () => {
  const originalImage = globalThis.Image;
  const events = [];

  class FakeImage {
    set src(value) {
      this._src = value;
      queueMicrotask(() => this.onerror?.());
    }
  }

  globalThis.Image = FakeImage;

  try {
    const { preloadImages } = await loadPreloadImages();

    await assert.rejects(
      () => preloadImages(['broken.png'], {
        maxRetries: 5,
        retryDelay: 0,
        onStatus: (status) => events.push(status),
      }),
      /网络异常，图片加载失败: broken\.png/,
    );

    const failedEvent = events.at(-1);
    assert.equal(failedEvent.status, 'failed');
    assert.equal(failedEvent.url, 'broken.png');
    assert.equal(failedEvent.attempt, 6);
    assert.equal(failedEvent.maxRetries, 5);
  } finally {
    globalThis.Image = originalImage;
  }
});
