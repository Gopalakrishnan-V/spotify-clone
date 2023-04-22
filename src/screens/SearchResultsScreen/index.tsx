import React, {useRef, useState} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {FlatList, StyleSheet, View} from 'react-native';
import debounce from 'lodash/debounce';

import {SearchStackParamList} from '../MainScreen';
import SearchBar from './SearchBar';
import EmptyState from './EmptyState';
import {
  EMPTY_STATE_SUB_TITLE,
  EMPTY_STATE_TITLE,
  NOT_FOUND_STATE_SUB_TITLE,
  NOT_FOUND_STATE_TITLE,
} from './constants';
import SpotifyClient from '../../../SpotifyClient';
import {ISearchResponse, ISearchResult} from '../../interfaces/search';
import {convertSearchResponseIntoSearchResults} from '../../helpers/searchHelpers';
import SearchResultItem from '../../components/SearchResultItem';
import {ITrack} from '../../interfaces/track';
import {addTracks} from '../../helpers/playerHelpers';
import {convertSpotifyTracksToTrackPlayerTracks} from '../../helpers/spotifyHelpers';
import {IArtistDetails} from '../../interfaces/artist';
import {IPlaylistItem} from '../../interfaces/playlist';
import {IAlbumItem} from '../../interfaces/album';
import NavigationHelper from '../../helpers/NavigationHelper';

interface SearchResultsScreenProps {
  navigation: StackNavigationProp<SearchStackParamList>;
}

const SearchResultsScreen: React.FC<SearchResultsScreenProps> = props => {
  const {navigation} = props;
  const insets = useSafeAreaInsets();
  const styles = makeStyles(insets);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ISearchResult[]>([]);
  const flatListRef = useRef<FlatList>(null);

  const debouncedSearch = useRef(
    debounce(async (searchQuery: string) => {
      try {
        const response: ISearchResponse = await SpotifyClient.get('v1/search', {
          params: {
            q: searchQuery,
            type: 'album,artist,playlist,track',
            market: 'IN',
            limit: 5,
          },
        });
        setResults(convertSearchResponseIntoSearchResults(response));
        if (flatListRef.current) {
          flatListRef.current.scrollToOffset({offset: 0, animated: false});
        }
      } catch (error) {}
    }, 500),
  ).current;

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    debouncedSearch(newQuery);
  };

  const handleClearPress = () => {
    setQuery('');
    setResults([]);
  };

  const handleItemPress = (item: ISearchResult) => () => {
    switch (item.type) {
      case 'track': {
        const data = item.data as ITrack;
        addTracks(convertSpotifyTracksToTrackPlayerTracks([data]));
        break;
      }
      case 'artist': {
        const data = item.data as IArtistDetails;
        NavigationHelper.gotoArtistScreen(navigation, data.id);
        break;
      }
      case 'album': {
        const data = item.data as IAlbumItem;
        NavigationHelper.gotoAlbumScreen(navigation, data.id);
        break;
      }
      case 'playlist': {
        const data = item.data as IPlaylistItem;
        NavigationHelper.gotoPlaylistScreen(navigation, data.id);
        break;
      }
    }
  };

  const renderEmptyComponent = () => {
    const isQueryEmpty = query.length === 0;
    const title = isQueryEmpty
      ? EMPTY_STATE_TITLE
      : `${NOT_FOUND_STATE_TITLE} "${query}"`;
    const subTitle = isQueryEmpty
      ? EMPTY_STATE_SUB_TITLE
      : NOT_FOUND_STATE_SUB_TITLE;
    return <EmptyState title={title} subTitle={subTitle} />;
  };

  const renderItem = ({item}: {item: ISearchResult}) => {
    const isImageRounded = item.type === 'artist';
    return (
      <SearchResultItem
        data={item}
        onPress={handleItemPress(item)}
        isImageRounded={isImageRounded}
      />
    );
  };

  return (
    <View style={styles.container}>
      <SearchBar
        query={query}
        onQueryChange={handleQueryChange}
        onBackPress={handleBackPress}
        onClearPress={handleClearPress}
      />
      <FlatList
        ref={flatListRef}
        data={results}
        renderItem={renderItem}
        keyExtractor={(item, index) => String(index)}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={styles.listContent}
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
    listContent: {
      paddingVertical: 16,
    },
  });

export default SearchResultsScreen;
