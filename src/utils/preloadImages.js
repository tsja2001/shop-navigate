const imageLoadCache = new Map()

const loadImage = (url) => {
  if (imageLoadCache.has(url)) {
    return imageLoadCache.get(url)
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
      imageLoadCache.delete(url)
      reject(new Error(`图片加载失败: ${url}`))
    }

    image.src = url
  })

  imageLoadCache.set(url, promise)
  return promise
}

/**
 * 预加载 Web 图片，并在图片下载和解码完成后 resolve。
 * @param {string|string[]} urls - 单个图片 URL 或图片 URL 数组
 * @param {{ onProgress?: (loaded: number, total: number, url: string) => void }} options
 */
export const preloadImages = async (urls, options = {}) => {
  const urlArray = typeof urls === 'string' ? [urls] : urls
  const total = urlArray.length
  let loaded = 0

  await Promise.all(
    urlArray.map(async (url) => {
      await loadImage(url)
      loaded += 1
      options.onProgress?.(loaded, total, url)
    }),
  )
}
