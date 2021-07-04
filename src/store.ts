import {configureStore} from '@reduxjs/toolkit';
import {useDispatch} from 'react-redux';

import feedReducer from './slices/feed';
import albumReducer from './slices/album';
import artistReducer from './slices/artist';
import playlistReducer from './slices/playlist';
import playerReducer from './slices/player';
import paginatorReducer from './slices/paginator';

export const store = configureStore({
  reducer: {
    feed: feedReducer,
    album: albumReducer,
    artist: artistReducer,
    playlist: playlistReducer,
    player: playerReducer,
    paginator: paginatorReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
