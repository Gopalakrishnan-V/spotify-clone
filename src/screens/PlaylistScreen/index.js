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
import ColorHelper from '../../helpers/ColorHelper';
import PlayerHelper from '../../helpers/PlayerHelper';
import SpotifyHelper from '../../helpers/SpotifyHelper';
import ScreenWrapper from '../../components/ScreenWrapper';
import {BottomTabBarHeightContext} from '../../App';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {APPBAR_HEIGHT} from '../../constants/dimens';

const ItemType = {
  STICKY_BUTTON: 'STICKY_BUTTON',
  TRACK: 'TRACK',
};

const PlaylistScreen = props => {
  const {route, navigation} = props;
  const playlistId = route?.params?.id ?? '37i9dQZF1E39CR5c1DGceb';
  const [playlist, setPlaylist] = useState(null);
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
        const res = await SpotifyClient.get(
          `v1/playlists/${playlistId}?market=IN`,
        );
        setPlaylist(res.data);
        navigation.setOptions({title: res.data.name});
        const artwork = res.data?.images?.[0]?.url;
        setDominantColor(
          await ColorHelper.getDominantColor(artwork),
          '#000000',
        );
      } catch (e) {}
    })();
  }, [navigation, playlistId]);

  useEffect(() => {
    setBottomTabBarHeight(tabBarHeight);
  }, [setBottomTabBarHeight, tabBarHeight]);

  const handlePlayPress = useCallback(() => {
    PlayerHelper.add(SpotifyHelper.getTracksFromPlaylist(playlist));
  }, [playlist]);

  const handleTrackPress = useCallback(
    item => async () => {
      PlayerHelper.add({
        tracks: [item],
        artwork: SpotifyHelper.getArtwork(album.images),
        albumName: album.name,
      });
    },
    [],
  );

  const renderItem = ({item, index}) => {
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
            data={item}
            imageVisible
            onPress={handleTrackPress(item)}
          />
        );
      }
      default: {
        return null;
      }
    }
  };

  if (!playlist) {
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

  const {name, images, owner, followers, tracks} = playlist;
  const imageUrl = SpotifyHelper.getArtwork(images);
  const subTitleParts = [];
  if (owner) {
    subTitleParts.push(`BY ${owner.display_name}`.toUpperCase());
  }
  if (followers) {
    subTitleParts.push(`${followers.total} LIKES`);
  }
  const subTitle = subTitleParts.join(' • ');

  const trackItems = tracks.items.map(({track}) => ({
    ...track,
    type: ItemType.TRACK,
  }));
  const listItems = [{type: ItemType.STICKY_BUTTON}, ...trackItems];

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <AnimatedHeader
          title={name}
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
            title={playlist.name}
            animatedBgColor={animatedTopBarBgColor}
            animatedTitleOpacity={animatedTopBarTitleOpacity}
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

export default PlaylistScreen;

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
  list: {},
  playButton: {
    alignSelf: 'center',
    marginTop: 0,
    marginBottom: 24,
  },
});
