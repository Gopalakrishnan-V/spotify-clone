import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  useWindowDimensions,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ColorHelper from '../../helpers/ColorHelper';

export default function AnimatedHeader(props) {
  const insets = useSafeAreaInsets();
  const {title, subTitle, imageUrl, dominantColor} = props;

  const windowWidth = useWindowDimensions().width;
  const imageSize = windowWidth * 0.45;
  const artworkStyle = {width: imageSize, height: imageSize};
  const colors = ColorHelper.getGradientColors(dominantColor);

  return (
    <Animated.View
      style={{opacity: props.animatedOpacity}}
      onLayout={props.onLayout}>
      <LinearGradient
        colors={colors}
        style={[styles.container, props.style, {paddingTop: insets.top + 64}]}>
        <Image
          source={{uri: imageUrl}}
          style={[styles.artwork, artworkStyle]}
        />
        <Text style={styles.title}>{title}</Text>
        {!!subTitle && <Text style={styles.subTitle}>{subTitle}</Text>}
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  artwork: {},
  title: {
    marginTop: 16,
    fontSize: 20,
    lineHeight: 20 * 1.3,
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
    color: '#FFF',
  },
  subTitle: {
    marginTop: 8,
    marginBottom: 24,
    color: '#808080',
  },
});
