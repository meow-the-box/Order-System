/**
 * localStorage 封装
 */

const KEYS = {
  WELCOME_SEEN: 'tongue_welcome_seen',
  HISTORY_LIST: 'tongue_history_list',
  DETAIL_PREFIX: 'tongue_detail_',
};

// 检查是否首次访问
export const isFirstVisit = () => {
  return !localStorage.getItem(KEYS.WELCOME_SEEN);
};

// 标记已访问
export const markVisited = () => {
  localStorage.setItem(KEYS.WELCOME_SEEN, 'true');
};

// 获取历史列表
export const getHistoryList = () => {
  try {
    const data = localStorage.getItem(KEYS.HISTORY_LIST);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// 保存分析结果
export const saveAnalysis = (analysis, imageBase64) => {
  const id = `t_${Date.now()}`;
  const timestamp = new Date().toISOString();

  // 保存详情
  const detail = {
    ...analysis,
    image: imageBase64,
    timestamp,
  };

  try {
    localStorage.setItem(`${KEYS.DETAIL_PREFIX}${id}`, JSON.stringify(detail));

    // 更新列表
    const list = getHistoryList();
    const newRecord = {
      id,
      date: timestamp.split('T')[0],
      constitution: analysis.constitution,
    };
    const updatedList = [newRecord, ...list].slice(0, 20);
    localStorage.setItem(KEYS.HISTORY_LIST, JSON.stringify(updatedList));

    return id;
  } catch (error) {
    console.error('保存失败:', error);
    throw new Error('存储空间不足，请清理历史记录');
  }
};

// 获取分析详情
export const getAnalysisDetail = (id) => {
  try {
    const data = localStorage.getItem(`${KEYS.DETAIL_PREFIX}${id}`);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

// 删除记录
export const deleteAnalysis = (id) => {
  localStorage.removeItem(`${KEYS.DETAIL_PREFIX}${id}`);
  const list = getHistoryList().filter((item) => item.id !== id);
  localStorage.setItem(KEYS.HISTORY_LIST, JSON.stringify(list));
};

// 清空所有历史
export const clearAllHistory = () => {
  const list = getHistoryList();
  list.forEach((item) => {
    localStorage.removeItem(`${KEYS.DETAIL_PREFIX}${item.id}`);
  });
  localStorage.removeItem(KEYS.HISTORY_LIST);
};
