import React from 'react';
import {View, StyleSheet} from 'react-native';

import TextTicker from 'react-native-text-ticker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TrackSlider from '../../components/TrackSlider';
import {
  COLOR_FADED,
  COLOR_TEXT_SECONDARY,
  COLOR_WHITE,
} from '../../constants/colors';
import {
  SPACE_32,
  SPACE_24,
  SPACE_16,
  SPACE_4,
  SPACE_64,
} from '../../constants/dimens';
import textStyles from '../../constants/textStyles';

interface BottomControlsProps {
  title: string;
  artist: string;
  isPlaying: boolean;
  onPreviousPress: () => void;
  onPlayPress: () => void;
  onPausePress: () => void;
  onNextPress: () => void;
}

const BottomControls: React.FC<BottomControlsProps> = ({
  title,
  artist,
  isPlaying,
  onPreviousPress,
  onPlayPress,
  onPausePress,
  onNextPress,
}) => {
  return (
    <View>
      <View style={styles.trackDetailsRow}>
        <View style={styles.trackDetailsRowContent}>
          <TextTicker
            scrollSpeed={500}
            bounce={false}
            style={textStyles.title4}
            numberOfLines={1}>
            {title}
          </TextTicker>

          <TextTicker
            style={[textStyles.small1, styles.artistText]}
            numberOfLines={1}
            scrollSpeed={500}
            bounce={false}>
            {artist}
          </TextTicker>
        </View>
        <Icon name="heart-outline" size={SPACE_24} color={COLOR_WHITE} />
      </View>

      <TrackSlider style={styles.trackProgress} />

      <View style={styles.controlsRow}>
        <Icon name="shuffle" size={SPACE_24} color={COLOR_WHITE} />
        <Icon
          name="skip-previous"
          size={SPACE_32}
          color={COLOR_WHITE}
          onPress={onPreviousPress}
        />
        <Icon
          name={isPlaying ? 'pause-circle' : 'play-circle'}
          onPress={isPlaying ? onPausePress : onPlayPress}
          size={SPACE_64}
          color={COLOR_WHITE}
        />
        <Icon
          name="skip-next"
          size={SPACE_32}
          color={COLOR_WHITE}
          onPress={onNextPress}
        />
        <Icon name="repeat" size={SPACE_24} color={COLOR_WHITE} />
      </View>

      <View style={styles.bottomRow}>
        <Icon
          name="monitor-speaker"
          size={SPACE_16 + SPACE_4}
          color={COLOR_FADED}
        />
        <Icon name="playlist-music" size={SPACE_24} color={COLOR_FADED} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  trackDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackDetailsRowContent: {
    flex: 1,
    marginRight: SPACE_16,
    justifyContent: 'center',
  },
  artistText: {
    marginTop: SPACE_4,
    color: COLOR_TEXT_SECONDARY,
  },
  trackProgress: {
    marginTop: SPACE_4,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACE_4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACE_16,
  },
});

export default BottomControls;
