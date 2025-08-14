/**
 * 预加载图片
 * @param {string|string[]} urls - 单个图片URL或图片URL数组
 */
export const preloadImages = (urls) => {
  // 转换为数组统一处理
  const urlArray = typeof urls === 'string' ? [urls] : urls;

  urlArray.forEach((url) => {
    wx.getImageInfo({
      src: url,
      success: (res) => {
        console.log('图片预加载成功:', url);
      },
      fail: (err) => {
        console.error('图片预加载失败:', url, err);
      }
    });
  });
};
