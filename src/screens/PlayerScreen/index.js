import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import TrackPlayer, {
  TrackPlayerEvents,
  useTrackPlayerEvents,
  STATE_PLAYING,
} from 'react-native-track-player';
import TextTicker from 'react-native-text-ticker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import TrackSlider from '../../components/TrackSlider';
import {getDominantColor, getGradientColors} from '../../helpers/colorHelpers';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const events = [
  TrackPlayerEvents.PLAYBACK_STATE,
  TrackPlayerEvents.PLAYBACK_ERROR,
];

const COLOR_BLACK = '#000000';

const PlayerScreen = props => {
  const {navigation} = props;
  const [track, setTrack] = useState(null);
  const [playerState, setPlayerState] = useState(null);
  const [dominantColor, setDominantColor] = useState(COLOR_BLACK);

  const windowWidth = useWindowDimensions().width;
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
          COLOR_BLACK,
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
              COLOR_BLACK,
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
      if (!mounted) return;
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
  const topBarStyle = [styles.topBar, {marginTop: insets.top}];
  const artworkStyle = {
    width: windowWidth - 24 * 2,
    height: windowWidth - 24 * 2,
  };

  const colors = getGradientColors(dominantColor);

  return (
    <LinearGradient colors={colors} style={containerStyle}>
      <View style={topBarStyle}>
        <Icon
          name="chevron-down"
          size={32}
          color="#FFFFFF"
          onPress={() => navigation.goBack()}
        />
        <TouchableOpacity
          onPress={handleHeaderAlbumPress}
          style={styles.topBarContent}>
          <Text style={styles.topBarSubtitle} numberOfLines={1}>
            PLAYING FROM ALBUM
          </Text>
          <TextTicker
            duration={5000}
            loop
            bounce
            repeatSpacer={50}
            marqueeDelay={1000}
            style={styles.topBarTitle}
            numberOfLines={1}>
            {track.albumName}
          </TextTicker>
        </TouchableOpacity>
        <Icon name="dots-vertical" size={24} color="#FFFFFF" />
      </View>

      <Image source={{uri: track.artwork}} style={artworkStyle} />

      <View>
        <View style={styles.trackDetailsRow}>
          <View style={styles.trackDetailsRowContent}>
            <TextTicker
              duration={5000}
              loop
              bounce
              repeatSpacer={50}
              marqueeDelay={1000}
              style={styles.titleText}
              numberOfLines={1}>
              {track.title}
            </TextTicker>

            <TextTicker
              style={styles.artistText}
              numberOfLines={1}
              duration={5000}
              loop
              bounce
              repeatSpacer={50}
              marqueeDelay={1000}>
              {track.artist}
            </TextTicker>
          </View>
          <Icon name="heart-outline" size={24} color="white" />
        </View>

        <TrackSlider style={styles.trackProgress} />

        <View style={styles.controlsRow}>
          <Icon name="shuffle" size={24} color="white" />
          <Icon
            name="skip-previous"
            size={32}
            color="white"
            onPress={() => TrackPlayer.skipToPrevious()}
          />
          <Icon
            name={isPlaying ? 'pause-circle' : 'play-circle'}
            onPress={() => {
              if (isPlaying) {
                TrackPlayer.pause();
              } else {
                TrackPlayer.play();
              }
            }}
            size={64}
            color="white"
          />
          <Icon
            name="skip-next"
            size={32}
            color="white"
            onPress={() => TrackPlayer.skipToNext()}
          />
          <Icon name="repeat" size={24} color="white" />
        </View>

        <View style={styles.bottomRow}>
          <Icon name="monitor-speaker" size={20} color="#808080" />
          <Icon name="playlist-music" size={24} color="#808080" />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 0,
    marginHorizontal: -6,
  },
  topBarContent: {
    flex: 1,
    marginHorizontal: 12,
    alignItems: 'center',
  },
  topBarTitle: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  topBarSubtitle: {
    fontSize: 10,
    color: '#FFFFFF',
  },
  artwork: {
    width: 200,
    height: 200,
  },
  trackDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackDetailsRowContent: {
    flex: 1,
    marginRight: 16,
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  artistText: {
    fontSize: 14,
    marginTop: 4,
    color: '#7D7D7D',
  },
  trackProgress: {
    marginTop: 4,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
});

export default PlayerScreen;
