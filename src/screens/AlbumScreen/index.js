import React, {useState, useEffect, useRef, useCallback} from 'react';
import {View, FlatList, StyleSheet, Animated} from 'react-native';

import Button from '../../components/Button';
import SpotifyClient from '../../../SpotifyClient';
import AnimatedHeader from '../../components/AnimatedHeader';
import Loader from '../../components/Loader';
import AnimatedTopBar from '../../components/AnimatedTopBar';
import TrackItem from '../../components/TrackItem';
import {getDominantColor, getGradientColors} from '../../helpers/colorHelpers';
import {addTracks} from '../../helpers/playerHelpers';
import {shuffleArray} from '../../helpers/commonHelpers';
import {
  getTracksFromAlbum,
  getArtwork,
  getFirstArtistName,
  convertAlbumTrackItemToTrackPlayerItem,
} from '../../helpers/spotifyHelpers';
import ScreenWrapper from '../../components/ScreenWrapper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SPACE_64, SPACE_16, SPACE_24} from '../../constants/dimens';
import Footer from './Footer';
import NavigationHelper from '../../helpers/NavigationHelper';
import {getYear} from '../../helpers/dateHelpers';
import {COLOR_BACKGROUND, COLOR_TRANSPARENT} from '../../constants/colors';

const ItemType = {
  STICKY_BUTTON: 'STICKY_BUTTON',
  TRACK: 'TRACK',
};

const AlbumScreen = props => {
  const {route, navigation} = props;
  const albumId = route?.params?.id ?? '31iCArxZjUNAz6UKfQO3W1';
  const [album, setAlbum] = useState(null);
  const [headerHeight, setHeaderHeight] = useState(10);
  const [dominantColor, setDominantColor] = useState(null);
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
        const res = await SpotifyClient.get(`v1/albums/${albumId}?market=IN`);
        setAlbum(res.data);
        navigation.setOptions({title: res.data.name});
        const artwork = res.data?.images?.[0]?.url;
        setDominantColor(await getDominantColor(artwork));
      } catch (e) {}
    })();
  }, [albumId, navigation]);

  const handleShufflePress = useCallback(() => {
    addTracks(shuffleArray(getTracksFromAlbum(album)));
  }, [album]);

  const handleTrackPress = useCallback(
    item => async () => {
      addTracks([convertAlbumTrackItemToTrackPlayerItem(item, album)]);
    },
    [album],
  );

  const handleArtistPress = useCallback(
    artist => {
      NavigationHelper.gotoArtistScreen(navigation, artist.id);
    },
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
          return <TrackItem data={item} onPress={handleTrackPress(item)} />;
        }
        default: {
          return null;
        }
      }
    },
    [handleShufflePress, handleTrackPress],
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
  const trackItems = tracks.items.map(track => ({
    ...track,
    type: ItemType.TRACK,
  }));
  const listItems = [{type: ItemType.STICKY_BUTTON}, ...trackItems];
  const subTitleParts = [];
  subTitleParts.push(getFirstArtistName(album.artists));
  subTitleParts.push(getYear(album.release_date));
  const subTitle = subTitleParts.join(' • ');
  const imageUrl = getArtwork(album.images);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <AnimatedHeader
          title={album.name}
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
            contentContainerStyle={[
              styles.list,
              {paddingTop: headerHeight - SPACE_64 - insets.top},
            ]}
            extraData={{dominantColor}}
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
