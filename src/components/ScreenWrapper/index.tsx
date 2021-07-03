import React from 'react';
import {StyleSheet, View} from 'react-native';
import {COLOR_BACKGROUND} from '../../constants/colors';

interface ScreenWrapper {
  style?: any;
  children: React.ReactNode;
}

const ScreenWrapper: React.FC<ScreenWrapper> = ({style, children}) => {
  const wrapperStyle = [styles.wrapper, style];

  return <View style={wrapperStyle}>{children}</View>;
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLOR_BACKGROUND,
  },
});
