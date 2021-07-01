import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {getYear} from '../../helpers/dateHelpers';

export default function AlbumItem(props) {
  const {data, appendAlbumInSubTitle = true} = props;
  const windowWidth = useWindowDimensions().width;
  const imageSize = windowWidth * 0.2;

  const {name, images, release_date} = data;
  const imageUrl = images?.[0]?.url;
  const imageStyle = [styles.image, {width: imageSize, height: imageSize}];

  const releaseYear = getYear(release_date);
  const subTitle = `${releaseYear}${appendAlbumInSubTitle ? ' • Album' : ''}`;

  return (
    <TouchableOpacity
      onPress={props.onPress}
      activeOpacity={0.8}
      style={styles.container}>
      <Image source={{uri: imageUrl}} style={imageStyle} />

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {name}
        </Text>
        <Text style={styles.subTitle} numberOfLines={1} ellipsizeMode="tail">
          {subTitle}
        </Text>
      </View>
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
  },
  image: {
    borderRadius: 4,
    marginRight: 12,
  },
  title: {
    fontWeight: '500',
    fontSize: 16,
    color: '#FFF',
  },
  subTitle: {
    color: '#808080',
    fontSize: 14,
    marginTop: 4,
  },
});
