import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Image,
  StyleSheet,
  useWindowDimensions,
  Dimensions,
} from 'react-native';
import TrackPlayer, {
  TrackPlayerEvents,
  useTrackPlayerEvents,
  STATE_PLAYING,
} from 'react-native-track-player';
import TextTicker from 'react-native-text-ticker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

import {getDominantColor, getGradientColors} from '../../helpers/colorHelpers';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  COLOR_BACKGROUND,
  COLOR_FADED,
  COLOR_TEXT_SECONDARY,
  COLOR_WHITE,
} from '../../constants/colors';
import {
  SPACE_4,
  SPACE_16,
  SPACE_24,
  SPACE_32,
  SPACE_64,
  SPACE_48,
} from '../../constants/dimens';
import textStyles from '../../constants/textStyles';
import {} from '../../constants';
import Header from './Header';
import BottomControls from './BottomControls';

const events = [
  TrackPlayerEvents.PLAYBACK_STATE,
  TrackPlayerEvents.PLAYBACK_ERROR,
];

const IMAGE_SIZE = Dimensions.get('window').width - SPACE_48;

const PlayerScreen = props => {
  const {navigation} = props;
  const [track, setTrack] = useState(null);
  const [playerState, setPlayerState] = useState(null);
  const [dominantColor, setDominantColor] = useState(COLOR_BACKGROUND);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    let mounted = true;

    // Set the initial track:
    (async () => {
      try {
        const trackId = await TrackPlayer.getCurrentTrack();
        if (!mounted || !trackId) return;
        const track = await TrackPlayer.getTrack(trackId);
        if (!mounted) return;
        setTrack(track);
        const dominantColor = await getDominantColor(
          track.artwork,
          COLOR_BACKGROUND,
        );
        if (!mounted) return;
        setDominantColor(dominantColor);
      } catch (e) {
        console.log({e});
      }
    })();

    // Set the track whenever the track changes:
    const trackChangedListener = TrackPlayer.addEventListener(
      'playback-track-changed',
      async data => {
        try {
          if (data.nextTrack) {
            const track = await TrackPlayer.getTrack(data.nextTrack);
            if (!mounted) return;
            setTrack(track);
            const dominantColor = await getDominantColor(
              track.artwork,
              COLOR_BACKGROUND,
            );
            if (!mounted) return;
            setDominantColor(dominantColor);
          }
        } catch (err) {
          console.log({err});
        }
      },
    );

    TrackPlayer.getState().then(state => {
      if (!mounted) {
        return;
      }
      setPlayerState(state);
    });

    return () => {
      mounted = false;
      trackChangedListener.remove();
    };
  }, []);

  useTrackPlayerEvents(events, event => {
    if (event.type === TrackPlayerEvents.PLAYBACK_ERROR) {
      console.warn('An error occured while playing the current track.');
    }
    if (event.type === TrackPlayerEvents.PLAYBACK_STATE) {
      setPlayerState(event.state);
    }
  });

  const handleHeaderAlbumPress = useCallback(() => {
    navigation.navigate('Album', {id: track.albumId});
  }, [navigation, track?.albumId]);

  const isPlaying = playerState === STATE_PLAYING;

  if (!track) {
    return null;
  }

  const containerStyle = [styles.container, {paddingBottom: insets.bottom + 8}];
  const topBarStyle = {marginTop: insets.top};

  const colors = getGradientColors(dominantColor);

  return (
    <LinearGradient colors={colors} style={containerStyle}>
      <Header
        albumName={track.albumName}
        style={topBarStyle}
        onDownPress={navigation.goBack}
        onAlbumPress={handleHeaderAlbumPress}
      />

      <Image source={{uri: track.artwork}} style={styles.image} />

      <BottomControls
        title={track.title}
        artist={track.artist}
        isPlaying={isPlaying}
        onPreviousPress={() => TrackPlayer.skipToPrevious()}
        onPlayPress={() => TrackPlayer.play()}
        onPausePress={() => TrackPlayer.pause()}
        onNextPress={() => TrackPlayer.skipToNext()}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: SPACE_24,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
});

export default PlayerScreen;
