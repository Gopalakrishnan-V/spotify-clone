import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import SpotifyClient from '../../SpotifyClient';
import {IFeedItem, IFeedItemDataSource} from '../interfaces/feed';
import {convertResponseItemsToFeedItems} from '../helpers/feedHelpers';

export const fetchFeed = createAsyncThunk(
  'feed/fetchFeed',
  (arg: {page: Number; dataSources: IFeedItemDataSource[]}): Promise<any[]> => {
    const promises = [];
    for (let dataSource of arg.dataSources) {
      promises.push(SpotifyClient.get(dataSource.url));
    }
    return Promise.all(promises);
  },
);
interface FeedState {
  isLoading: Boolean;
  data: IFeedItem[] | null;
}

const initialState: FeedState = {
  isLoading: false,
  data: null,
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchFeed.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(fetchFeed.fulfilled, (state, action) => {
      const {page, dataSources} = action.meta.arg;
      const responses = action.payload;
      state.isLoading = false;
      const newFeedItems = convertResponseItemsToFeedItems(
        responses,
        dataSources,
      );
      if (page === 1) {
        state.data = newFeedItems;
      } else {
        state.data?.push(...newFeedItems);
      }
    });
    builder.addCase(fetchFeed.rejected, state => {
      state.isLoading = false;
    });
  },
});

export const {} = feedSlice.actions;

export default feedSlice.reducer;
