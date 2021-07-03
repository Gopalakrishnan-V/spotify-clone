import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import SpotifyClient from '../../SpotifyClient';
import {IPlaylist} from '../interfaces/playlist';

export const fetchPlaylist = createAsyncThunk(
  'playlists/fetchPlaylist',
  (id: string): Promise<IPlaylist> =>
    SpotifyClient.get(`v1/playlists/${id}?market=IN`),
);

interface PlaylistState {
  detailsLoading: {[key: string]: boolean | undefined};
  details: {[key: string]: IPlaylist | undefined};
}

const initialState: PlaylistState = {
  detailsLoading: {},
  details: {},
};

export const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchPlaylist.pending, (state, action) => {
      state.detailsLoading[action.meta.arg] = true;
    });
    builder.addCase(fetchPlaylist.fulfilled, (state, action) => {
      state.detailsLoading[action.meta.arg] = false;
      state.details[action.meta.arg] = action.payload;
    });
    builder.addCase(fetchPlaylist.rejected, (state, action) => {
      state.detailsLoading[action.meta.arg] = false;
    });
  },
});

export const {} = playlistSlice.actions;

export default playlistSlice.reducer;
