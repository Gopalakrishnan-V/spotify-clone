import React from 'react';
import {View, StyleSheet} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import {ProgressBar, Colors} from 'react-native-paper';

class TrackProgressView extends TrackPlayer.ProgressComponent {
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <ProgressBar
          progress={this.getProgress()}
          color={'#FFFFFF'}
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
