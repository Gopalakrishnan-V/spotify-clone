import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from 'react';
import {View, FlatList, StyleSheet, Animated} from 'react-native';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

import Button from '../../components/Button';
import SpotifyClient from '../../../SpotifyClient';
import AnimatedHeader from '../../components/AnimatedHeader';
import Loader from '../../components/Loader';
import AnimatedTopBar from '../../components/AnimatedTopBar';
import TrackItem from '../../components/TrackItem';
import {getDominantColor} from '../../helpers/colorHelpers';
import {addTracks} from '../../helpers/playerHelpers';
import {shuffleArray} from '../../helpers/commonHelpers';
import {
  getTracksFromAlbum,
  getArtwork,
  getFirstArtistName,
  getYear,
  convertAlbumTrackItemToTrackPlayerItem,
} from '../../helpers/spotifyHelpers';
import ScreenWrapper from '../../components/ScreenWrapper';
import {BottomTabBarHeightContext} from '../../App';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {APPBAR_HEIGHT} from '../../constants/dimens';

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
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const {setBottomTabBarHeight} = useContext(BottomTabBarHeightContext);

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

  useEffect(() => {
    setBottomTabBarHeight(tabBarHeight);
  }, [setBottomTabBarHeight, tabBarHeight]);

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleShufflePress = useCallback(() => {
    addTracks(shuffleArray(getTracksFromAlbum(album)));
  }, [album]);

  const handleTrackPress = useCallback(
    item => async () => {
      addTracks([convertAlbumTrackItemToTrackPlayerItem(item, album)]);
    },
    [album],
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
    inputRange: [0, headerHeight],
    outputRange: ['#00000000', '#000000ff'],
    extrapolate: 'clamp',
  });

  const animatedTopBarTitleOpacity = animatedOffsetValue.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const animateHeaderOpacity = animatedOffsetValue.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [1, 0],
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
          dominantColor={dominantColor}
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
            onBackPress={handleBackPress}
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
              {paddingTop: headerHeight - APPBAR_HEIGHT - insets.top},
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
    paddingBottom: 16,
  },
  shuffleButton: {
    alignSelf: 'center',
    marginTop: 0,
    marginBottom: 24,
  },
});
