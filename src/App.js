import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import TrackPlayer, {
  STATE_NONE,
  TrackPlayerEvents,
} from 'react-native-track-player';
import Navigator from '../Navigator';

export const PlayerStateContext = React.createContext();

function App() {
  const [playerState, setPlayerState] = useState(STATE_NONE);

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
      <View style={styles.container}>
        <Navigator />
      </View>
    </PlayerStateContext.Provider>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
