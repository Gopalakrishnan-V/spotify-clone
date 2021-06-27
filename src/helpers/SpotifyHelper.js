class SpotifyHelper {
  static getArtistNames = artists => {
    return artists.map(artist => artist.name).join(', ') || null;
  };

  static getFirstArtistName = artists => {
    return artists?.[0]?.name ?? null;
  };

  static getYear = date => {
    return date.split('-')[0];
  };

  static getArtwork = images => {
    return images?.[0]?.url ?? null;
  };

  static getTracksFromAlbum = album => {
    if (!album) {
      return [];
    }

    return album.tracks.items.map(track => ({
      id: track.id,
      url: track.preview_url,
      title: track.name,
      artist: SpotifyHelper.getArtistNames(track.artists),
      artwork: SpotifyHelper.getArtwork(album.images),
      albumId: album.id,
      albumName: album.name,
    }));
  };

  static getTracksFromPlaylist = playlist => {
    if (!playlist) {
      return [];
    }

    return playlist.tracks.items.map(({track}) => ({
      id: track.id ?? '-',
      url: track.preview_url ?? '-',
      title: track.name ?? '-',
      artist: SpotifyHelper.getArtistNames(track.artists) ?? '-',
      artwork: SpotifyHelper.getArtwork(track.album.images) ?? '-',
      albumId: track.album.id,
      albumName: track.album.name,
    }));
  };
}

export default SpotifyHelper;
