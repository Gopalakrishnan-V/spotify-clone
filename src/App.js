import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import TrackPlayer, {
  STATE_NONE,
  TrackPlayerEvents,
} from 'react-native-track-player';
import Navigator from '../Navigator';

export const PlayerStateContext = React.createContext();
export const BottomTabBarHeightContext = React.createContext();

function App() {
  const [playerState, setPlayerState] = useState(STATE_NONE);
  const [bottomTabBarHeight, setBottomTabBarHeight] = useState(0);

  useEffect(() => {
    const listener = TrackPlayer.addEventListener(
      TrackPlayerEvents.PLAYBACK_STATE,
      data => setPlayerState(data.state),
    );

    return () => {
      listener.remove();
    };
  }, []);

  return (
    <PlayerStateContext.Provider value={{playerState, setPlayerState}}>
      <BottomTabBarHeightContext.Provider
        value={{bottomTabBarHeight, setBottomTabBarHeight}}>
        <View style={styles.container}>
          <Navigator />
          {/* <BottomPlayer /> */}
        </View>
      </BottomTabBarHeightContext.Provider>
    </PlayerStateContext.Provider>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
