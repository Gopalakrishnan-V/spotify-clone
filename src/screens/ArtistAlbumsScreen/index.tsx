import React, {useEffect, useCallback, useMemo} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {useSelector} from 'react-redux';

import Loader from '../../components/Loader';
import AlbumItem, {ITEM_SIZE} from '../../components/AlbumItem';
import ScreenWrapper from '../../components/ScreenWrapper';
import {SPACE_16} from '../../constants/dimens';
import NavigationHelper from '../../helpers/NavigationHelper';
import {HomeStackParamList} from '../MainScreen';
import {RootState, useAppDispatch} from '../../store';
import {fetchArtistAlbums} from '../../slices/paginator';
import {IAlbumItem} from '../../interfaces/album';

interface ItemRenderType {
  item: IAlbumItem;
}

interface ArtistAlbumsScreenProps {
  navigation: StackNavigationProp<HomeStackParamList>;
  route: RouteProp<HomeStackParamList, 'ArtistAlbums'>;
}

const ArtistAlbumsScreen: React.FC<ArtistAlbumsScreenProps> = props => {
  const {route, navigation} = props;
  const artistId = route.params.id;

  const dispatch = useAppDispatch();

  const {artistAlbums} = useSelector((state: RootState) => ({
    artistAlbums: state.paginator.artistAlbums[artistId],
  }));

  useEffect(() => {
    dispatch(fetchArtistAlbums(artistId, true));
  }, [artistId, dispatch]);

  const handleLoadMore = useCallback(() => {
    if (artistAlbums && !artistAlbums.isLoading && artistAlbums.next) {
      dispatch(fetchArtistAlbums(artistId, false));
    }
  }, [artistAlbums, artistId, dispatch]);

  const handleAlbumPress = useCallback(
    item => () => NavigationHelper.gotoAlbumScreen(navigation, item.id),
    [navigation],
  );

  const renderItem = useMemo(
    () => (item: ItemRenderType) => {
      return (
        <AlbumItem
          key={item.item.id}
          data={item.item}
          onPress={handleAlbumPress(item.item)}
        />
      );
    },
    [handleAlbumPress],
  );

  const getItemLayout = useCallback(
    (_data: IAlbumItem[] | null | undefined, index: number) => ({
      length: ITEM_SIZE,
      offset: ITEM_SIZE * index,
      index,
    }),
    [],
  );

  if (!artistAlbums) {
    return <Loader />;
  }

  return (
    <ScreenWrapper>
      <FlatList
        data={artistAlbums.items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.list}
        onEndReached={handleLoadMore}
        getItemLayout={getItemLayout}
        onEndReachedThreshold={0.8}
        initialNumToRender={2}
        maxToRenderPerBatch={4}
        windowSize={5}
        removeClippedSubviews={true}
      />
    </ScreenWrapper>
  );
};

export default ArtistAlbumsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingBottom: SPACE_16,
  },
});
