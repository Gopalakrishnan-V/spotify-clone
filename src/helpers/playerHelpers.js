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

export const init = async () => {
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
  } catch (e) {
    console.log(e);
  }
};

export const addTracks = async items => {
  try {
    await TrackPlayer.reset();
    await TrackPlayer.add(items);
    await TrackPlayer.play();
  } catch (e) {
    console.log({e});
  }
};

export const getBottomPlayerImageSize = windowWidth => {
  return windowWidth * 0.175;
};

export const getBottomPlayerHeight = windowWidth => {
  return 1 + getBottomPlayerImageSize(windowWidth) + 1;
};
