import React, {useState} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {StyleSheet, View} from 'react-native';

import {SearchStackParamList} from '../MainScreen';
import SearchBar from './SearchBar';
import EmptyState from './EmptyState';
import {NOT_FOUND_STATE_SUB_TITLE, NOT_FOUND_STATE_TITLE} from './constants';
import SpotifyClient from '../../../SpotifyClient';
import {ISearchResponse, ISearchResult} from '../../interfaces/search';
import {convertSearchResponseIntoSearchResults} from '../../helpers/searchHelpers';

interface SearchResultsScreenProps {
  navigation: StackNavigationProp<SearchStackParamList>;
}

const SearchResultsScreen: React.FC<SearchResultsScreenProps> = props => {
  const {navigation} = props;
  const insets = useSafeAreaInsets();
  const styles = makeStyles(insets);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ISearchResult[]>([]);

  const fetchResults = async (searchQuery: string) => {
    try {
      const response: ISearchResponse = await SpotifyClient.get('v1/search', {
        params: {
          q: searchQuery,
          type: 'album,artist,playlist,track',
          market: 'IN',
        },
      });
      setResults(convertSearchResponseIntoSearchResults(response));
    } catch (error) {}
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    fetchResults(newQuery);
  };

  const handleClearPress = () => {
    setQuery('');
  };

  console.log({results});
  return (
    <View style={styles.container}>
      <SearchBar
        query={query}
        onQueryChange={handleQueryChange}
        onBackPress={handleBackPress}
        onClearPress={handleClearPress}
      />
      <EmptyState
        title={NOT_FOUND_STATE_TITLE}
        subTitle={NOT_FOUND_STATE_SUB_TITLE}
      />
    </View>
  );
};

const makeStyles = (insets: EdgeInsets) =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginTop: insets.top,
    },
  });

export default SearchResultsScreen;
