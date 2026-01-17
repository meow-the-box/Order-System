/**
 * 压缩图片
 * @param {File} file - 图片文件
 * @param {number} maxSize - 最大尺寸（像素）
 * @param {number} quality - 压缩质量 (0-1)
 * @returns {Promise<string>} - base64 字符串
 */
export const compressImage = (file, maxSize = 1024, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // 按比例缩放
        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // 返回 base64
        const base64 = canvas.toDataURL('image/jpeg', quality);
        resolve(base64);
      };

      img.onerror = () => reject(new Error('图片加载失败'));
      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsDataURL(file);
  });
};
