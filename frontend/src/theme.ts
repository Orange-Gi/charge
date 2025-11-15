import type { ThemeConfig } from 'antd';

export const palette = {
  primary: '#0B63CE',
  primarySoft: '#E6F0FF',
  accent: '#2AD1D2',
  background: '#F5F8FB',
  surface: '#FFFFFF',
  border: '#E3E8EF',
  text: '#1F2937',
  muted: '#5F6C7B',
  success: '#19A974',
  warning: '#FFB020',
  danger: '#D64550',
};

export const theme: ThemeConfig = {
  token: {
    colorPrimary: palette.primary,
    colorInfo: palette.primary,
    colorBgLayout: palette.background,
    colorBgContainer: palette.surface,
    colorBorderSecondary: palette.border,
    colorText: palette.text,
    colorTextSecondary: palette.muted,
    borderRadius: 10,
    fontFamily:
      '"Inter", "Microsoft YaHei", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  components: {
    Layout: {
      headerBg: palette.surface,
      siderBg: '#0A2745',
    },
    Menu: {
      itemActiveBg: 'rgba(255, 255, 255, 0.15)',
      itemSelectedBg: '#0D5EC2',
      itemSelectedColor: '#FFFFFF',
      itemColor: '#A0B3C6',
    },
    Card: {
      colorBorderSecondary: palette.border,
    },
    Button: {
      colorBgContainer: palette.primary,
      colorBorder: palette.primary,
    },
  },
};
