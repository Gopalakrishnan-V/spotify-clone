import {IAlbumItem} from './album';
import {IArtistDetails} from './artist';
import {IPlaylistItem} from './playlist';
import {ITrack} from './track';

export interface ISearchResponse {
  tracks: {
    items: ITrack[];
  };
  artists: {
    items: IArtistDetails[];
  };
  albums: {
    items: IAlbumItem[];
  };
  playlists: {
    items: IPlaylistItem[];
  };
}

export interface ISearchResult {
  type: 'track' | 'artist' | 'album' | 'playlist';
  data: ITrack | IArtistDetails | IAlbumItem | IPlaylistItem;
}

export interface ISearchResultItemData {
  imageUrl: string | null;
  title: string;
  subTitle: string;
}
