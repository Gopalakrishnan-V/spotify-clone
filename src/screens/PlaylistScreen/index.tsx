import React, {useState, useEffect, useRef, useCallback} from 'react';
import {View, FlatList, StyleSheet, Animated} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';

import Button from '../../components/Button';
import AnimatedHeader from '../../components/AnimatedHeader';
import Loader from '../../components/Loader';
import AnimatedTopBar from '../../components/AnimatedTopBar';
import TrackItem from '../../components/TrackItem';
import {getDominantColor, getGradientColors} from '../../helpers/colorHelpers';
import {addTracks} from '../../helpers/playerHelpers';
import {
  getArtwork,
  convertSpotifyTracksToTrackPlayerTracks,
} from '../../helpers/spotifyHelpers';
import ScreenWrapper from '../../components/ScreenWrapper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SPACE_24, SPACE_64} from '../../constants/dimens';
import {COLOR_BACKGROUND, COLOR_TRANSPARENT} from '../../constants/colors';
import {commas} from '../../helpers/textHelpers';
import {HomeStackParamList} from '../MainScreen';
import {RootState} from '../../store';
import {fetchPlaylist} from '../../slices/playlist';

const ItemType = {
  STICKY_BUTTON: 'STICKY_BUTTON',
  TRACK: 'TRACK',
};

interface PlaylistScreenProps {
  navigation: StackNavigationProp<HomeStackParamList>;
  route: RouteProp<HomeStackParamList, 'Playlist'>;
}

const PlaylistScreen: React.FC<PlaylistScreenProps> = props => {
  const {route, navigation} = props;
  const playlistId = route.params.id;
  const dispatch = useDispatch();

  const {playlist, currentTrack} = useSelector((state: RootState) => ({
    playlist: state.playlist.details[playlistId],
    currentTrack: state.player.track,
  }));

  const [headerHeight, setHeaderHeight] = useState(10);
  const [dominantColor, setDominantColor] = useState<string>();
  const insets = useSafeAreaInsets();

  const animatedOffsetValue = useRef(new Animated.Value(0)).current;

  const onScrollEvent = useRef(
    Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {y: animatedOffsetValue},
          },
        },
      ],
      {useNativeDriver: false},
    ),
  ).current;

  useEffect(() => {
    dispatch(fetchPlaylist(playlistId));
  }, [dispatch, navigation, playlistId]);

  useEffect(() => {
    (async () => {
      if (playlist) {
        const artwork =
          playlist.images.length > 0 ? playlist.images[0].url : null;
        if (artwork) {
          setDominantColor(await getDominantColor(artwork));
        }
      }
    })();
  }, [playlist]);

  const handlePlayPress = useCallback(() => {
    if (playlist) {
      addTracks(
        convertSpotifyTracksToTrackPlayerTracks(
          playlist.tracks.items.map(item => item.track),
        ),
      );
    }
  }, [playlist]);

  const handleTrackPress = useCallback(
    trackIndex => async () => {
      if (playlist) {
        addTracks(
          convertSpotifyTracksToTrackPlayerTracks(
            playlist.tracks.items.slice(trackIndex).map(item => item.track),
          ),
        );
      }
    },
    [playlist],
  );

  const renderItem = useCallback(
    ({item, index}) => {
      switch (item.type) {
        case ItemType.STICKY_BUTTON: {
          return (
            <Button
              text="Play"
              style={styles.playButton}
              onPress={handlePlayPress}
            />
          );
        }
        case ItemType.TRACK: {
          return (
            <TrackItem
              data={item.data}
              isPlaying={item.data.id === currentTrack?.id}
              imageVisible
              onPress={handleTrackPress(item.trackIndex)}
            />
          );
        }
        default: {
          return null;
        }
      }
    },
    [handlePlayPress, handleTrackPress, currentTrack],
  );

  if (!playlist) {
    return <Loader />;
  }

  const animatedTopBarBgColor = animatedOffsetValue.interpolate({
    inputRange: [0, headerHeight * 0.3, headerHeight],
    outputRange: [COLOR_TRANSPARENT, COLOR_TRANSPARENT, COLOR_BACKGROUND],
    extrapolate: 'clamp',
  });

  const animatedTopBarTitleOpacity = animatedOffsetValue.interpolate({
    inputRange: [0, headerHeight * 0.3, headerHeight],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  const animateHeaderOpacity = animatedOffsetValue.interpolate({
    inputRange: [0, headerHeight * 0.5, headerHeight],
    outputRange: [1, 0.3, 0],
    extrapolate: 'clamp',
  });

  const {name, images, owner, followers, tracks} = playlist;
  const imageUrl = getArtwork(images);
  const subTitleParts = [];
  if (owner) {
    subTitleParts.push(`BY ${owner.displayName}`.toUpperCase());
  }
  if (followers) {
    subTitleParts.push(`${commas(followers.total)} LIKES`);
  }
  const subTitle = subTitleParts.join(' • ');

  const trackItems = tracks.items.map(({track}, index) => ({
    type: ItemType.TRACK,
    data: track,
    trackIndex: index,
  }));
  const listItems = [{type: ItemType.STICKY_BUTTON}, ...trackItems];

  return (
    <ScreenWrapper>
      <AnimatedHeader
        title={name}
        subTitle={subTitle}
        imageUrl={imageUrl}
        gradientColors={getGradientColors(dominantColor)}
        animatedOpacity={animateHeaderOpacity}
        onLayout={event => {
          const {height} = event.nativeEvent.layout;
          setHeaderHeight(height);
        }}
      />

      <View style={styles.listWrapper}>
        <AnimatedTopBar
          title={playlist.name}
          animatedBgColor={animatedTopBarBgColor}
          animatedTitleOpacity={animatedTopBarTitleOpacity}
          onBackPress={navigation.goBack}
        />
        <FlatList
          data={listItems}
          renderItem={renderItem}
          keyExtractor={(_item, index) => String(index)}
          stickyHeaderIndices={[0]}
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: headerHeight - SPACE_64 - insets.top,
          }}
          extraData={{dominantColor, currentTrack}}
          scrollEventThrottle={16}
          onScroll={onScrollEvent}
        />
      </View>
    </ScreenWrapper>
  );
};

export default PlaylistScreen;

const styles = StyleSheet.create({
  listWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  playButton: {
    alignSelf: 'center',
    marginBottom: SPACE_24,
  },
});
