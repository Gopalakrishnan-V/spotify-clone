import React from 'react';
import {StyleSheet, View} from 'react-native';
import {COLOR_BACKGROUND} from '../../constants/colors';

const ScreenWrapper = props => {
  const wrapperStyle = [styles.wrapper, props.style];

  return <View style={wrapperStyle}>{props.children}</View>;
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLOR_BACKGROUND,
  },
});
