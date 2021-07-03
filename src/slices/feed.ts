import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import SpotifyClient from '../../SpotifyClient';
import {IFeedResponse} from '../interfaces/feed';

const FEED_URL =
  'https://firebasestorage.googleapis.com/v0/b/sample-a8754.appspot.com/o/p%2Fspotify%2Fapi%2Ffeed%2F1.json?alt=media&token=fe70d811-cc7b-4147-a0ca-4a1fa6fd54e1';

export const fetchFeed = createAsyncThunk(
  'feed/fetchFeed',
  (): Promise<IFeedResponse> => SpotifyClient.get(FEED_URL),
);

interface FeedState {
  data: IFeedResponse | null;
}

const initialState: FeedState = {
  data: null,
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchFeed.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  },
});

export const {} = feedSlice.actions;

export default feedSlice.reducer;
