import {IAlbumItem} from './album';
import {ICategoryPlaylistItem} from './category';

export interface IFeedItemDataSource {
  type: 'album' | 'playlist';
  title: string;
  url: string;
}

export interface IFeedItem {
  type: 'album' | 'playlist';
  title: string;
  data: IAlbumItem[] | ICategoryPlaylistItem[];
}
