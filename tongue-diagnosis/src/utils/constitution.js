/**
 * 体质相关配置
 */

// 体质颜色映射
export const constitutionColors = {
  '平和质': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
  '气虚质': { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' },
  '阳虚质': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  '阴虚质': { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
  '痰湿质': { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
  '湿热质': { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
  '血瘀质': { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-300' },
  '气郁质': { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-300' },
  '特禀质': { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
};

// 获取体质颜色
export const getConstitutionColor = (constitution) => {
  return constitutionColors[constitution] || constitutionColors['平和质'];
};

// 体质简介
export const constitutionInfo = {
  '平和质': '阴阳气血调和，体态适中，面色红润，精力充沛。',
  '气虚质': '元气不足，容易疲乏，气短懒言，易出汗。',
  '阳虚质': '阳气不足，畏寒怕冷，手足不温，喜热饮食。',
  '阴虚质': '阴液亏少，口燥咽干，手足心热，喜冷饮。',
  '痰湿质': '痰湿凝聚，形体肥胖，腹部肥满，口黏苔腻。',
  '湿热质': '湿热内蕴，面垢油光，口苦口干，身重困倦。',
  '血瘀质': '血行不畅，肤色晦暗，易有瘀斑，口唇暗淡。',
  '气郁质': '气机郁滞，情绪抑郁，忧虑脆弱，胸闷不舒。',
  '特禀质': '先天禀赋不足，易过敏，适应能力差。',
};
