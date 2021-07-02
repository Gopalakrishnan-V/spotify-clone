import React, {useCallback} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Text from '../../components/Text';
import Image from 'react-native-fast-image';
import FeedRowItem from './FeedRowItem';
import {SPACE_16, SPACE_2} from '../../constants/dimens';

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
        <View>
          {!!sub_title && (
            <Text
              style={styles.subTitle}
              as="small2"
              numberOfLines={1}
              label={sub_title}
            />
          )}
          {!!title && <Text as="title3" numberOfLines={1} label={title} />}
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
    paddingHorizontal: SPACE_16,
  },
  headerImage: {
    marginRight: SPACE_16,
  },
  subTitle: {
    marginBottom: SPACE_2,
  },
  list: {
    marginTop: SPACE_16,
    paddingHorizontal: SPACE_16,
  },
});
