import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SpotifyHelper from '../../helpers/SpotifyHelper';

export default function TrackItem(props) {
  const {data, imageVisible = false} = props;
  const windowWidth = useWindowDimensions().width;
  const imageSize = windowWidth * 0.125;

  const {name, artists, album} = data;
  const artistNames = (artists || []).map(artist => artist.name).join(', ');
  const imageUrl = SpotifyHelper.getArtwork(album?.images);
  const imageStyle = [styles.image, {width: imageSize, height: imageSize}];

  return (
    <TouchableOpacity
      onPress={props.onPress}
      activeOpacity={1.0}
      style={styles.container}>
      {imageVisible && <Image source={{uri: imageUrl}} style={imageStyle} />}

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.subTitle} numberOfLines={1}>
          {artistNames}
        </Text>
      </View>
      <Icon name="dots-vertical" size={24} color="#808080" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    marginRight: 16,
  },
  image: {
    marginRight: 12,
  },
  title: {
    color: '#FFF',
    fontWeight: '500',
    fontSize: 16,
  },
  subTitle: {
    color: '#808080',
    fontSize: 14,
    marginTop: 4,
  },
});
