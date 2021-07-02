import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Text from '../Text';
import {COLOR_BACKGROUND, COLOR_TEXT_SECONDARY} from '../../constants/colors';
import {SPACE_12, SPACE_16, SPACE_4} from '../../constants/dimens';
import {getYear} from '../../helpers/dateHelpers';

export default function AlbumItem(props) {
  const {data, appendAlbumInSubTitle = true} = props;
  const windowWidth = useWindowDimensions().width;
  const imageSize = windowWidth * 0.2;

  const {name, images, release_date} = data;
  const imageUrl = images?.[0]?.url;
  const imageStyle = [styles.image, {width: imageSize, height: imageSize}];

  const releaseYear = getYear(release_date);
  const subTitle = `${releaseYear}${appendAlbumInSubTitle ? ' • Album' : ''}`;

  return (
    <TouchableOpacity
      onPress={props.onPress}
      activeOpacity={0.8}
      style={styles.container}>
      <Image source={{uri: imageUrl}} style={imageStyle} />

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
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACE_16,
    paddingVertical: SPACE_16,
    backgroundColor: COLOR_BACKGROUND,
  },
  content: {
    flex: 1,
  },
  image: {
    borderRadius: SPACE_4,
    marginRight: SPACE_12,
  },
  subTitle: {
    color: COLOR_TEXT_SECONDARY,
    marginTop: SPACE_4,
  },
});
