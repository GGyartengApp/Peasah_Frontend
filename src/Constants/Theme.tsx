import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
  primary: '#2D5016',
  accent: '#7AB648',
  background: '#F5F5F0',
  card: '#FFFFFF',
  textPrimary: '#1A2E0A',
  textSecondary: '#6B7C5A',
  border: '#D4E6B5',
  success: '#4CAF50',
  error: '#EF4444',
  warning: '#F59E0B',
  inputBg: '#FAFDF6',
  inputFocusBg: '#F0F9E8',
};

export const DARK_COLORS = {
  ...COLORS,
  background: '#1A2409',
  card: '#243010',
  textPrimary: '#E8F5D0',
  textSecondary: '#A8C07A',
  border: '#3D6B20',
};

export const SIZES = {
  width,
  height,
  h1: 32,
  h2: 24,
  h3: 20,
  h4: 16,
  h5: 14,
  h6: 12,
};