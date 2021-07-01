import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import Image from 'react-native-fast-image';
import {formatDate} from '../../helpers/dateHelpers';
import {toHHMMSS} from '../../helpers/durationHelpers';
import {pluralize} from '../../helpers/textHelpers';

const ARTIST_IMAGE_SIZE = Dimensions.get('window').width * 0.12;

const Footer = ({album, onArtistPress}) => {
  if (!album) {
    return null;
  }

  const {release_date, tracks, artists, copyrights} = album;
  const tracksItems = tracks.items;
  const totalDuration =
    tracksItems.reduce((acc, item) => acc + item.duration_ms, 0) / 1000;

  const formattedDate = formatDate(release_date);
  const songsCountDurationText = `${pluralize(
    tracksItems.length,
    'song',
  )} • ${toHHMMSS(totalDuration, {separator: ' ', showLabels: true})}`;
  const artist = artists?.[0];

  const copyRightText = copyrights?.[0]?.text;

  return (
    <View style={styles.container}>
      <Text style={styles.releaseDate}>{formattedDate}</Text>
      <Text style={styles.songsCountDurationText}>
        {songsCountDurationText}
      </Text>

      {!!artist && (
        <TouchableOpacity
          onPress={() => onArtistPress(artist)}
          style={styles.artistContainer}>
          <Image style={styles.artistImage} />
          <Text style={styles.artistName}>{artist.name}</Text>
        </TouchableOpacity>
      )}

      {!!copyRightText && (
        <Text style={styles.copyRightText}>{copyRightText}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  releaseDate: {
    fontWeight: '500',
    fontSize: 16,
    color: '#FFF',
  },
  songsCountDurationText: {
    fontWeight: '500',
    fontSize: 16,
    marginTop: 4,
    color: '#FFF',
  },
  artistContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  artistImage: {
    width: ARTIST_IMAGE_SIZE,
    height: ARTIST_IMAGE_SIZE,
    borderRadius: ARTIST_IMAGE_SIZE / 2,
    backgroundColor: '#262626',
  },
  artistName: {
    marginLeft: 12,
    fontWeight: '500',
    fontSize: 14,
    color: '#FFF',
  },
  copyRightText: {
    fontWeight: '500',
    marginTop: 24,
    marginBottom: 12,
    fontSize: 14,
    color: '#FFF',
  },
});

export default Footer;
