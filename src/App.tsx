import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import TrackPlayer, {
  STATE_NONE,
  TrackPlayerEvents,
} from 'react-native-track-player';
import Navigator from '../Navigator';

const App: React.FC = () => {
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
    <View style={styles.container}>
      <Navigator />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
