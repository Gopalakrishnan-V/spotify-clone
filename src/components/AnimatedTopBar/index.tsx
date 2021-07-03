import React from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLOR_WHITE} from '../../constants/colors';
import {SPACE_16, SPACE_24, SPACE_64, SPACE_8} from '../../constants/dimens';
import textStyles from '../../constants/textStyles';

interface AnimatedTopBarProps {
  title: string;
  animatedBgColor: Animated.AnimatedInterpolation;
  animatedTitleOpacity: Animated.AnimatedInterpolation;
  onBackPress: () => void;
  style?: any;
}

const AnimatedTopBar: React.FC<AnimatedTopBarProps> = ({
  title,
  animatedBgColor,
  animatedTitleOpacity,
  onBackPress,
  style,
}) => {
  const insets = useSafeAreaInsets();
  const containerStyle = [
    styles.container,
    style,
    {backgroundColor: animatedBgColor},
  ];

  return (
    <Animated.View style={containerStyle}>
      <View style={{height: insets.top}} />
      <View style={styles.content}>
        <View style={styles.left}>
          <Icon
            name="keyboard-backspace"
            size={SPACE_24}
            color={COLOR_WHITE}
            onPress={onBackPress}
          />
        </View>

        <View style={styles.titleContainer}>
          <Animated.Text
            style={[textStyles.title5, {opacity: animatedTitleOpacity}]}
            numberOfLines={1}>
            {title}
          </Animated.Text>
        </View>

        <View style={styles.right}>
          <Icon name="heart-outline" size={SPACE_24} color={COLOR_WHITE} />
          <Icon
            name="dots-vertical"
            size={SPACE_24}
            color={COLOR_WHITE}
            style={styles.menuIcon}
          />
        </View>
      </View>
    </Animated.View>
  );
};

export default AnimatedTopBar;

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
  },
  content: {
    height: SPACE_64,
    paddingHorizontal: SPACE_8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    width: SPACE_64,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: SPACE_16,
  },
  right: {
    width: SPACE_64,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    marginLeft: SPACE_16,
  },
});
