import React from 'react';
import {StyleSheet, View} from 'react-native';

const ScreenWrapper = props => {
  const wrapperStyle = [styles.wrapper, props.style];

  return <View style={wrapperStyle}>{props.children}</View>;
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
