import ImageColors from 'react-native-image-colors';
import {COLOR_BLACK} from '../constants/colors';

export const getDominantColor = async (imageUrl, fallbackColor = null) => {
  try {
    const colors = await ImageColors.getColors(imageUrl);
    return colors.dominant ?? colors.detail ?? colors.primary;
  } catch (e) {
    return fallbackColor;
  }
};

export const getGradientColors = startColor => {
  return [(startColor || COLOR_BLACK) + '77', COLOR_BLACK];
};
