import TrackPlayer, {
  Track,
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
    await TrackPlayer.destroy();
    await TrackPlayer.setupPlayer();
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
  } catch (e) {}
};

export const addTracks = async (
  tracks: Track | Track[],
  insertBeforeId?: string,
) => {
  try {
    await TrackPlayer.reset();
    await TrackPlayer.add(tracks, insertBeforeId);
    await TrackPlayer.play();
  } catch (e) {}
};

export const getBottomPlayerImageSize = (windowWidth: number) => {
  return windowWidth * 0.175;
};

export const getBottomPlayerHeight = (windowWidth: number) => {
  return 1 + getBottomPlayerImageSize(windowWidth) + 1;
};
