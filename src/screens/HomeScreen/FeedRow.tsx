import React from 'react';
import {StyleSheet, View, FlatList} from 'react-native';
import Text from '../../components/Text';
import FeedRowItem from './FeedRowItem';
import {SPACE_16} from '../../constants/dimens';
import {IFeedItem} from '../../interfaces/feed';
import {IAlbumItem} from '../../interfaces/album';
import {ICategoryPlaylistItem} from '../../interfaces/category';
import {getArtwork} from '../../helpers/spotifyHelpers';

interface FeedItemProps {
  data: IFeedItem;
  rowIndex: number;
  onRowItemPress: (
    type: 'album' | 'playlist',
    rowItemData: IAlbumItem | ICategoryPlaylistItem,
  ) => void;
}

const FeedItem: React.FC<FeedItemProps> = ({
  data,
  rowIndex,
  onRowItemPress,
}) => {
  const isFirstRow = rowIndex === 0;

  const renderItem = ({
    item,
    index,
  }: {
    item: IAlbumItem | ICategoryPlaylistItem;
    index: number;
  }) => {
    const isFirstItem = index === 0;
    let imageUrl: string | null = null;
    let title: string | null = null;
    if (data.type === 'album') {
      const album = item as IAlbumItem;
      imageUrl = getArtwork(album.images);
      title = album.name;
    } else if (data.type === 'playlist') {
      const playlist = item as ICategoryPlaylistItem;
      imageUrl = getArtwork(playlist.images);
      title = playlist.name;
    }

    return (
      <FeedRowItem
        imageUrl={imageUrl}
        title={title}
        isFirstItem={isFirstItem}
        onPress={() => onRowItemPress(data.type, item)}
      />
    );
  };

  const containerStyle = [styles.container, {marginTop: isFirstRow ? 8 : 32}];

  return (
    <View style={containerStyle}>
      <Text
        as="title3"
        numberOfLines={1}
        label={data.title}
        style={styles.title}
      />
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
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  title: {
    marginStart: SPACE_16,
  },
  list: {
    marginTop: SPACE_16,
    paddingHorizontal: SPACE_16,
  },
});

export default FeedItem;
