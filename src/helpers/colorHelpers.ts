import ImageColors from 'react-native-image-colors';
import {COLOR_BACKGROUND} from '../constants/colors';

export const getDominantColor = async (
  imageUrl: string,
  fallbackColor?: string,
) => {
  try {
    const colors = await ImageColors.getColors(imageUrl);
    if (colors.platform === 'android') {
      return colors.dominant;
    } else {
      return colors.detail ?? colors.primary;
    }
  } catch (e) {
    return fallbackColor;
  }
};

export const getGradientColors = (startColor?: string) => {
  return [(startColor || COLOR_BACKGROUND) + 'AA', COLOR_BACKGROUND];
};
