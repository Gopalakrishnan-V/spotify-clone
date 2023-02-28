import 'react-native-gesture-handler';
import React from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import TrackPlayer, {
  TrackPlayerEvents,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import {Provider} from 'react-redux';

import {store} from './store';
import Navigator from '../Navigator';
import {setState, setTrack} from './slices/player';

const events = [
  TrackPlayerEvents.PLAYBACK_STATE,
  TrackPlayerEvents.PLAYBACK_TRACK_CHANGED,
];

const App: React.FC = () => {
  useTrackPlayerEvents(events, event => {
    switch (event.type) {
      case TrackPlayerEvents.PLAYBACK_STATE: {
        store.dispatch(setState(event.state));
        break;
      }
      case TrackPlayerEvents.PLAYBACK_TRACK_CHANGED: {
        const nextTrackId = event.nextTrack;
        if (nextTrackId) {
          TrackPlayer.getTrack(nextTrackId).then(track =>
            store.dispatch(setTrack(track)),
          );
        }
        break;
      }
      default: {
      }
    }
  });

  return (
    <Provider store={store}>
      <StatusBar barStyle={'light-content'} />
      <View style={styles.container}>
        <Navigator />
      </View>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
