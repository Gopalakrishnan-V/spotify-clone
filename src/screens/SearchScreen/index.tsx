import React, {useCallback, useEffect} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {View, StyleSheet, FlatList} from 'react-native';
import {useSafeAreaInsets, EdgeInsets} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import Text from '../../components/Text';
import {SPACE_12, SPACE_16, SPACE_24} from '../../constants/dimens';
import {fetchCategories} from '../../slices/paginator';
import {RootState, useAppDispatch} from '../../store';
import {SearchStackParamList} from '../MainScreen';
import StaticSearchBar from './StaticSearchBar';
import Loader from '../../components/Loader';
import chunk from 'lodash/chunk';
import {ICategoryItem} from '../../interfaces/category';
import CategoryItem from './CategoryItem';
import {getCategoryColor} from '../../helpers/colorHelpers';
import NavigationHelper from '../../helpers/NavigationHelper';

interface SearchScreenProps {
  navigation: StackNavigationProp<SearchStackParamList>;
}

const STATIC_ITEMS = [
  {type: 'title'},
  {type: 'searchBar'},
  {type: 'listTitle'},
];

const SearchScreen: React.FC<SearchScreenProps> = props => {
  const {navigation} = props;
  const insets = useSafeAreaInsets();
  const styles = makeStyles(insets);

  const dispatch = useAppDispatch();

  const {categories} = useSelector((state: RootState) => ({
    categories: state.paginator.categories['-'],
  }));

  useEffect(() => {
    dispatch(fetchCategories(true));
  }, [dispatch]);

  const handleLoadMore = useCallback(async () => {
    if (categories && !categories.isLoading && categories.next) {
      dispatch(fetchCategories(false));
    }
  }, [categories, dispatch]);

  const handleSearchPress = useCallback(() => {}, []);

  const handleCategoryPress = useCallback(
    (item: ICategoryItem) => () => {
      NavigationHelper.gotoCategoryPlaylistsScreen(
        navigation,
        item.id,
        item.name,
      );
    },
    [navigation],
  );

  const renderCategoryItem = (item: ICategoryItem, index: number) => {
    const backgroundColor = getCategoryColor(index);
    return (
      <CategoryItem
        data={item}
        onPress={handleCategoryPress(item)}
        backgroundColor={backgroundColor}
      />
    );
  };

  const renderItem = ({item, index}: {item: any; index: number}) => {
    switch (item.type) {
      case 'title': {
        return (
          <Text
            key={item.type}
            label="Search"
            as="title3"
            style={styles.title}
          />
        );
      }
      case 'searchBar': {
        return <StaticSearchBar key={item.type} onPress={handleSearchPress} />;
      }
      case 'listTitle': {
        return (
          <Text
            key={item.type}
            label="Browse all"
            as="title4"
            style={styles.browseAll}
          />
        );
      }
      default: {
        const [first, second] = item;
        return (
          <View key={String(index)} style={styles.categoriesRow}>
            {renderCategoryItem(first, index * 2)}
            <View style={styles.categoriesDivider} />
            {second ? (
              renderCategoryItem(second, index * 2 + 1)
            ) : (
              <View style={styles.fullWidth} />
            )}
          </View>
        );
      }
    }
  };

  if (!categories) {
    return <Loader />;
  }

  const data = [...STATIC_ITEMS, ...chunk(categories.items, 2)];
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.list}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.8}
      />
    </View>
  );
};

const makeStyles = (insets: EdgeInsets) =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginTop: insets.top,
      paddingHorizontal: SPACE_16,
    },
    list: {
      paddingBottom: SPACE_16,
    },
    title: {
      marginTop: SPACE_24,
      marginBottom: 20,
    },
    browseAll: {
      alignSelf: 'center',
      marginTop: SPACE_24,
      marginBottom: SPACE_12,
    },
    categoriesRow: {
      flexDirection: 'row',
      marginBottom: SPACE_16,
    },
    categoriesDivider: {
      width: SPACE_16,
    },
    fullWidth: {
      flex: 1,
    },
  });

export default SearchScreen;
