import React, {useState, useEffect, useRef, useCallback} from 'react';
import {View, FlatList, StyleSheet, Animated} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';

import Text from '../../components/Text';
import Button from '../../components/Button';
import SpotifyClient from '../../../SpotifyClient';
import AnimatedHeader from '../../components/AnimatedHeader';
import Loader from '../../components/Loader';
import AnimatedTopBar from '../../components/AnimatedTopBar';
import TrackItem from '../../components/TrackItem';
import AlbumItem from '../../components/AlbumItem';
import {addTracks} from '../../helpers/playerHelpers';
import {shuffleArray} from '../../helpers/commonHelpers';
import {convertSpotifyTracksToTrackPlayerTracks} from '../../helpers/spotifyHelpers';
import ScreenWrapper from '../../components/ScreenWrapper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  SPACE_16,
  SPACE_24,
  SPACE_4,
  SPACE_48,
  SPACE_64,
  SPACE_8,
} from '../../constants/dimens';
import {commas} from '../../helpers/textHelpers';
import NavigationHelper from '../../helpers/NavigationHelper';
import {COLOR_BACKGROUND, COLOR_TRANSPARENT} from '../../constants/colors';
import {HomeStackParamList} from '../MainScreen';
import {IArtistDetails} from '../../interfaces/artist';
import {ITrack} from '../../interfaces/track';
import {IAlbumItem} from '../../interfaces/album';

const ItemType = {
  STICKY_BUTTON: 'STICKY_BUTTON',
  STICKY_BUTTON_BOTTOM_SPACE: 'STICKY_BUTTON_BOTTOM_SPACE',
  SECTION_HEADER: 'SECTION_HEADER',
  TRACK: 'TRACK',
  ALBUM: 'ALBUM',
};

interface ArtistScreenProps {
  navigation: StackNavigationProp<HomeStackParamList>;
  route: RouteProp<HomeStackParamList, 'Artist'>;
}

const ArtistScreen: React.FC<ArtistScreenProps> = props => {
  const {route, navigation} = props;
  const artistId = route.params.id;
  const [artist, setArtist] = useState<IArtistDetails>();
  const [topTracks, setTopTracks] = useState<{tracks: ITrack[]}>();
  const [albums, setAlbums] = useState<{items: IAlbumItem[]}>();
  const [headerHeight, setHeaderHeight] = useState(10);
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
    (async () => {
      try {
        const promises = [
          SpotifyClient.get(`v1/artists/${artistId}?market=IN`),
          SpotifyClient.get(`v1/artists/${artistId}/top-tracks?market=IN`),
          SpotifyClient.get(`v1/artists/${artistId}/albums?market=IN&limit=5`),
        ];
        const [artistRes, topTracksRes, albumsRes] = await Promise.all(
          promises,
        );
        setArtist(artistRes?.data);
        setTopTracks(topTracksRes?.data);
        setAlbums(albumsRes?.data);
      } catch (e) {}
    })();
  }, [artistId, navigation]);

  const handleShufflePress = useCallback(() => {
    if (topTracks) {
      addTracks(
        shuffleArray(convertSpotifyTracksToTrackPlayerTracks(topTracks.tracks)),
      );
    }
  }, [topTracks?.tracks]);

  const handleTrackPress = useCallback(
    trackIndex => async () => {
      if (topTracks) {
        addTracks(
          convertSpotifyTracksToTrackPlayerTracks(
            topTracks.tracks.slice(trackIndex),
          ),
        );
      }
    },
    [topTracks?.tracks],
  );

  const handleAlbumPress = useCallback(
    item => () => NavigationHelper.gotoAlbumScreen(navigation, item.id),
    [navigation],
  );

  const renderItem = useCallback(
    ({item}) => {
      switch (item.type) {
        case ItemType.STICKY_BUTTON: {
          return (
            <Button
              text="Shuffle play"
              style={styles.stickyButton}
              onPress={handleShufflePress}
            />
          );
        }
        case ItemType.STICKY_BUTTON_BOTTOM_SPACE: {
          return <View style={styles.stickyButtonBottomSpace} />;
        }
        case ItemType.SECTION_HEADER: {
          return (
            <View style={[styles.sectionHeader, item.style]}>
              <Text label={item.title} as="title5" />
            </View>
          );
        }
        case ItemType.TRACK: {
          return (
            <TrackItem
              data={item.data}
              imageVisible={true}
              rank={item.rank}
              rankVisible={true}
              onPress={handleTrackPress(item.trackIndex)}
              style={styles.trackItem}
            />
          );
        }
        case ItemType.ALBUM: {
          return (
            <AlbumItem data={item.data} onPress={handleAlbumPress(item.data)} />
          );
        }
        default: {
          return null;
        }
      }
    },
    [handleAlbumPress, handleShufflePress, handleTrackPress],
  );

  if (!artist || !topTracks || !albums) {
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

  const {followers} = artist;
  const {tracks} = topTracks;
  const trackItems = tracks.map((track, trackIndex) => ({
    data: track,
    type: ItemType.TRACK,
    trackIndex,
    rank: trackIndex + 1,
  }));
  const albumItems = albums.items.map(album => ({
    data: album,
    type: ItemType.ALBUM,
  }));

  const listItems = [];
  if (topTracks) {
    listItems.push(
      {type: ItemType.STICKY_BUTTON},
      {type: ItemType.STICKY_BUTTON_BOTTOM_SPACE},
      {type: ItemType.SECTION_HEADER, title: 'Popular'},
      ...trackItems,
    );
  }
  if (albums) {
    listItems.push(
      {
        type: ItemType.SECTION_HEADER,
        title: 'Releases',
        style: {marginTop: 24},
      },
      ...albumItems,
    );
  }
  const subTitle = `${commas(followers.total)} MONTHLY LISTENERS`;
  const imageUrl = artist.images[0]?.url;

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <AnimatedHeader
          title={artist.name}
          subTitle={subTitle}
          imageUrl={imageUrl}
          gradientColors={[COLOR_TRANSPARENT, COLOR_BACKGROUND]}
          animatedOpacity={animateHeaderOpacity}
          isArtistMode
          onLayout={event => {
            const {height} = event.nativeEvent.layout;
            setHeaderHeight(height);
          }}
        />

        <View style={styles.listWrapper}>
          <AnimatedTopBar
            title={artist.name}
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
            contentContainerStyle={[
              styles.list,
              {paddingTop: headerHeight - SPACE_64 - insets.top},
            ]}
            scrollEventThrottle={16}
            onScroll={onScrollEvent}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default ArtistScreen;

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
  stickyButton: {
    alignSelf: 'center',
    marginTop: 0,
    marginBottom: -SPACE_24,
  },
  stickyButtonBottomSpace: {
    height: SPACE_48,
    backgroundColor: COLOR_BACKGROUND,
  },
  sectionHeader: {
    alignItems: 'center',
    paddingHorizontal: SPACE_8,
    paddingTop: SPACE_4,
    paddingBottom: SPACE_8,
    backgroundColor: COLOR_BACKGROUND,
  },
  trackItem: {
    paddingTop: SPACE_8,
    paddingBottom: SPACE_8,
  },
});
