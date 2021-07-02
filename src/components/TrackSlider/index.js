import React from 'react';
import {View, StyleSheet} from 'react-native';
import Slider from 'react-native-smooth-slider';
import TrackPlayer from 'react-native-track-player';
import Text from '../Text';
import {COLOR_WHITE} from '../../constants/colors';
import {SPACE_8} from '../../constants/dimens';
import {toHHMMSS} from '../../helpers/durationHelpers';

class TrackSlider extends TrackPlayer.ProgressComponent {
  handleSlidingComplete = value => {
    const {duration} = this.state;
    TrackPlayer.seekTo(duration * value);
  };

  render() {
    const {position, duration} = this.state;
    const positionText = toHHMMSS(position);
    const durationText = toHHMMSS(duration);

    return (
      <View style={this.props.style}>
        <Slider
          value={this.getProgress()}
          useNativeDriver={true}
          thumbTintColor={COLOR_WHITE}
          minimumTrackTintColor={COLOR_WHITE}
          maximumTrackTintColor={`${COLOR_WHITE}44`}
          onSlidingComplete={this.handleSlidingComplete}
        />

        <View style={styles.durationRow}>
          <Text label={positionText} as="small2" />
          <Text label={durationText} as="small2" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  durationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -SPACE_8,
  },
});

export default TrackSlider;
