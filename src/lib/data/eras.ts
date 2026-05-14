import type { EraInfo } from '@/types/timeline';

export const eras: EraInfo[] = [
  { id: 'ancient-egypt', name: '古埃及', startYear: -3000, endYear: -332 },
  { id: 'ancient-babylon', name: '古巴比伦', startYear: -2000, endYear: -539 },
  { id: 'ancient-greece', name: '古希腊', startYear: -600, endYear: -300 },
  { id: 'ancient-china', name: '古中国', startYear: -100, endYear: 500 },
  { id: 'ancient-india', name: '古印度', startYear: -500, endYear: 1200 },
  { id: 'islamic-golden-age', name: '伊斯兰黄金时代', startYear: 750, endYear: 1258 },
  { id: 'medieval-europe', name: '中世纪欧洲', startYear: 500, endYear: 1400 },
  { id: 'renaissance', name: '文艺复兴', startYear: 1400, endYear: 1600 },
  { id: 'early-modern', name: '近代早期', startYear: 1600, endYear: 1700 },
  { id: '18th-century', name: '18 世纪', startYear: 1700, endYear: 1800 },
  { id: '19th-century', name: '19 世纪', startYear: 1800, endYear: 1900 },
  { id: 'modern', name: '现代', startYear: 1900, endYear: 2024 },
];
