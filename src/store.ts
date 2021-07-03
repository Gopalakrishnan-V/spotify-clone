import {configureStore} from '@reduxjs/toolkit';
import feedReducer from './slices/feed';
import albumReducer from './slices/album';
import artistReducer from './slices/artist';
import playlistReducer from './slices/playlist';
import playerReducer from './slices/player';

export const store = configureStore({
  reducer: {
    feed: feedReducer,
    album: albumReducer,
    artist: artistReducer,
    playlist: playlistReducer,
    player: playerReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
