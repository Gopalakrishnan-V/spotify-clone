import React from 'react';
import {View, StyleSheet, Text, Animated} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AnimatedTopBar = props => {
  const insets = useSafeAreaInsets();
  const containerStyle = [
    styles.container,
    props.style,
    {backgroundColor: props.animatedBgColor},
  ];

  return (
    <Animated.View style={containerStyle}>
      <View style={{height: insets.top}} />
      <View style={styles.content}>
        <View style={styles.left}>
          <Icon
            name="keyboard-backspace"
            size={24}
            color="#FFFFFF"
            onPress={() => props.onBackPress()}
          />
        </View>

        <View style={styles.titleContainer}>
          <Animated.Text
            style={[styles.title, {opacity: props.animatedTitleOpacity}]}
            numberOfLines={1}>
            {props.title}
          </Animated.Text>
        </View>

        <View style={styles.right}>
          <Icon
            name="heart-outline"
            size={24}
            color="#FFFFFF"
            onPress={() => {}}
          />
          <Icon
            name="dots-vertical"
            size={24}
            color="#FFFFFF"
            onPress={() => {}}
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
    zIndex: 10,
    backgroundColor: '#1b1b1b',
  },
  content: {
    height: 64,
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    width: 64,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  right: {
    width: 64,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    marginLeft: 16,
  },
});
