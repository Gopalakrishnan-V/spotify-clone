import React, {useState, useEffect, useCallback} from 'react';
import {Image, StyleSheet, Dimensions} from 'react-native';
import TrackPlayer, {
  Track,
  State,
  TrackPlayerEvents,
  useTrackPlayerEvents,
  STATE_PLAYING,
} from 'react-native-track-player';
import LinearGradient from 'react-native-linear-gradient';

import {getDominantColor, getGradientColors} from '../../helpers/colorHelpers';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {COLOR_BACKGROUND} from '../../constants/colors';
import {SPACE_24, SPACE_48, SPACE_8} from '../../constants/dimens';
import Header from './Header';
import BottomControls from './BottomControls';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../Navigator';
import NavigationHelper from '../../helpers/NavigationHelper';

const events = [
  TrackPlayerEvents.PLAYBACK_STATE,
  TrackPlayerEvents.PLAYBACK_ERROR,
];

const IMAGE_SIZE = Dimensions.get('window').width - SPACE_48;

interface PlayerScreenProps {
  navigation: StackNavigationProp<RootStackParamList>;
}

const PlayerScreen: React.FC<PlayerScreenProps> = props => {
  const {navigation} = props;
  const [track, setTrack] = useState<Track>();
  const [playerState, setPlayerState] = useState<State>();
  const [dominantColor, setDominantColor] = useState<string | undefined>(
    COLOR_BACKGROUND,
  );

  const insets = useSafeAreaInsets();

  useEffect(() => {
    let mounted = true;

    // Set the initial track:
    (async () => {
      try {
        const trackId = await TrackPlayer.getCurrentTrack();
        if (!mounted || !trackId) {
          return;
        }
        const _track = await TrackPlayer.getTrack(trackId);
        if (!mounted) {
          return;
        }
        setTrack(_track);
        let _dominantColor = null;
        if (track?.artwork) {
          _dominantColor = await getDominantColor(
            track.artwork,
            COLOR_BACKGROUND,
          );
        }

        if (!mounted) {
          return;
        }
        if (_dominantColor) {
          setDominantColor(_dominantColor);
        }
      } catch (e) {}
    })();

    // Set the track whenever the track changes:
    const trackChangedListener = TrackPlayer.addEventListener(
      'playback-track-changed',
      async data => {
        try {
          if (data.nextTrack) {
            const _track = await TrackPlayer.getTrack(data.nextTrack);
            if (!mounted) {
              return;
            }
            setTrack(_track);
            const _dominantColor = await getDominantColor(
              _track.artwork,
              COLOR_BACKGROUND,
            );
            if (!mounted) {
              return;
            }
            setDominantColor(_dominantColor);
          }
        } catch (err) {}
      },
    );

    TrackPlayer.getState().then(_state => {
      if (!mounted) {
        return;
      }
      setPlayerState(_state);
    });

    return () => {
      mounted = false;
      trackChangedListener.remove();
    };
  }, [track?.artwork]);

  useTrackPlayerEvents(events, event => {
    if (event.type === TrackPlayerEvents.PLAYBACK_ERROR) {
      console.warn('An error occured while playing the current track.');
    }
    if (event.type === TrackPlayerEvents.PLAYBACK_STATE) {
      setPlayerState(event.state);
    }
  });

  const handleHeaderAlbumPress = useCallback(() => {
    if (track?.albumId) {
      NavigationHelper.gotoAlbumScreen(navigation, track.albumId);
    }
  }, [navigation, track?.albumId]);

  const isPlaying = playerState === STATE_PLAYING;

  if (!track) {
    return null;
  }

  const containerStyle = [
    styles.container,
    {paddingBottom: insets.bottom + SPACE_8},
  ];
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
        onPreviousPress={() => TrackPlayer.skipToPrevious().catch(() => {})}
        onPlayPress={() => TrackPlayer.play().catch(() => {})}
        onPausePress={() => TrackPlayer.pause().catch(() => {})}
        onNextPress={() => TrackPlayer.skipToNext().catch(() => {})}
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
