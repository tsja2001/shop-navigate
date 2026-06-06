const imageLoadCache = new Map()
const DEFAULT_MAX_RETRIES = 5
const DEFAULT_RETRY_DELAY = 800

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const loadImage = (url, { cacheKey = url } = {}) => {
  if (imageLoadCache.has(cacheKey)) {
    return imageLoadCache.get(cacheKey)
  }

  const promise = new Promise((resolve, reject) => {
    const image = new Image()

    image.onload = async () => {
      try {
        if (image.decode) {
          await image.decode()
        }
      } catch {
        // The image is already loaded. Some browsers may reject decode for SVG or cached images.
      }

      resolve(url)
    }

    image.onerror = () => {
      imageLoadCache.delete(cacheKey)
      reject(new Error(`图片加载失败: ${url}`))
    }

    image.src = url
  })

  imageLoadCache.set(cacheKey, promise)
  return promise
}

const createCacheBustUrl = (url, attempt) => {
  if (attempt <= 1 || url.startsWith('data:') || url.startsWith('blob:')) {
    return url
  }

  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}retry=${attempt}-${Date.now()}`
}

const formatBytesPerSecond = (bytesPerSecond) => {
  if (!Number.isFinite(bytesPerSecond) || bytesPerSecond <= 0) {
    return '检测中'
  }

  if (bytesPerSecond >= 1024 * 1024) {
    return `${(bytesPerSecond / 1024 / 1024).toFixed(1)} MB/s`
  }

  if (bytesPerSecond >= 1024) {
    return `${Math.round(bytesPerSecond / 1024)} KB/s`
  }

  return `${Math.round(bytesPerSecond)} B/s`
}

const loadImageWithRetries = async (url, options) => {
  const maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES
  const retryDelay = options.retryDelay ?? DEFAULT_RETRY_DELAY
  let lastError

  for (let attempt = 1; attempt <= maxRetries + 1; attempt += 1) {
    const startedAt = performance.now()
    options.onStatus?.({
      status: 'loading',
      url,
      attempt,
      maxRetries,
      current: options.current,
      total: options.total,
      loaded: options.loaded,
    })

    try {
      const requestUrl = createCacheBustUrl(url, attempt)
      await loadImage(requestUrl, { cacheKey: url })
      const durationMs = Math.max(performance.now() - startedAt, 1)

      options.onStatus?.({
        status: 'loaded',
        url,
        attempt,
        maxRetries,
        current: options.current,
        total: options.total,
        loaded: options.loaded + 1,
        durationMs,
        speedText: formatBytesPerSecond(options.estimatedBytes / (durationMs / 1000)),
      })

      return
    } catch (error) {
      lastError = error
      imageLoadCache.delete(url)

      if (attempt > maxRetries) {
        const failedError = new Error(`网络异常，图片加载失败: ${url}`)
        failedError.cause = lastError
        failedError.url = url
        failedError.attempt = attempt
        failedError.maxRetries = maxRetries

        options.onStatus?.({
          status: 'failed',
          url,
          attempt,
          maxRetries,
          current: options.current,
          total: options.total,
          loaded: options.loaded,
          error: failedError.message,
        })

        throw failedError
      }

      options.onStatus?.({
        status: 'retrying',
        url,
        attempt,
        nextAttempt: attempt + 1,
        maxRetries,
        current: options.current,
        total: options.total,
        loaded: options.loaded,
        error: lastError.message,
      })

      if (retryDelay > 0) {
        await wait(retryDelay)
      }
    }
  }
}

/**
 * 预加载 Web 图片，并在图片下载和解码完成后 resolve。
 * @param {string|string[]} urls - 单个图片 URL 或图片 URL 数组
 * @param {{
 *   onProgress?: (loaded: number, total: number, url: string) => void,
 *   onStatus?: (status: object) => void,
 *   maxRetries?: number,
 *   retryDelay?: number,
 *   estimatedBytes?: number
 * }} options
 */
export const preloadImages = async (urls, options = {}) => {
  const urlArray = typeof urls === 'string' ? [urls] : urls
  const total = urlArray.length
  let loaded = 0
  const estimatedBytes = options.estimatedBytes ?? 1024 * 1024

  for (let index = 0; index < urlArray.length; index += 1) {
    const url = urlArray[index]
    await loadImageWithRetries(url, {
      ...options,
      current: index + 1,
      total,
      loaded,
      estimatedBytes,
    })
    loaded += 1
    options.onProgress?.(loaded, total, url)
  }
}
