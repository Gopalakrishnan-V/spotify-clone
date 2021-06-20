import React, { useState, useEffect } from 'react'
import { View, Text, Image, StyleSheet, useWindowDimensions } from 'react-native'
import TrackPlayer, { TrackPlayerEvents, useTrackPlayerEvents, STATE_PLAYING } from "react-native-track-player";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TrackSlider from '../../components/TrackSlider';


// Subscribing to the following events inside PlayerScreen
const events = [
    TrackPlayerEvents.PLAYBACK_STATE,
    TrackPlayerEvents.PLAYBACK_ERROR
];

const PlayerScreen = () => {
    const [track, setTrack] = useState(null);
    const [playerState, setPlayerState] = useState(null);

    const windowWidth = useWindowDimensions().width;
    const windowHeight = useWindowDimensions().height;

    useEffect(() => {
        let mounted = true;

        // Set the initial track:
        (async() => {
            try{
                const trackId = await TrackPlayer.getCurrentTrack();
                if (!mounted || !trackId) return;
                const track = await TrackPlayer.getTrack(trackId);
                if (!mounted) return;
                setTrack(track);
            }
            catch(e){
                console.log({e});
            }
        })();

        // Set the track whenever the track changes:
        const trackChangedListener = TrackPlayer.addEventListener(
            'playback-track-changed',
            async (data) => {
                try{
                    if(data.nextTrack){
                        const track = await TrackPlayer.getTrack(data.nextTrack);
                        if (!mounted) return;
                        setTrack(track);
                    }
                }
                catch(err){
                    console.log({err});
                }
            }
        );

        TrackPlayer.getState().then(state => {
            if(!mounted) return;
            setPlayerState(state);
        })


        return () => {
            mounted = false;
            trackChangedListener.remove();
        }
    }, []);



    useTrackPlayerEvents(events, (event) => {
        if (event.type === TrackPlayerEvents.PLAYBACK_ERROR) {
          console.warn('An error occured while playing the current track.');
        }
        if (event.type === TrackPlayerEvents.PLAYBACK_STATE) {
          setPlayerState(event.state);
        }
    });

    const isPlaying = playerState === STATE_PLAYING;

    if(!track){
        return null;
    }

    const artworkStyle = {
        width: windowWidth - 24 * 2,
        height: windowWidth - 24 * 2,
    }


    return (
        <View style={styles.container}>
            <Image source={{uri: track.artwork}} style={artworkStyle}/>

            <View>
                <View style={styles.trackDetailsRow}>
                    <View style={styles.trackDetailsRowContent}>
                        <Text style={styles.titleText}>{track.title}</Text>
                        <Text style={styles.artistText}>{track.artist}</Text>
                    </View>
                    <Icon name="heart-outline" size={24} color="white"/>
                </View>

                <TrackSlider style={styles.trackProgress}/>

                <View style={styles.controlsRow}>
                    <Icon name="shuffle" size={24} color="white" />
                    <Icon name="skip-previous" size={32} color="white" onPress={() => TrackPlayer.skipToPrevious()}/>
                    <Icon name={isPlaying? "pause-circle": "play-circle" } onPress={() => {
                        if(isPlaying){
                            TrackPlayer.pause();
                        } else{
                            TrackPlayer.play();
                        }
                    }} size={64} color="white" />
                    <Icon name="skip-next" size={32} color="white" onPress={() => TrackPlayer.skipToNext()}/>
                    <Icon name="repeat" size={24} color="white" />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        paddingHorizontal: 24,
        paddingTop: 64,
        paddingBottom: 64,
    },
    artwork: {
        width: 200,
        height: 200,
    },
    trackDetailsRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    trackDetailsRowContent: {
        flex: 1,
        marginRight: 16,
        justifyContent: "center",
    },
    titleText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    artistText: {
        fontSize: 14,
        marginTop: 4,
        color: "#7D7D7D",
    },
    trackProgress: {
        marginTop: 4,
    },
    controlsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 4,
    }
});

export default PlayerScreen;
