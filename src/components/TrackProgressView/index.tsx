import React from 'react';
import {View, StyleSheet} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import {ProgressBar} from 'react-native-paper';
import {COLOR_WHITE} from '../../constants/colors';

interface TrackProgressViewProps {
  style?: any;
}

class TrackProgressView extends TrackPlayer.ProgressComponent<TrackProgressViewProps> {
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <ProgressBar
          progress={this.getProgress()}
          color={COLOR_WHITE}
          style={styles.progress}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  progress: {
    height: 1,
  },
});

export default TrackProgressView;
