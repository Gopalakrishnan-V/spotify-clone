import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Text from '../Text';
import {COLOR_BACKGROUND, COLOR_TEXT_SECONDARY} from '../../constants/colors';
import {SPACE_12, SPACE_16, SPACE_4} from '../../constants/dimens';
import {getYear} from '../../helpers/dateHelpers';
import {IAlbumItem} from '../../interfaces/album';
import {getArtwork} from '../../helpers/spotifyHelpers';

const IMAGE_SIZE = Dimensions.get('window').width * 0.2;
export const ITEM_SIZE = IMAGE_SIZE + SPACE_12 * 2;

interface AlbumItemProps {
  data: IAlbumItem;
  onPress: () => void;
  appendAlbumInSubTitle?: boolean;
}

const AlbumItem: React.FC<AlbumItemProps> = ({
  data,
  onPress,
  appendAlbumInSubTitle = true,
}) => {
  const {name, images, releaseDate} = data;
  const imageUrl = getArtwork(images) ?? '-';

  const releaseYear = getYear(releaseDate);
  const subTitle = `${releaseYear}${appendAlbumInSubTitle ? ' • Album' : ''}`;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.container}>
      <Image source={{uri: imageUrl}} style={styles.image} />

      <View style={styles.content}>
        <Text label={name} as="title5" numberOfLines={1} ellipsizeMode="tail" />
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
    paddingVertical: SPACE_12,
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
  },
  subTitle: {
    color: COLOR_TEXT_SECONDARY,
    marginTop: SPACE_4,
  },
});

export default React.memo(
  AlbumItem,
  (prevProps, nextProps) => prevProps.data.id === nextProps.data.id,
);
