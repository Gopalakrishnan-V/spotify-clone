import React from 'react';
import {StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import TrackPlayer, {
  STATE_PLAYING,
  STATE_NONE,
} from 'react-native-track-player';
import TextTicker from 'react-native-text-ticker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';

import Text from '../Text';
import {getNavigationRef} from '../../../RootNavigation';
import {getBottomPlayerImageSize} from '../../helpers/playerHelpers';
import TrackProgressView from '../TrackProgressView';
import {Dimensions} from 'react-native';
import {
  SPACE_12,
  SPACE_16,
  SPACE_2,
  SPACE_24,
  SPACE_32,
} from '../../constants/dimens';
import {
  COLOR_BLACK,
  COLOR_BOTTOM_BAR,
  COLOR_TEXT_SECONDARY,
  COLOR_WHITE,
} from '../../constants/colors';
import {FONT_BOLD} from '../../constants';
import textStyles from '../../constants/textStyles';
import {RootState} from '../../store';
import NavigationHelper from '../../helpers/NavigationHelper';

const IMAGE_SIZE = getBottomPlayerImageSize(Dimensions.get('window').width);

interface BottomPlayerProps {
  style?: any;
}

const BottomPlayer: React.FC<BottomPlayerProps> = props => {
  const {track, playerState} = useSelector((state: RootState) => ({
    track: state.player.track,
    playerState: state.player.state,
  }));

  const handlePlayerPress = () => {
    NavigationHelper.gotoPlayerScreen(getNavigationRef());
  };

  if (!track || !playerState || playerState === STATE_NONE) {
    return null;
  }

  const {title, artist, artwork} = track;
  const isPlaying = playerState === STATE_PLAYING;

  const containerStyle = [styles.container, props.style];

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handlePlayerPress}
      style={containerStyle}>
      <TrackProgressView />
      <View style={styles.content}>
        <Image source={{uri: artwork}} style={styles.artwork} />
        <View style={styles.contentLeft}>
          <Text
            label={title}
            as="title6"
            style={styles.trackTitle}
            numberOfLines={1}
          />
          <TextTicker
            style={[textStyles.small1, styles.artistNames]}
            numberOfLines={1}
            scrollSpeed={500}
            bounce={false}>
            {artist}
          </TextTicker>
        </View>
        <View style={styles.contentRight}>
          <Icon name="heart-outline" size={SPACE_24} color="white" />

          <Icon
            name={isPlaying ? 'pause' : 'play'}
            onPress={() => {
              if (isPlaying) {
                TrackPlayer.pause();
              } else {
                TrackPlayer.play();
              }
            }}
            size={SPACE_32}
            style={styles.playPauseIcon}
            color={COLOR_WHITE}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BottomPlayer;

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: COLOR_BLACK,
    backgroundColor: COLOR_BOTTOM_BAR,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  artwork: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
  contentLeft: {
    flex: 1,
    marginLeft: SPACE_12,
    marginRight: SPACE_12,
  },
  trackTitle: {
    fontFamily: FONT_BOLD,
  },
  artistNames: {
    marginTop: SPACE_2,
    color: COLOR_TEXT_SECONDARY,
  },
  contentRight: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACE_12,
  },
  playPauseIcon: {
    marginLeft: SPACE_16,
  },
});
