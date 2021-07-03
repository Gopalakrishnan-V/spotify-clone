import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import SpotifyClient from '../../SpotifyClient';
import {IAlbumItem} from '../interfaces/album';
import {IArtistDetails} from '../interfaces/artist';
import {ITrack} from '../interfaces/track';

export const fetchArtistDetails = createAsyncThunk(
  'artist/fetchArtistDetails',
  (id: string): Promise<IArtistDetails> =>
    SpotifyClient.get(`v1/artists/${id}?market=IN`),
);

export const fetchArtistTopTracks = createAsyncThunk(
  'artist/fetchArtistTopTracks',
  (id: string): Promise<{tracks: ITrack[]}> =>
    SpotifyClient.get(`v1/artists/${id}/top-tracks?market=IN`),
);

export const fetchArtistAlbums = createAsyncThunk(
  'artist/fetchArtistAlbums',
  (id: string): Promise<{items: IAlbumItem[]}> =>
    SpotifyClient.get(`v1/artists/${id}/albums?market=IN&limit=5`),
);

interface ArtistState {
  detailsLoading: {[key: string]: boolean | undefined};
  details: {[key: string]: IArtistDetails | undefined};
  topTracksLoading: {[key: string]: boolean | undefined};
  topTracks: {[key: string]: {tracks: ITrack[]} | undefined};
  albumsLoading: {[key: string]: boolean | undefined};
  albums: {[key: string]: {items: IAlbumItem[]} | undefined};
}

const initialState: ArtistState = {
  detailsLoading: {},
  details: {},
  topTracksLoading: {},
  topTracks: {},
  albumsLoading: {},
  albums: {},
};

export const artistSlice = createSlice({
  name: 'artist',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchArtistDetails.pending, (state, action) => {
      state.detailsLoading[action.meta.arg] = true;
    });
    builder.addCase(fetchArtistDetails.fulfilled, (state, action) => {
      state.detailsLoading[action.meta.arg] = false;
      state.details[action.meta.arg] = action.payload;
    });
    builder.addCase(fetchArtistDetails.rejected, (state, action) => {
      state.detailsLoading[action.meta.arg] = false;
    });
    builder.addCase(fetchArtistTopTracks.pending, (state, action) => {
      state.topTracksLoading[action.meta.arg] = true;
    });
    builder.addCase(fetchArtistTopTracks.fulfilled, (state, action) => {
      state.topTracksLoading[action.meta.arg] = false;
      state.topTracks[action.meta.arg] = action.payload;
    });
    builder.addCase(fetchArtistTopTracks.rejected, (state, action) => {
      state.topTracksLoading[action.meta.arg] = false;
    });
    builder.addCase(fetchArtistAlbums.pending, (state, action) => {
      state.albumsLoading[action.meta.arg] = true;
    });
    builder.addCase(fetchArtistAlbums.fulfilled, (state, action) => {
      state.albumsLoading[action.meta.arg] = false;
      state.albums[action.meta.arg] = action.payload;
    });
    builder.addCase(fetchArtistAlbums.rejected, (state, action) => {
      state.albumsLoading[action.meta.arg] = false;
    });
  },
});

export const {} = artistSlice.actions;

export default artistSlice.reducer;
