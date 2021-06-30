import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  Dimensions,
  View,
  TouchableOpacity,
} from 'react-native';

const IMAGE_SIZE = Dimensions.get('window').width * 0.4;

export default function FeedRowItem({data, isFirstItem, onPress}) {
  const {title, sub_title, image_url} = data;
  const containerStyle = [styles.container, {marginLeft: isFirstItem ? 0 : 16}];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={containerStyle}>
      <View>
        <Image source={{uri: image_url}} style={styles.image} />
        <View style={styles.textWrapper}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
            {title}
          </Text>
        </View>
        <View style={styles.textWrapper}>
          <Text numberOfLines={2} ellipsizeMode="tail" style={styles.subTitle}>
            {sub_title}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {},
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 4,
    marginBottom: 8,
  },
  textWrapper: {
    width: IMAGE_SIZE,
    flexDirection: 'row',
  },
  title: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  subTitle: {
    flex: 1,
    flexShrink: 1,
    color: '#808080',
    fontSize: 12,
    marginTop: 2,
  },
});
