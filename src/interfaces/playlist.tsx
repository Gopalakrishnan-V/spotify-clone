import {IImage} from './image';
import {ITrack} from './track';

export interface IPlaylist {
  name: string;
  followers: {total: number};
  owner: {displayName: string};
  tracks: {
    items: {
      track: ITrack;
    }[];
  };
  images: IImage[];
}

export interface IPlaylistItem {
  id: string;
  name: string;
  images: IImage[];
}
