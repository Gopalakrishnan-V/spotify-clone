import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import TrackPlayer, {
  TrackPlayerEvents,
  useTrackPlayerEvents,
  STATE_PLAYING,
  STATE_NONE,
} from 'react-native-track-player';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getNavigationRef} from '../../../RootNavigation';
import {BottomTabBarHeightContext} from '../../App';
import {getBottomPlayerImageSize} from '../../helpers/playerHelpers';
import TrackProgressView from '../TrackProgressView';

const events = [
  TrackPlayerEvents.PLAYBACK_TRACK_CHANGED,
  TrackPlayerEvents.PLAYBACK_STATE,
];

const BottomPlayer = props => {
  const [track, setTrack] = useState(null);
  const [playerState, setPlayerState] = useState(null);
  const windowWidth = useWindowDimensions().width;
  const {bottomTabBarHeight} = useContext(BottomTabBarHeightContext);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const trackId = await TrackPlayer.getCurrentTrack();
      if (!mounted || !trackId) return;
      const [currentTrack, currentPlayerState] = await Promise.all([
        TrackPlayer.getTrack(trackId),
        TrackPlayer.getState(),
      ]);
      if (mounted) {
        setTrack(currentTrack);
        setPlayerState(currentPlayerState);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useTrackPlayerEvents(events, async event => {
    if (event.type === TrackPlayerEvents.PLAYBACK_TRACK_CHANGED) {
      try {
        if (event.nextTrack) {
          const track = await TrackPlayer.getTrack(event.nextTrack);
          setTrack(track);
        }
      } catch (err) {
        console.log({err});
      }
    } else if (event.type === TrackPlayerEvents.PLAYBACK_STATE) {
      setPlayerState(event.state);
    }
  });

  const handlePlayerPress = () => {
    getNavigationRef()?.navigate('Player');
  };

  if (!track || !playerState || playerState === STATE_NONE) {
    return null;
  }

  const {title, artist, artwork} = track;
  const isPlaying = playerState === STATE_PLAYING;

  const containerStyle = [
    styles.container,
    props.style,
    // {bottom: bottomTabBarHeight},
  ];
  const imageSize = getBottomPlayerImageSize(windowWidth);
  const artworkStyle = {width: imageSize, height: imageSize};

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handlePlayerPress}
      style={containerStyle}>
      <TrackProgressView />
      <View style={styles.content}>
        <Image source={{uri: artwork}} style={artworkStyle} />
        <View style={styles.contentLeft}>
          <Text style={styles.trackTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.artistNames} numberOfLines={1}>
            {artist}
          </Text>
        </View>
        <View style={styles.contentRight}>
          <Icon name="heart-outline" size={24} color="white" />

          <Icon
            name={isPlaying ? 'pause' : 'play'}
            onPress={() => {
              if (isPlaying) {
                TrackPlayer.pause();
              } else {
                TrackPlayer.play();
              }
            }}
            size={32}
            style={styles.playPauseIcon}
            color="white"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BottomPlayer;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    backgroundColor: '#1b1b1b',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  artwork: {
    width: 80,
    height: 80,
  },
  contentLeft: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  },
  trackTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  artistNames: {
    marginTop: 2,
    fontSize: 14,
    color: '#808080',
  },
  contentRight: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  playPauseIcon: {
    marginLeft: 16,
  },
});
