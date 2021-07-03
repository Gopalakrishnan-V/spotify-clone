import React, {useState, useCallback, useEffect} from 'react';
import {Image, StyleSheet, Dimensions} from 'react-native';
import TrackPlayer, {STATE_PLAYING} from 'react-native-track-player';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector} from 'react-redux';

import {getDominantColor, getGradientColors} from '../../helpers/colorHelpers';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {COLOR_BACKGROUND} from '../../constants/colors';
import {SPACE_24, SPACE_48, SPACE_8} from '../../constants/dimens';
import Header from './Header';
import BottomControls from './BottomControls';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../Navigator';
import NavigationHelper from '../../helpers/NavigationHelper';
import {RootState} from '../../store';

const IMAGE_SIZE = Dimensions.get('window').width - SPACE_48;

interface PlayerScreenProps {
  navigation: StackNavigationProp<RootStackParamList>;
}

const PlayerScreen: React.FC<PlayerScreenProps> = props => {
  const {navigation} = props;
  const {track, playerState} = useSelector((state: RootState) => ({
    track: state.player.track,
    playerState: state.player.state,
  }));

  const [dominantColor, setDominantColor] = useState<string | undefined>(
    COLOR_BACKGROUND,
  );

  useEffect(() => {
    if (track) {
      getDominantColor(track.artwork).then(setDominantColor);
    }
  }, [track]);

  const insets = useSafeAreaInsets();
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
