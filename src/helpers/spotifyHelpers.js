export const getArtistNames = artists => {
  return artists.map(artist => artist.name).join(', ') || null;
};

export const getFirstArtistName = artists => {
  return artists?.[0]?.name ?? null;
};

export const getYear = date => {
  return date.split('-')[0];
};

export const getArtwork = images => {
  return images?.[0]?.url ?? null;
};

export const getTracksFromAlbum = album => {
  if (!album) {
    return [];
  }

  return album.tracks.items.map(track =>
    convertAlbumTrackItemToTrackPlayerItem(track, album),
  );
};

export const convertAlbumTrackItemToTrackPlayerItem = (track, album) => {
  return {
    id: track.id,
    url: track.preview_url,
    title: track.name,
    artist: getArtistNames(track.artists),
    artwork: getArtwork(album.images),
    albumId: album.id,
    albumName: album.name,
  };
};

export const getTracksFromPlaylist = playlist => {
  if (!playlist) {
    return [];
  }

  return playlist.tracks.items.map(({track}) =>
    convertPlaylistTrackItemToTrackPlayerItem(track),
  );
};

export const convertPlaylistTrackItemToTrackPlayerItem = track => {
  return {
    id: track.id ?? '-',
    url: track.preview_url ?? '-',
    title: track.name ?? '-',
    artist: getArtistNames(track.artists) ?? '-',
    artwork: getArtwork(track.album.images) ?? '-',
    albumId: track.album.id,
    albumName: track.album.name,
  };
};
