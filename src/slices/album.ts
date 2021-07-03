import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import SpotifyClient from '../../SpotifyClient';
import {IAlbumDetails} from '../interfaces/album';

export const fetchAlbumDetails = createAsyncThunk(
  'album/fetchAlbumDetails',
  (id: string): Promise<IAlbumDetails> =>
    SpotifyClient.get(`v1/albums/${id}/?market=IN`),
);

interface AlbumState {
  details: {[key: string]: IAlbumDetails | undefined};
}

const initialState: AlbumState = {
  details: {},
};

export const albumSlice = createSlice({
  name: 'album',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchAlbumDetails.fulfilled, (state, action) => {
      state.details[action.meta.arg] = action.payload;
    });
  },
});

export const {} = albumSlice.actions;

export default albumSlice.reducer;
