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
import {
  getTracksFromPlaylist,
  getArtwork,
  convertPlaylistTrackItemToTrackPlayerItem,
} from '../../helpers/spotifyHelpers';
import ScreenWrapper from '../../components/ScreenWrapper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SPACE_24, SPACE_64} from '../../constants/dimens';
import {COLOR_BACKGROUND, COLOR_TRANSPARENT} from '../../constants/colors';
import {commas} from '../../helpers/textHelpers';

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
        const res = await SpotifyClient.get(
          `v1/playlists/${playlistId}?market=IN`,
        );
        setPlaylist(res.data);
        navigation.setOptions({title: res.data.name});
        const artwork = res.data?.images?.[0]?.url;
        setDominantColor(await getDominantColor(artwork), '#000000');
      } catch (e) {}
    })();
  }, [navigation, playlistId]);

  const handlePlayPress = useCallback(() => {
    addTracks(getTracksFromPlaylist(playlist));
  }, [playlist]);

  const handleTrackPress = useCallback(
    item => async () => {
      addTracks([convertPlaylistTrackItemToTrackPlayerItem(item)]);
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
    subTitleParts.push(`BY ${owner.display_name}`.toUpperCase());
  }
  if (followers) {
    subTitleParts.push(`${commas(followers.total)} LIKES`);
  }
  const subTitle = subTitleParts.join(' • ');

  const trackItems = tracks.items.map(({track}) => ({
    ...track,
    type: ItemType.TRACK,
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
          extraData={{dominantColor}}
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
