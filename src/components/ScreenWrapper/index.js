import React, {useContext} from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {STATE_NONE} from 'react-native-track-player';

import {PlayerStateContext} from '../../App';
import BottomPlayer from '../BottomPlayer';
import PlayerHelper from '../../helpers/PlayerHelper';

const ScreenWrapper = props => {
  const {playerState} = useContext(PlayerStateContext);
  const windowWidth = useWindowDimensions().width;
  const bottomPlayerHeight = PlayerHelper.getBottomPlayerHeight(windowWidth);
  const bottomPlayerVisible = playerState != null && playerState !== STATE_NONE;

  const wrapperStyle = [
    styles.wrapper,
    bottomPlayerVisible && {paddingBottom: bottomPlayerHeight},
  ];

  return (
    <View style={wrapperStyle}>
      {props.children}
      <BottomPlayer />
    </View>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  stickyPlayer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
