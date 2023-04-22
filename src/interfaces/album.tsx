import {IArtistItem} from './artist';
import {IImage} from './image';
import {ITrack} from './track';

export interface IAlbumDetails {
  id: string;
  name: string;
  tracks: {
    items: ITrack[];
  };
  artists: IArtistItem[];
  images: IImage[];
  releaseDate: string;
  copyrights: ICopyright[];
}

export interface IAlbumItem {
  id: string;
  name: string;
  images: IImage[];
  releaseDate: string;
  artists?: IArtistItem[];
}

interface ICopyright {
  type: string;
  text: string;
}
