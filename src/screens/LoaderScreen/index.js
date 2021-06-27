import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import TrackPlayer, {
  CAPABILITY_PLAY,
  CAPABILITY_PAUSE,
  CAPABILITY_STOP,
  CAPABILITY_SEEK_TO,
  CAPABILITY_SKIP,
  CAPABILITY_SKIP_TO_NEXT,
  CAPABILITY_SKIP_TO_PREVIOUS,
  CAPABILITY_SET_RATING,
} from 'react-native-track-player';

import Loader from '../../components/Loader';

const LoaderScreen = props => {
  const {navigation} = props;

  useEffect(() => {
    (async () => {
      try {
        await TrackPlayer.setupPlayer({stopWithApp: true});
        await TrackPlayer.updateOptions({
          capabilities: [
            CAPABILITY_PLAY,
            CAPABILITY_PAUSE,
            CAPABILITY_STOP,
            CAPABILITY_SEEK_TO,
            CAPABILITY_SKIP,
            CAPABILITY_SKIP_TO_NEXT,
            CAPABILITY_SKIP_TO_PREVIOUS,
            CAPABILITY_SET_RATING,
          ],
          compactCapabilities: [
            TrackPlayer.CAPABILITY_PLAY,
            TrackPlayer.CAPABILITY_PAUSE,
          ],
        });

        navigation.replace('Main');
      } catch (e) {}
    })();
  }, []);

  return <Loader />;
};

export default LoaderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
