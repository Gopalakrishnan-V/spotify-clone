import React, {useState, useEffect, useCallback} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import SpotifyClient from '../../../SpotifyClient';
import Loader from '../../components/Loader';
import ScreenWrapper from '../../components/ScreenWrapper';
import NavigationHelper from '../../helpers/NavigationHelper';
import FeedRow from './FeedRow';

const FEED_URL =
  'https://firebasestorage.googleapis.com/v0/b/sample-a8754.appspot.com/o/p%2Fspotify%2Fapi%2Ffeed%2F1.json?alt=media&token=fe70d811-cc7b-4147-a0ca-4a1fa6fd54e1';

const HomeScreen = ({navigation}) => {
  const [feedList, setFeedList] = useState(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    (async () => {
      const response = await SpotifyClient.get(FEED_URL);
      setFeedList(response.data.data);
    })();
  }, []);

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
      switch (item.item_type) {
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

  if (!feedList) {
    return <Loader />;
  }

  return (
    <ScreenWrapper>
      <FlatList
        data={feedList}
        renderItem={renderItem}
        keyExtractor={(_, index) => String(index)}
        style={{paddingTop: insets.top + 8}}
        showsVerticalScrollIndicator={false}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScreen;
