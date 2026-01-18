/**
 * API 调用
 */

export const analyzeTongue = async (imageBase64, signal) => {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image: imageBase64 }),
    signal, // TC-06: 支持超时取消
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || '分析失败，请稍后重试');
  }

  return response.json();
};
