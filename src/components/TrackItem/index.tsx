import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Text from '../Text';
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
} from '../../constants/dimens';
import {getArtwork} from '../../helpers/spotifyHelpers';
import {ITrack} from '../../interfaces/track';

const IMAGE_SIZE = Dimensions.get('window').width * 0.125;

interface TrackItemProps {
  data: ITrack;
  onPress: () => void;
  imageVisible?: boolean;
  rank?: number;
  rankVisible?: boolean;
  style?: any;
}

const TrackItem: React.FC<TrackItemProps> = ({
  data,
  onPress,
  imageVisible = false,
  rank,
  rankVisible = false,
  style,
}) => {
  const {name, artists, album} = data;
  const artistNames = artists.map(artist => artist.name).join(', ');
  const imageUrl = getArtwork(album?.images);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.container, style]}>
      {rankVisible && (
        <Text
          label={String(rank)}
          as="small2"
          style={styles.rank}
          numberOfLines={1}
        />
      )}

      {imageVisible && <Image source={{uri: imageUrl}} style={styles.image} />}

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
};

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
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: SPACE_2,
    marginRight: SPACE_12,
  },
  subTitle: {
    color: COLOR_TEXT_SECONDARY,
    marginTop: SPACE_2,
  },
});

export default TrackItem;
