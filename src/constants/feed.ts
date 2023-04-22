import {IFeedItemDataSource} from '../interfaces/feed';

export const FEED_PAGE_LIMIT = 3;

export const FEED_ITEMS_SOURCE: IFeedItemDataSource[] = [
  {
    type: 'album',
    title: 'New releases',
    url: 'v1/browse/new-releases/?market=IN',
  },
  {
    type: 'playlist',
    title: 'Top lists',
    url: 'v1/browse/categories/toplists/playlists/?country=IN',
  },
  {
    type: 'playlist',
    title: 'Bollywood',
    url: 'v1/browse/categories/0JQ5DAqbMKFHCxg5H5PtqW/playlists/?country=IN',
  },
  {
    type: 'playlist',
    title: 'Punjabi',
    url: 'v1/browse/categories/0JQ5DAqbMKFKSopHMaeIeI/playlists/?country=IN',
  },
  {
    type: 'playlist',
    title: 'Tamil',
    url: 'v1/browse/categories/0JQ5DAqbMKFE33XAyDiPIr/playlists/?country=IN',
  },
  {
    type: 'playlist',
    title: 'Telugu',
    url: 'v1/browse/categories/0JQ5DAqbMKFIdOwkMWR5at/playlists/?country=IN',
  },
];
