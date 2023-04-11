import {IAlbumItem} from './album';
import {IArtistItem} from './artist';
import {IPlaylist} from './playlist';
import {ITrack} from './track';

export interface ISearchResponse {
  tracks: {
    items: ITrack[];
  };
  artists: {
    items: IArtistItem[];
  };
  albums: {
    items: IAlbumItem[];
  };
  playlists: {
    items: IPlaylist[];
  };
}

export interface ISearchResult {
  type: 'track' | 'artist' | 'album' | 'playlist';
  data: ITrack | IArtistItem | IAlbumItem | IPlaylist;
}
