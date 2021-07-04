import {createAction, createReducer, Dispatch} from '@reduxjs/toolkit';
import SpotifyClient from '../../SpotifyClient';
import {IAlbumItem} from '../interfaces/album';
import {RootState} from '../store';

interface IPageData<T> {
  items: T[];
  previos: string | null;
  next: string | null;
  total: number;
}

interface IPaginatedData<T> {
  items: T[];
  pages: IPageData<T>[];
  next: string | null;
  isLoading: boolean;
}

interface IPagingConfig {
  entityKey: string;
  resultKey: string;
  isFirstPage: boolean;
  initialUrl: string;
}

const fetchPagePending = createAction<IPagingConfig>(
  'paginator/fetchPage/pending',
);
const fetchPageFulfilled = createAction<{
  meta: IPagingConfig;
  payload: IPageData<any>;
}>('paginator/fetchPage/fulfilled');
const fetchPageRejected = createAction<{meta: IPagingConfig; error: any}>(
  'paginator/fetchPage/rejected',
);

const fetchPage = async (
  config: IPagingConfig,
  dispatch: Dispatch,
  getState: () => RootState,
) => {
  const {initialUrl, isFirstPage} = config;
  const nextUrl = getState().paginator.artistAlbums[config.resultKey]?.next;

  const url = isFirstPage || !nextUrl ? initialUrl : nextUrl;
  const meta = {...config, isFirstPage: isFirstPage || !nextUrl};

  try {
    dispatch(fetchPagePending(config));

    const response: IPageData<any> = await SpotifyClient.get(url);
    dispatch(
      fetchPageFulfilled({
        meta,
        payload: response,
      }),
    );
    return {meta, payload: response};
  } catch (error) {
    const newError = error.response.data
      ? {response: {data: error.response.data}}
      : {message: error.message};
    dispatch(fetchPageRejected({meta: meta, error: newError}));
    return {meta, error};
  }
};

interface PaginatorState {
  [key: string]: {
    [key: string]: IPaginatedData<IAlbumItem> | undefined;
  };
}

const initialState: PaginatorState = {
  artistAlbums: {},
};

export default createReducer(initialState, builder => {
  builder
    .addCase(fetchPagePending, (state, action) => {
      const meta: IPagingConfig = action.payload;
      const isPresent = !!state[meta.entityKey]?.[meta.resultKey];

      if (!isPresent) {
        state[meta.entityKey][meta.resultKey] = {
          items: [],
          pages: [],
          next: null,
          isLoading: true,
        };
      }

      state[meta.entityKey][meta.resultKey]!.isLoading = true;
    })
    .addCase(fetchPageFulfilled, (state, action) => {
      const {meta, payload} = action.payload;
      const {isFirstPage} = meta;
      const oldPaginatedData = state[meta.entityKey][meta.resultKey];
      const newItems = isFirstPage
        ? payload.items
        : oldPaginatedData!.items.concat(...payload.items);
      const newPages = isFirstPage
        ? [payload]
        : oldPaginatedData!.pages.concat(payload);

      state[meta.entityKey][meta.resultKey] = {
        items: newItems,
        pages: newPages,
        next: payload.next,
        isLoading: false,
      };
    })
    .addCase(fetchPageRejected, (state, action) => {
      const {meta} = action.payload;
      state[meta.entityKey][meta.resultKey]!.isLoading = false;
    });
});

export const fetchArtistAlbums = (id: string, isFirstPage: boolean) => {
  const initialUrl = `v1/artists/${id}/albums?market=IN&limit=50`;
  const config: IPagingConfig = {
    entityKey: 'artistAlbums',
    resultKey: id,
    isFirstPage,
    initialUrl,
  };

  return (dispatch: Dispatch, getState: () => RootState) => {
    return fetchPage(config, dispatch, getState);
  };
};
