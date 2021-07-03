import React from 'react';
import {StyleSheet, ActivityIndicator, View} from 'react-native';
import {SPACE_32} from '../../constants/dimens';

const Loader: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: SPACE_32,
  },
});

export default Loader;
