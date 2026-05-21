/** 设计令牌 - 颜色、字体、间距 */

export const colors = {
  // 主色调
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  // 时代配色
  era: {
    'ancient-egypt': '#d4a574',
    'ancient-babylon': '#c4956a',
    'ancient-greece': '#6b8cce',
    'ancient-china': '#d4574e',
    'ancient-india': '#e8a838',
    'islamic-golden-age': '#4a9e7a',
    'medieval-europe': '#8b7355',
    'renaissance': '#9b6b9e',
    'early-modern': '#5a8f7a',
    '18th-century': '#7a8b9e',
    '19th-century': '#6a7a8a',
    'modern': '#4a6a8a',
  } as Record<string, string>,
  // 难度配色
  difficulty: {
    L1: '#22c55e',
    L2: '#84cc16',
    L3: '#eab308',
    L4: '#f97316',
    L5: '#ef4444',
  } as Record<string, string>,
  // 中性色
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  // 背景色
  background: '#faf9f7',
  surface: '#ffffff',
  // 文本色
  textPrimary: '#1a1a2e',
  textSecondary: '#4a4a6a',
  textMuted: '#8888a8',
} as const;

/** 时代渐变色对 */
export const gradients: Record<string, [string, string]> = {
  'ancient-egypt': ['#d4a574', '#c4956a'],
  'ancient-babylon': ['#c4956a', '#a07850'],
  'ancient-greece': ['#6b8cce', '#4a6cb8'],
  'ancient-china': ['#d4574e', '#b83a32'],
  'ancient-india': ['#e8a838', '#d09020'],
  'islamic-golden-age': ['#4a9e7a', '#358562'],
  'medieval-europe': ['#8b7355', '#735d42'],
  'renaissance': ['#9b6b9e', '#7d4d80'],
  'early-modern': ['#5a8f7a', '#427562'],
  '18th-century': ['#7a8b9e', '#5c6d80'],
  '19th-century': ['#6a7a8a', '#4c5c6c'],
  'modern': ['#4a6a8a', '#2c4c6c'],
};

/** 时代图标 */
export const eraIcons: Record<string, string> = {
  'ancient-egypt': '🏛️',
  'ancient-babylon': '⭐',
  'ancient-greece': '🏛️',
  'ancient-china': '🏯',
  'ancient-india': '🕉️',
  'islamic-golden-age': '☪️',
  'medieval-europe': '⚔️',
  'renaissance': '🎨',
  'early-modern': '🔭',
  '18th-century': '⚙️',
  '19th-century': '📐',
  'modern': '💻',
};

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
    serif: ['Noto Serif SC', 'Georgia', 'Cambria', 'serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
} as const;

export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
} as const;

/** 动画令牌 */
export const animation = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    verySlow: '1000ms',
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  },
} as const;
