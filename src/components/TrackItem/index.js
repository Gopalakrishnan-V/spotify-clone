import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Text from '../Text';
import {FONT_MEDIUM} from '../../constants';
import {
  COLOR_BACKGROUND,
  COLOR_FADED,
  COLOR_TEXT_PRIMARY,
  COLOR_TEXT_SECONDARY,
} from '../../constants/colors';
import {
  SPACE_12,
  SPACE_16,
  SPACE_2,
  SPACE_24,
  SPACE_4,
  SPACE_8,
} from '../../constants/dimens';
import {getArtwork} from '../../helpers/spotifyHelpers';

export default function TrackItem(props) {
  const {data, imageVisible = false, rank, rankVisible = false} = props;
  const windowWidth = useWindowDimensions().width;
  const imageSize = windowWidth * 0.125;

  const {name, artists, album} = data;
  const artistNames = (artists || []).map(artist => artist.name).join(', ');
  const imageUrl = getArtwork(album?.images);
  const imageStyle = [styles.image, {width: imageSize, height: imageSize}];

  return (
    <TouchableOpacity
      onPress={props.onPress}
      activeOpacity={0.8}
      style={[styles.container, props.style]}>
      {rankVisible && (
        <Text
          label={String(rank)}
          as="small2"
          style={styles.rank}
          numberOfLines={1}
        />
      )}

      {imageVisible && <Image source={{uri: imageUrl}} style={imageStyle} />}

      <View style={styles.content}>
        <Text label={name} as="title5" numberOfLines={1} />
        <Text
          label={artistNames}
          as="small1"
          style={styles.subTitle}
          numberOfLines={1}
        />
      </View>
      <Icon name="dots-vertical" size={SPACE_24} color={COLOR_FADED} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACE_16,
    paddingTop: SPACE_12,
    paddingBottom: SPACE_12,
    backgroundColor: COLOR_BACKGROUND,
  },
  content: {
    flex: 1,
    marginRight: SPACE_16,
  },
  rank: {
    color: COLOR_TEXT_PRIMARY,
    marginLeft: SPACE_4,
    marginRight: SPACE_16 + SPACE_4,
  },
  image: {
    borderRadius: SPACE_2,
    marginRight: SPACE_12,
  },
  subTitle: {
    color: COLOR_TEXT_SECONDARY,
    marginTop: SPACE_2,
  },
});
