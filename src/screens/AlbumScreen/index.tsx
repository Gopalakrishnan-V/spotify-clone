import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Animated,
  LayoutChangeEvent,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {useSelector} from 'react-redux';

import Button from '../../components/Button';
import AnimatedHeader from '../../components/AnimatedHeader';
import Loader from '../../components/Loader';
import AnimatedTopBar from '../../components/AnimatedTopBar';
import TrackItem from '../../components/TrackItem';
import {getDominantColor, getGradientColors} from '../../helpers/colorHelpers';
import {addTracks} from '../../helpers/playerHelpers';
import {shuffleArray} from '../../helpers/commonHelpers';
import {
  getArtwork,
  getFirstArtistName,
  convertSpotifyTracksToTrackPlayerTracks,
} from '../../helpers/spotifyHelpers';
import ScreenWrapper from '../../components/ScreenWrapper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SPACE_64, SPACE_16, SPACE_24} from '../../constants/dimens';
import Footer from './Footer';
import NavigationHelper from '../../helpers/NavigationHelper';
import {getYear} from '../../helpers/dateHelpers';
import {COLOR_BACKGROUND, COLOR_TRANSPARENT} from '../../constants/colors';
import {HomeStackParamList} from '../MainScreen';
import {IArtistItem} from '../../interfaces/artist';
import {fetchAlbumDetails} from '../../slices/album';
import {RootState, useAppDispatch} from '../../store';

const ItemType = {
  STICKY_BUTTON: 'STICKY_BUTTON',
  TRACK: 'TRACK',
};

interface AlbumScreenProps {
  navigation: StackNavigationProp<HomeStackParamList>;
  route: RouteProp<HomeStackParamList, 'Album'>;
}

const AlbumScreen: React.FC<AlbumScreenProps> = props => {
  const {route, navigation} = props;
  const albumId = route.params.id;
  const {album, currentTrack} = useSelector((state: RootState) => ({
    album: state.album.details[albumId],
    currentTrack: state.player.track,
  }));
  const dispatch = useAppDispatch();
  const [headerHeight, setHeaderHeight] = useState(0);
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
    dispatch(fetchAlbumDetails(albumId));
  }, [albumId, dispatch]);

  useEffect(() => {
    if (album) {
      (async () => {
        const artwork = album.images.length > 0 ? album.images[0].url : null;
        if (artwork) {
          setDominantColor(await getDominantColor(artwork));
        }
      })();
    }
  }, [album]);

  const handleShufflePress = useCallback(() => {
    if (album) {
      addTracks(
        shuffleArray(
          convertSpotifyTracksToTrackPlayerTracks(album.tracks.items, album),
        ),
      );
    }
  }, [album]);

  const handleTrackPress = useCallback(
    trackIndex => async () => {
      if (album) {
        addTracks(
          convertSpotifyTracksToTrackPlayerTracks(
            album.tracks.items.slice(trackIndex),
            album,
          ),
        );
      }
    },
    [album],
  );

  const handleArtistPress = useCallback(
    (artist: IArtistItem) =>
      NavigationHelper.gotoArtistScreen(navigation, artist.id),
    [navigation],
  );

  const renderItem = useCallback(
    ({item}) => {
      switch (item.type) {
        case ItemType.STICKY_BUTTON: {
          return (
            <Button
              text="Shuffle play"
              style={styles.shuffleButton}
              onPress={handleShufflePress}
            />
          );
        }
        case ItemType.TRACK: {
          return (
            <TrackItem
              data={item.data}
              isPlaying={item.data.id === currentTrack?.id}
              onPress={handleTrackPress(item.trackIndex)}
            />
          );
        }
        default: {
          return null;
        }
      }
    },
    [handleShufflePress, handleTrackPress, currentTrack],
  );

  if (!album) {
    return <Loader />;
  }

  const animatedTopBarBgColor = animatedOffsetValue.interpolate({
    inputRange: [0, headerHeight * 0.5, headerHeight],
    outputRange: [COLOR_TRANSPARENT, COLOR_TRANSPARENT, COLOR_BACKGROUND],
    extrapolate: 'clamp',
  });

  const animatedTopBarTitleOpacity = animatedOffsetValue.interpolate({
    inputRange: [0, headerHeight * 0.5, headerHeight],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  const animateHeaderOpacity = animatedOffsetValue.interpolate({
    inputRange: [0, headerHeight * 0.5, headerHeight],
    outputRange: [1, 0.3, 0],
    extrapolate: 'clamp',
  });

  const {tracks} = album;
  const trackItems = tracks.items.map((track, trackIndex) => ({
    type: ItemType.TRACK,
    data: track,
    trackIndex,
  }));
  const listItems = [{type: ItemType.STICKY_BUTTON}, ...trackItems];
  const subTitleParts = [];
  subTitleParts.push(getFirstArtistName(album.artists));
  subTitleParts.push(getYear(album.releaseDate));
  const subTitle = subTitleParts.join(' • ');
  const imageUrl = getArtwork(album.images);
  const isHeaderHeightCalculated = headerHeight > 0;
  const listStyle = [
    styles.list,
    {
      paddingTop: headerHeight - SPACE_64 - insets.top,
      opacity: isHeaderHeightCalculated ? 1 : 0,
    },
  ];

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <AnimatedHeader
          title={album.name}
          subTitle={subTitle}
          imageUrl={imageUrl}
          gradientColors={getGradientColors(dominantColor)}
          animatedOpacity={animateHeaderOpacity}
          onLayout={(event: LayoutChangeEvent) => {
            const {height} = event.nativeEvent.layout;
            setHeaderHeight(height);
          }}
        />

        <View style={styles.listWrapper}>
          <AnimatedTopBar
            title={album.name}
            animatedBgColor={animatedTopBarBgColor}
            animatedTitleOpacity={animatedTopBarTitleOpacity}
            onBackPress={navigation.goBack}
          />
          <FlatList
            data={listItems}
            renderItem={renderItem}
            ListFooterComponent={
              <Footer album={album} onArtistPress={handleArtistPress} />
            }
            keyExtractor={(_item, index) => String(index)}
            stickyHeaderIndices={[0]}
            alwaysBounceVertical={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={listStyle}
            extraData={{dominantColor, currentTrack}}
            scrollEventThrottle={16}
            onScroll={onScrollEvent}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default AlbumScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  list: {
    paddingBottom: SPACE_16,
  },
  shuffleButton: {
    alignSelf: 'center',
    marginBottom: SPACE_24,
  },
});
