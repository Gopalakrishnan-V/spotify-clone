import {IAlbumItem} from '../interfaces/album';
import {IArtistDetails} from '../interfaces/artist';
import {IPlaylistItem} from '../interfaces/playlist';
import {
  ISearchResponse,
  ISearchResult,
  ISearchResultItemData,
} from '../interfaces/search';
import {ITrack} from '../interfaces/track';
import {getArtwork} from './spotifyHelpers';

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

export const covertSearchResultToSearchResultItemData = (
  item: ISearchResult,
): ISearchResultItemData => {
  let imageUrl: string | null = null;
  let title = '';
  let subTitle = '';
  switch (item.type) {
    case 'track': {
      const data = item.data as ITrack;
      imageUrl = getArtwork(data.album?.images);
      title = data.name;
      const subTitleParts = ['Song'];
      const artistNames = data.artists.map(artist => artist.name);
      if (artistNames.length > 0) {
        subTitleParts.push(artistNames.join(', '));
      }
      subTitle = subTitleParts.join(' • ');
      break;
    }
    case 'artist': {
      const data = item.data as IArtistDetails;
      imageUrl = getArtwork(data.images);
      title = data.name;
      subTitle = 'Artist';
      break;
    }
    case 'album': {
      const data = item.data as IAlbumItem;
      imageUrl = getArtwork(data.images);
      title = data.name;

      const subTitleParts = ['Album'];
      const artistNames = (data.artists || [])?.map(artist => artist.name);
      if (artistNames.length > 0) {
        subTitleParts.push(artistNames.join(', '));
      }
      subTitle = subTitleParts.join(' • ');
      break;
    }
    case 'playlist': {
      const data = item.data as IPlaylistItem;
      imageUrl = getArtwork(data.images);
      title = data.name;
      subTitle = 'Playlist';
      break;
    }
  }
  return {imageUrl, title, subTitle};
};
