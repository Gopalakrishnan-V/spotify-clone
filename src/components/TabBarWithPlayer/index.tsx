import React from 'react';
import {View} from 'react-native';
import {BottomTabBar, BottomTabBarProps} from '@react-navigation/bottom-tabs';
import BottomPlayer from '../BottomPlayer';

interface TabBarWithPlayerProps extends BottomTabBarProps {}

const TabBarWithPlayer = (props: TabBarWithPlayerProps) => {
  return (
    <View>
      <BottomPlayer />
      <BottomTabBar {...props} />
    </View>
  );
};

export default TabBarWithPlayer;
