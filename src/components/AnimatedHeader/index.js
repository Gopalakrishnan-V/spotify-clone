import React from 'react';
import {StyleSheet, Text, useWindowDimensions, Animated} from 'react-native';
import Image from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function AnimatedHeader(props) {
  const insets = useSafeAreaInsets();
  const {title, subTitle, imageUrl, gradientColors, mode = null} = props;
  const isArtistMode = mode === 'artist';

  const windowWidth = useWindowDimensions().width;
  const imageSize = windowWidth * 0.45;

  const linearGradientStyle = [
    styles.container,
    props.style,
    {paddingTop: insets.top + 64},
  ];
  const artworkStyle = [styles.artwork, {width: imageSize, height: imageSize}];
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

      <LinearGradient colors={gradientColors} style={linearGradientStyle}>
        {!isArtistMode && (
          <Image source={{uri: imageUrl}} style={artworkStyle} />
        )}
        <Text style={titleStyle} numberOfLines={isArtistMode ? 2 : 1}>
          {title}
        </Text>
        {!!subTitle && <Text style={subTitleStyle}>{subTitle}</Text>}
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
  artwork: {},
  title: {
    marginTop: 16,
    fontSize: 20,
    lineHeight: 20 * 1.3,
    marginHorizontal: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
    color: '#FFF',
  },
  artistTitle: {
    fontSize: 48,
    lineHeight: 48 * 1.1,
    marginTop: 120,
    marginHorizontal: 48,
  },
  subTitle: {
    marginTop: 8,
    marginBottom: 24,
    fontSize: 14,
    color: '#808080',
  },
  artistSubTitle: {
    fontSize: 12,
  },
});
