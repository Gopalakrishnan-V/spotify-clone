import React from 'react';
import {View, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import Image from 'react-native-fast-image';
import Text from '../../components/Text';
import {FONT_MEDIUM} from '../../constants';
import {SPACE_12, SPACE_16, SPACE_24, SPACE_4} from '../../constants/dimens';
import {formatDate} from '../../helpers/dateHelpers';
import {toHHMMSS} from '../../helpers/durationHelpers';
import {pluralize} from '../../helpers/textHelpers';
import {IAlbumDetails} from '../../interfaces/album';
import {IArtistItem} from '../../interfaces/artist';

const ARTIST_IMAGE_SIZE = Dimensions.get('window').width * 0.12;

interface FooterProps {
  album: IAlbumDetails;
  onArtistPress: (artist: IArtistItem) => void;
}

const Footer: React.FC<FooterProps> = ({album, onArtistPress}) => {
  if (!album) {
    return null;
  }

  const {releaseDate, tracks, artists, copyrights} = album;
  const tracksItems = tracks.items;
  const totalDuration =
    tracksItems.reduce((acc, item) => acc + item.durationMs, 0) / 1000;

  const formattedDate = formatDate(releaseDate);
  const songsCountDurationText = `${pluralize(
    tracksItems.length,
    'song',
  )} • ${toHHMMSS(totalDuration, {separator: ' ', showLabels: true})}`;
  const artist = artists[0] ?? null;

  const copyRightText = copyrights?.[0]?.text;

  return (
    <View style={styles.container}>
      <Text label={formattedDate} as="title5" />
      <Text
        label={songsCountDurationText}
        as="title5"
        style={styles.songsCountDurationText}
      />

      {!!artist && (
        <TouchableOpacity
          onPress={() => onArtistPress(artist)}
          style={styles.artistContainer}>
          <View style={styles.artistImagePlaceholder} />
          <Text label={artist.name} as="small1" style={styles.artistName} />
        </TouchableOpacity>
      )}

      {!!copyRightText && (
        <Text label={copyRightText} as="small1" style={styles.copyRightText} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: SPACE_12,
    paddingHorizontal: SPACE_16,
  },
  songsCountDurationText: {
    marginTop: SPACE_4,
  },
  artistContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACE_16,
  },
  artistImagePlaceholder: {
    width: ARTIST_IMAGE_SIZE,
    height: ARTIST_IMAGE_SIZE,
    borderRadius: ARTIST_IMAGE_SIZE / 2,
    backgroundColor: '#262626',
  },
  artistName: {
    marginLeft: SPACE_12,
    fontFamily: FONT_MEDIUM,
  },
  copyRightText: {
    marginTop: SPACE_24,
    marginBottom: SPACE_12,
    fontFamily: FONT_MEDIUM,
  },
});

export default Footer;
