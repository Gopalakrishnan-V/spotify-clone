import ImageColors from 'react-native-image-colors';
import {CATEGORY_COLORS} from '../constants/categoryColors';
import {COLOR_BACKGROUND} from '../constants/colors';

const dominantColorCache: {[imageUrl: string]: string | undefined} = {};
export const getDominantColor = async (
  imageUrl: string,
  fallbackColor?: string,
) => {
  // Checking the cache
  const cachedColor = dominantColorCache[imageUrl];
  if (cachedColor) {
    return cachedColor;
  }

  try {
    const colors = await ImageColors.getColors(imageUrl);
    if (colors.platform === 'android') {
      dominantColorCache[imageUrl] = colors.dominant;
    } else {
      dominantColorCache[imageUrl] = colors.detail ?? colors.primary;
    }
    return dominantColorCache[imageUrl];
  } catch (e) {
    return fallbackColor;
  }
};

export const getGradientColors = (startColor?: string) => {
  return [(startColor || COLOR_BACKGROUND) + 'AA', COLOR_BACKGROUND];
};

export const getCategoryColor = (index: number) => {
  return CATEGORY_COLORS[index % CATEGORY_COLORS.length];
};
