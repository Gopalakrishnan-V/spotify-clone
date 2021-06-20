import React, { useEffect } from "react";
import { View, Text, StyleSheet } from 'react-native';
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
import { Button, ProgressBar, Colors } from 'react-native-paper';

const tracks = [
    {
        id: '6wBXSf1chpnyXGOSvANs0a',
        url: "https://p.scdn.co/mp3-preview/6fac86ed9442cd2e8ed8247441b605bd4a1983bd?cid=91d993487fe643b58b33a7ea743207be",
        title: 'Thalli Pogathey',
        artist: 'A.R. Rahman',
        artwork: "https://i.scdn.co/image/ab67616d0000b273e34c0ec9908c31155625fd68",
    },
    {
        id: '3hHFVG2vcNfooKXgfLgCWd',
        url: "https://p.scdn.co/mp3-preview/719d1bb376b3572cf160d5ba60b91ecfc779955f?cid=91d993487fe643b58b33a7ea743207be",
        title: 'Showkali',
        artist: 'A.R. Rahman',
        artwork: "https://i.scdn.co/image/ab67616d0000b273e34c0ec9908c31155625fd68",
    },
    {
        id: '4ZbReiBhWXubimOlKm8PdL',
        url: "https://p.scdn.co/mp3-preview/d0967ec60ee0c09c28049121d77c8a71b902ca93?cid=91d993487fe643b58b33a7ea743207be",
        title: 'Idhu Naal',
        artist: 'A.R. Rahman',
        artwork: "https://i.scdn.co/image/ab67616d0000b273e34c0ec9908c31155625fd68",
    },
    {
        id: '7d1NhML57HjWc4yjis1CQX',
        url: "https://p.scdn.co/mp3-preview/e4ae267d2d58b41516725b62d41d47cb036d05bf?cid=91d993487fe643b58b33a7ea743207be",
        title: 'Rasaali',
        artist: 'A.R. Rahman',
        artwork: "https://i.scdn.co/image/ab67616d0000b273e34c0ec9908c31155625fd68",
    },
    {
        id: '49KzsDrsY27UrTBp1bBIbF',
        url: "https://p.scdn.co/mp3-preview/393e4006646c4fac712d6041afc2125532c8035e?cid=91d993487fe643b58b33a7ea743207be",
        title: 'Avalum Naanum',
        artist: 'A.R. Rahman',
        artwork: "https://i.scdn.co/image/ab67616d0000b273e34c0ec9908c31155625fd68",
    },
    
]

const startPlayer = async () => {
    try{

        // Set up the player
        await TrackPlayer.setupPlayer({
            stopWithApp: true,
        });

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
                // CAPABILITY_JUMP_FORWARD,
                // CAPABILITY_JUMP_BACKWARD,
            ],

            // Capabilities that will show up when the notification is in the compact form on Android
            compactCapabilities: [
                TrackPlayer.CAPABILITY_PLAY,
                TrackPlayer.CAPABILITY_PAUSE
            ]
        })


        // Add a track to the queue
        await TrackPlayer.add(tracks);

        // Start playing it
        await TrackPlayer.play();
    }
    catch(e){
        console.log({e})
    }
    
};


const PlayerScreen = (props) => {
    const {navigation} = props;

    useEffect(() => {
        // startPlayer();
    }, []);

    return (
      <View style={styles.container}>
            <Button
                icon="music"
                mode="contained"
                onPress={() => navigation.navigate("Player")}>
                View player
            </Button>
      </View>
    );
}

export default PlayerScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    playerBar: {
        width: "100%",
        padding: 16,
    },
});