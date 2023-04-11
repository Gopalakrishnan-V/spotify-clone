import {ISearchResponse, ISearchResult} from '../interfaces/search';

export const convertSearchResponseIntoSearchResults = (
  response: ISearchResponse,
): ISearchResult[] => {
  const results: ISearchResult[] = [];
  const {tracks, artists, albums, playlists} = response;
  for (let track of tracks.items ?? []) {
    results.push({type: 'track', data: track});
  }
  for (let artist of artists.items ?? []) {
    results.push({type: 'artist', data: artist});
  }
  for (let album of albums.items ?? []) {
    results.push({type: 'album', data: album});
  }
  for (let playlist of playlists.items ?? []) {
    results.push({type: 'playlist', data: playlist});
  }
  return results;
};
