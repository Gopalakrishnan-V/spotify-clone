import React, {useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Image from 'react-native-fast-image';
import FeedRowItem from './FeedRowItem';

export default function FeedItem({
  data,
  rowIndex,
  onHeaderPress,
  onRowItemPress,
}) {
  const isFirstRow = rowIndex === 0;
  const {item_type, type, id, title, sub_title, image_url} = data;

  const renderItem = useCallback(
    ({item, index}) => {
      const isFirstItem = index === 0;
      return (
        <FeedRowItem
          data={item}
          isFirstItem={isFirstItem}
          onPress={() => onRowItemPress(item)}
        />
      );
    },
    [onRowItemPress],
  );

  const containerStyle = [styles.container, {marginTop: isFirstRow ? 8 : 32}];

  const windowWidth = useWindowDimensions().width;
  const imageSize = windowWidth * 0.13;
  const headerImageStyle = [
    styles.headerImage,
    {
      width: imageSize,
      height: imageSize,
      borderRadius: imageSize / 2,
    },
  ];

  return (
    <View style={containerStyle}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onHeaderPress(data)}
        style={styles.header}>
        {!!image_url && (
          <Image source={{uri: image_url}} style={headerImageStyle} />
        )}
        <View style={styles.headerContent}>
          {!!sub_title && (
            <Text style={styles.subTitle} numberOfLines={1}>
              {sub_title}
            </Text>
          )}
          {!!title && (
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      <FlatList
        data={data.data}
        renderItem={renderItem}
        horizontal
        keyExtractor={(_, index) => String(index)}
        contentContainerStyle={styles.list}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerImage: {
    marginRight: 16,
  },
  headerContent: {},
  subTitle: {
    color: '#808080',
    marginBottom: 2,
    fontSize: 12,
  },
  title: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 26,
  },
  list: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
});
