import React, {useEffect, useCallback, useMemo} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {useSelector} from 'react-redux';

import Loader from '../../components/Loader';
import ScreenWrapper from '../../components/ScreenWrapper';
import {SPACE_16, SPACE_32} from '../../constants/dimens';
import NavigationHelper from '../../helpers/NavigationHelper';
import {SearchStackParamList} from '../MainScreen';
import {RootState, useAppDispatch} from '../../store';
import {fetchCategoryPlaylists} from '../../slices/paginator';
import {ICategoryPlaylistItem} from '../../interfaces/category';
import CategoryPlaylistItem from '../../components/CategoryPlaylistItem';

interface ItemRenderType {
  item: ICategoryPlaylistItem;
  index: number;
}

interface CategoryPlaylistsScreenProps {
  navigation: StackNavigationProp<SearchStackParamList>;
  route: RouteProp<SearchStackParamList, 'CategoryPlaylists'>;
}

const CategoryPlaylistsScreen: React.FC<CategoryPlaylistsScreenProps> =
  props => {
    const {route, navigation} = props;
    const categoryId = route.params.id;

    const dispatch = useAppDispatch();

    const {categoryPlaylists} = useSelector((state: RootState) => ({
      categoryPlaylists: state.paginator.categoryPlaylists[categoryId],
    }));

    useEffect(() => {
      dispatch(fetchCategoryPlaylists(categoryId, true));
    }, [categoryId, dispatch]);

    const handleLoadMore = useCallback(() => {
      if (
        categoryPlaylists &&
        !categoryPlaylists.isLoading &&
        categoryPlaylists.next
      ) {
        dispatch(fetchCategoryPlaylists(categoryId, false));
      }
    }, [categoryPlaylists, categoryId, dispatch]);

    const handleItemPress = useCallback(
      (item: ICategoryPlaylistItem) => () =>
        NavigationHelper.gotoPlaylistScreen(navigation, item.id),
      [navigation],
    );

    const renderItem = useMemo(
      () => (item: ItemRenderType) => {
        const style = [
          styles.item,
          item.index % 2 === 1 ? styles.rightItem : {},
        ];
        return (
          <CategoryPlaylistItem
            data={item.item}
            onPress={handleItemPress(item.item)}
            style={style}
          />
        );
      },
      [handleItemPress],
    );

    if (!categoryPlaylists) {
      return <Loader />;
    }

    return (
      <ScreenWrapper>
        <FlatList
          data={categoryPlaylists.items}
          renderItem={renderItem}
          numColumns={2}
          keyExtractor={(item, index) => item?.id ?? String(index)}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.list}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.8}
          initialNumToRender={2}
          maxToRenderPerBatch={4}
          windowSize={5}
          removeClippedSubviews={true}
        />
      </ScreenWrapper>
    );
  };

export default CategoryPlaylistsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingHorizontal: SPACE_16,
    paddingBottom: SPACE_32,
  },
  item: {
    flex: 0.5,
  },
  rightItem: {
    marginStart: SPACE_16,
  },
});
