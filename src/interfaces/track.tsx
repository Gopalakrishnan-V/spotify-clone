import {IAlbumItem} from './album';
import {IArtistItem} from './artist';

export interface ITrack {
  id: string;
  name: string;
  artists: IArtistItem[];
  previewUrl?: string | null;
  durationMs: number;
  album?: IAlbumItem;
}
