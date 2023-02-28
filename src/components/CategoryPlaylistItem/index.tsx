import React from 'react';
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ViewStyle,
} from 'react-native';
import Text from '../Text';
import {SPACE_16, SPACE_24, SPACE_4} from '../../constants/dimens';
import {getArtwork} from '../../helpers/spotifyHelpers';
import {ICategoryPlaylistItem} from '../../interfaces/category';

const IMAGE_SIZE =
  (Dimensions.get('window').width - SPACE_16 * 2 - SPACE_16) / 2;

interface CategoryPlaylistItemProps {
  data: ICategoryPlaylistItem;
  style: ViewStyle[] | ViewStyle | null;
  onPress: () => void;
}

const CategoryPlaylistItem: React.FC<CategoryPlaylistItemProps> = ({
  data,
  style,
  onPress,
}) => {
  const {name, images} = data;
  const imageUrl = getArtwork(images) ?? '-';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.container, style]}>
      <Image source={{uri: imageUrl}} style={styles.image} />

      <Text
        label={name}
        as="title5"
        numberOfLines={1}
        ellipsizeMode="tail"
        style={styles.name}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACE_24,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: SPACE_4,
  },
  name: {
    marginTop: SPACE_4,
  },
});

export default CategoryPlaylistItem;
