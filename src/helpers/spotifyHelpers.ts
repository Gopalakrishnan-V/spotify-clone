import {Track} from 'react-native-track-player';
import {IAlbumDetails} from '../interfaces/album';
import {IArtistItem} from '../interfaces/artist';
import {IImage} from '../interfaces/image';
import {ITrack} from '../interfaces/track';

export const getArtistNames = (artists: IArtistItem[]) => {
  return artists.map(artist => artist.name).join(', ') || null;
};

export const getFirstArtistName = (artists: IArtistItem[]) => {
  return artists?.[0]?.name ?? null;
};

export const getArtwork = (images?: IImage[]) => {
  if (!images || images.length === 0) {
    return null;
  }
  return images[0].url;
};

export const convertSpotifyTracksToTrackPlayerTracks = (
  tracks: ITrack[],
  album?: IAlbumDetails,
) => {
  const result: Track[] = [];
  for (let track of tracks) {
    const {id, previewUrl, name, artists} = track;
    if (track.previewUrl) {
      result.push({
        id,
        url: previewUrl,
        title: name,
        artist: getArtistNames(artists) ?? '',
        artwork: getArtwork(track.album?.images ?? album?.images),
        albumId: track.album?.id ?? album?.id,
        albumName: track.album?.name ?? album?.name,
      });
    }
  }

  return result;
};
