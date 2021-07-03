import {IImage} from './image';

export interface IArtistDetails {
  id: string;
  name: string;
  followers: {
    total: number;
  };
  images: IImage[];
}

export interface IArtistItem {
  id: string;
  name: string;
}
