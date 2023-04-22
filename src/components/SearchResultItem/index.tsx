import React from 'react';
import {StyleSheet, View, TouchableOpacity, Dimensions} from 'react-native';
import Image from 'react-native-fast-image';

import Text from '../Text';
import {
  COLOR_BACKGROUND,
  COLOR_BORDER,
  COLOR_TEXT_SECONDARY,
} from '../../constants/colors';
import {SPACE_12, SPACE_16, SPACE_4, SPACE_8} from '../../constants/dimens';
import {ISearchResult} from '../../interfaces/search';
import {covertSearchResultToSearchResultItemData} from '../../helpers/searchHelpers';

const IMAGE_SIZE = Dimensions.get('window').width * 0.125;
export const ITEM_SIZE = IMAGE_SIZE + SPACE_12 * 2;

interface SearchResultItemProps {
  data: ISearchResult;
  onPress: () => void;
  isImageRounded?: boolean;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({
  data,
  onPress,
  isImageRounded = false,
}) => {
  const {imageUrl, title, subTitle} =
    covertSearchResultToSearchResultItemData(data);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.container}>
      <Image
        source={{uri: imageUrl ?? '-'}}
        style={[styles.image, isImageRounded && styles.imageRounded]}
      />

      <View style={styles.content}>
        <Text
          label={title}
          as="title5"
          numberOfLines={1}
          ellipsizeMode="tail"
        />
        <Text
          label={subTitle}
          as="small1"
          style={styles.subTitle}
          numberOfLines={1}
          ellipsizeMode="tail"
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACE_16,
    paddingVertical: SPACE_8,
    backgroundColor: COLOR_BACKGROUND,
  },
  content: {
    flex: 1,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: SPACE_4,
    marginRight: SPACE_12,
    backgroundColor: COLOR_BORDER,
  },
  imageRounded: {
    borderRadius: IMAGE_SIZE / 2,
  },
  subTitle: {
    color: COLOR_TEXT_SECONDARY,
    marginTop: SPACE_4,
  },
});

export default SearchResultItem;
