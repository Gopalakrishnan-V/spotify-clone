import React, {useState, useEffect, useRef, useCallback} from 'react';
import {View, Text, FlatList, StyleSheet, Animated} from 'react-native';

import Button from '../../components/Button';
import SpotifyClient from '../../../SpotifyClient';
import AnimatedHeader from '../../components/AnimatedHeader';
import Loader from '../../components/Loader';
import AnimatedTopBar from '../../components/AnimatedTopBar';
import TrackItem from '../../components/TrackItem';
import AlbumItem from '../../components/AlbumItem';
import {addTracks} from '../../helpers/playerHelpers';
import {shuffleArray} from '../../helpers/commonHelpers';
import {
  convertAlbumTrackItemToTrackPlayerItem,
  getTrackPlayerItems,
} from '../../helpers/spotifyHelpers';
import ScreenWrapper from '../../components/ScreenWrapper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {APPBAR_HEIGHT} from '../../constants/dimens';
import {commas, nFormatter} from '../../helpers/textHelpers';
import NavigationHelper from '../../helpers/NavigationHelper';

const ItemType = {
  STICKY_BUTTON: 'STICKY_BUTTON',
  STICKY_BUTTON_BOTTOM_SPACE: 'STICKY_BUTTON_BOTTOM_SPACE',
  SECTION_HEADER: 'SECTION_HEADER',
  TRACK: 'TRACK',
  ALBUM: 'ALBUM',
};

const ArtistScreen = props => {
  const {route, navigation} = props;
  const artistId = route?.params?.id ?? '29aw5YCdIw2FEXYyAJZI8l';
  const [artist, setArtist] = useState(null);
  const [topTracks, setTopTracks] = useState(null);
  const [albums, setAlbums] = useState(null);
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
    addTracks(shuffleArray(getTrackPlayerItems(topTracks.tracks)));
  }, [topTracks?.tracks]);

  const handleTrackPress = useCallback(
    item => async () => {
      addTracks([convertAlbumTrackItemToTrackPlayerItem(item)]);
    },
    [],
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
              <Text style={styles.sectionHeaderText}>{item.title}</Text>
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
              onPress={handleTrackPress(item.data)}
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
    inputRange: [0, headerHeight / 2, headerHeight],
    outputRange: ['#00000000', '#00000000', '#000000ff'],
    extrapolate: 'clamp',
  });

  const animatedTopBarTitleOpacity = animatedOffsetValue.interpolate({
    inputRange: [0, headerHeight / 2, headerHeight],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  const animateHeaderOpacity = animatedOffsetValue.interpolate({
    inputRange: [0, headerHeight / 2, headerHeight],
    outputRange: [1, 0.3, 0],
    extrapolate: 'clamp',
  });

  const {followers} = artist;
  const {tracks} = topTracks;
  const trackItems = tracks.map((track, trackIndex) => ({
    data: track,
    type: ItemType.TRACK,
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
          gradientColors={['#00000000', '#000000FF']}
          animatedOpacity={animateHeaderOpacity}
          mode="artist"
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
            // ListFooterComponent={<Footer album={album} />}
            keyExtractor={(_item, index) => String(index)}
            stickyHeaderIndices={[0]}
            alwaysBounceVertical={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.list,
              {paddingTop: headerHeight - APPBAR_HEIGHT - insets.top},
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
    paddingBottom: 16,
  },
  stickyButton: {
    alignSelf: 'center',
    marginTop: 0,
    marginBottom: -24,
  },
  stickyButtonBottomSpace: {
    height: 48,
    backgroundColor: '#000',
  },
  sectionHeader: {
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#000000',
  },
  sectionHeaderText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#FFF',
  },
});
