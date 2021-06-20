import React from "react"
import {View, Text, StyleSheet} from "react-native";
// import Slider from '@react-native-community/slider';
import Slider from "react-native-smooth-slider";
import TrackPlayer from "react-native-track-player";
import { ProgressBar, Colors } from 'react-native-paper';
import DurationHelper from "../../helpers/DurationHelper";

class TrackSlider extends TrackPlayer.ProgressComponent {

    handleSlidingComplete = (value) => {
        const { duration } = this.state;
        TrackPlayer.seekTo(duration * value)
    }


    render() {
        const { position, duration} = this.state;
        const positionText = DurationHelper.toHHMMSS(position);
        const durationText = DurationHelper.toHHMMSS(duration);
        
        return (
            <View style={[styles.container, this.props.style]}>

                {/* <ProgressBar
                    progress={this.getProgress()}
                    color={Colors.green600} /> */}

                {/* <Slider
                    value={this.getProgress()}
                    tapToSeek={false}
                    onSlidingComplete={this.handleSlidingComplete}
                    minimumTrackTintColor={Colors.green600}
                    maximumTrackTintColor={`${Colors.green600}66`}
                /> */}

                <Slider
                    value={this.getProgress()}
                    useNativeDriver={true}
                    thumbTintColor={"#FFFFFF"}
                    minimumTrackTintColor={Colors.green600}
                    maximumTrackTintColor={`${Colors.green600}66`}
                    onSlidingComplete={this.handleSlidingComplete} />


                <View style={styles.durationRow}>
                    <Text style={styles.durationText}>{positionText}</Text>
                    <Text style={styles.durationText}>{durationText}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
    },
    durationRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: -8,
    },
    durationText: {
        fontSize: 12,
        color: "#7D7D7D",
    },
});

export default TrackSlider;