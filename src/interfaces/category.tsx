import {IImage} from './image';

export interface ICategoryItem {
  id: string;
  name: string;
  icons: IImage[];
}

export interface ICategoryPlaylistItem {
  id: string;
  name: string;
  images: IImage[];
}
