import React from 'react';
import {StyleSheet, Animated, Dimensions} from 'react-native';
import Image from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Text from '../Text';
import {
  SPACE_16,
  SPACE_24,
  SPACE_4,
  SPACE_48,
  SPACE_64,
  SPACE_8,
  TEXT_SMALL_2_SIZE,
} from '../../constants/dimens';
import {COLOR_TEXT_SECONDARY} from '../../constants/colors';

const WINDOW_WIDTH = Dimensions.get('window').width;
const ARTWORK_SIZE = WINDOW_WIDTH * 0.45;
const ARTIST_TITLE_MARGIN_TOP = WINDOW_WIDTH * 0.4;

export default function AnimatedHeader(props) {
  const insets = useSafeAreaInsets();
  const {title, subTitle, imageUrl, gradientColors, mode = null} = props;
  const isArtistMode = mode === 'artist';

  const linearGradientStyle = [
    styles.container,
    props.style,
    {paddingTop: insets.top + SPACE_64},
  ];
  const titleStyle = [styles.title, isArtistMode ? styles.artistTitle : null];
  const subTitleStyle = [
    styles.subTitle,
    isArtistMode ? styles.artistSubTitle : null,
  ];

  return (
    <Animated.View
      style={{opacity: props.animatedOpacity}}
      onLayout={props.onLayout}>
      {isArtistMode && (
        <Image source={{uri: imageUrl}} style={styles.bgImage} />
      )}

      <LinearGradient
        colors={gradientColors}
        style={linearGradientStyle}
        start={{x: 0.5, y: 0}}>
        {!isArtistMode && (
          <Image source={{uri: imageUrl}} style={styles.artwork} />
        )}
        <Text
          label={title}
          as="title4"
          style={titleStyle}
          numberOfLines={isArtistMode ? 2 : 1}
        />
        {!!subTitle && (
          <Text label={subTitle} as="small1" style={subTitleStyle} />
        )}
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  bgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  artwork: {
    width: ARTWORK_SIZE,
    height: ARTWORK_SIZE,
    borderRadius: SPACE_4,
  },
  title: {
    marginTop: SPACE_16,
    marginHorizontal: SPACE_24,
    alignSelf: 'center',
    textAlign: 'center',
  },
  artistTitle: {
    fontSize: 48,
    lineHeight: 48 * 1.1,
    marginTop: ARTIST_TITLE_MARGIN_TOP,
    marginHorizontal: SPACE_48,
  },
  subTitle: {
    marginTop: SPACE_8,
    marginBottom: SPACE_24,
    color: COLOR_TEXT_SECONDARY,
  },
  artistSubTitle: {
    fontSize: TEXT_SMALL_2_SIZE,
  },
});
