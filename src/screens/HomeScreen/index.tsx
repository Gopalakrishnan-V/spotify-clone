import React, {useEffect, useState} from 'react';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSelector} from 'react-redux';

import Loader from '../../components/Loader';
import ScreenWrapper from '../../components/ScreenWrapper';
import {HomeStackParamList} from '../MainScreen';
import {RootState, useAppDispatch} from '../../store';
import {fetchFeed} from '../../slices/feed';
import {FEED_ITEMS_SOURCE, FEED_PAGE_LIMIT} from '../../constants/feed';
import {FlatList, RefreshControl, StyleSheet} from 'react-native';
import {SPACE_8} from '../../constants/dimens';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {IFeedItem} from '../../interfaces/feed';
import FeedItem from './FeedRow';
import NavigationHelper from '../../helpers/NavigationHelper';
import {IAlbumItem} from '../../interfaces/album';
import {ICategoryPlaylistItem} from '../../interfaces/category';

interface HomeScreenProps {
  navigation: StackNavigationProp<HomeStackParamList>;
  route: RouteProp<HomeStackParamList, 'Home'>;
}

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const {data, isLoading} = useSelector((state: RootState) => state.feed);
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const fetchFirstPage = async () => {
    const dataSources = FEED_ITEMS_SOURCE.slice(0, FEED_PAGE_LIMIT);
    await dispatch(fetchFeed({page: 1, dataSources}));
  };

  useEffect(() => {
    fetchFirstPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchFirstPage();
    setRefreshing(false);
  };

  const handleEndReached = () => {
    const feedItemsCount = data?.length ?? 0;
    if (!isLoading && feedItemsCount < FEED_ITEMS_SOURCE.length) {
      const page = feedItemsCount / FEED_PAGE_LIMIT;
      const offset = page * FEED_PAGE_LIMIT;
      const dataSources = FEED_ITEMS_SOURCE.slice(
        offset,
        offset + FEED_PAGE_LIMIT,
      );
      dispatch(fetchFeed({page: page + 1, dataSources}));
    }
  };

  const handleRowItemPress = (
    type: 'album' | 'playlist',
    rowItem: IAlbumItem | ICategoryPlaylistItem,
  ) => {
    if (type === 'album') {
      const id = (rowItem as IAlbumItem).id;
      NavigationHelper.gotoAlbumScreen(navigation, id);
    } else if (type === 'playlist') {
      const id = (rowItem as ICategoryPlaylistItem).id;
      NavigationHelper.gotoPlaylistScreen(navigation, id);
    }
  };

  const renderItem = ({item, index}: {item: IFeedItem; index: number}) => {
    return (
      <FeedItem
        data={item}
        rowIndex={index}
        onRowItemPress={handleRowItemPress}
      />
    );
  };

  const renderRefreshControl = () => {
    return <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />;
  };

  if (!data && isLoading) {
    return <Loader />;
  }

  const contentStyle = [styles.listContent, {paddingTop: insets.top + SPACE_8}];
  return (
    <ScreenWrapper>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(_, index) => String(index)}
        onEndReached={handleEndReached}
        contentContainerStyle={contentStyle}
        showsVerticalScrollIndicator={false}
        refreshControl={renderRefreshControl()}
      />
    </ScreenWrapper>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 40,
  },
});
