import React from 'react';
import {View} from 'react-native';
import {BottomTabBar} from '@react-navigation/bottom-tabs';
import BottomPlayer from '../BottomPlayer';

const TabBarWithPlayer = props => {
  return (
    <View>
      <BottomPlayer />
      <BottomTabBar {...props} />
    </View>
  );
};

export default TabBarWithPlayer;
