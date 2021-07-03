import React, {useState, useEffect, useCallback} from 'react';
import {FlatList} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector, useDispatch} from 'react-redux';

import Loader from '../../components/Loader';
import ScreenWrapper from '../../components/ScreenWrapper';
import NavigationHelper from '../../helpers/NavigationHelper';
import {HomeStackParamList} from '../MainScreen';
import FeedRow from './FeedRow';
import {RootState} from '../../store';
import {fetchFeed} from '../../slices/feed';
import {SPACE_8} from '../../constants/dimens';

interface HomeScreenProps {
  navigation: StackNavigationProp<HomeStackParamList>;
  route: RouteProp<HomeStackParamList, 'Home'>;
}

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const feedData = useSelector((state: RootState) => state.feed.data);
  const dispatch = useDispatch();

  const insets = useSafeAreaInsets();

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  const handleRowHeaderPress = useCallback(
    item => {
      NavigationHelper.gotoAppropriateScreenBasedOnEntity(navigation, item);
    },
    [navigation],
  );

  const handleRowItemPress = useCallback(
    rowItem => {
      NavigationHelper.gotoAppropriateScreenBasedOnEntity(navigation, rowItem);
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({item, index}) => {
      switch (item.itemType) {
        case 'horizontal_list': {
          return (
            <FeedRow
              data={item}
              rowIndex={index}
              onHeaderPress={handleRowHeaderPress}
              onRowItemPress={handleRowItemPress}
            />
          );
        }
        default: {
          return null;
        }
      }
    },
    [handleRowHeaderPress, handleRowItemPress],
  );

  if (!feedData) {
    return <Loader />;
  }

  return (
    <ScreenWrapper>
      <FlatList
        data={feedData.data}
        renderItem={renderItem}
        keyExtractor={(_, index) => String(index)}
        style={{paddingTop: insets.top + SPACE_8}}
        showsVerticalScrollIndicator={false}
      />
    </ScreenWrapper>
  );
};

export default HomeScreen;
