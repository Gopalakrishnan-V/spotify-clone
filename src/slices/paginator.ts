import {createAction, createReducer, Dispatch} from '@reduxjs/toolkit';
import SpotifyClient from '../../SpotifyClient';
import {IAlbumItem} from '../interfaces/album';
import { ICategoryItem, ICategoryPlaylistItem } from '../interfaces/category';
import {RootState} from '../store';

interface IPageData<T> {
  items: T[];
  previos: string | null;
  next: string | null;
  total: number;
}

export interface IPaginatedData<T> {
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
  const {initialUrl, isFirstPage, entityKey} = config;
  const nextUrl = getState().paginator.[config.entityKey].[config.resultKey]?.next;

  const url = isFirstPage || !nextUrl ? initialUrl : nextUrl;
  const meta = {...config, isFirstPage: isFirstPage || !nextUrl};

  try {
    dispatch(fetchPagePending(config));
    const response: any = await SpotifyClient.get(url)
    let pageData: IPageData<any> = response
    if(entityKey === "categories"){
      pageData = response.categories
    } else if(entityKey === "categoryPlaylists"){
      pageData = response.playlists
    }

    dispatch(
      fetchPageFulfilled({
        meta,
        payload: pageData,
      }),
    );
    return {meta, payload: pageData};
  } catch (error) {
    const newError = error.response.data
      ? {response: {data: error.response.data}}
      : {message: error.message};
    dispatch(fetchPageRejected({meta: meta, error: newError}));
    return {meta, error};
  }
};

interface PaginatorState {
  artistAlbums: {
    [key: string]: IPaginatedData<IAlbumItem> | undefined;
  };
  categories: {
    [key: string]: IPaginatedData<ICategoryItem>| undefined;
  };
  categoryPlaylists: {
    [key: string]: IPaginatedData<ICategoryPlaylistItem>| undefined;
  };
}

const initialState: PaginatorState = {
  artistAlbums: {},
  categories: {},
  categoryPlaylists: {},
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
        ? payload.items.filter(item => !!item)
        : oldPaginatedData!.items.concat(...payload.items.filter(item => !!item));
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

export const fetchCategories = (isFirstPage: boolean) => {
  const initialUrl = 'v1/browse/categories?country=IN';
  const config: IPagingConfig = {
    entityKey: 'categories',
    resultKey: '-',
    isFirstPage,
    initialUrl,
  };

  return (dispatch: Dispatch, getState: () => RootState) => {
    return fetchPage(config, dispatch, getState);
  };
};

export const fetchCategoryPlaylists = (id: string, isFirstPage: boolean) => {
  const initialUrl = `v1/browse/categories/${id}/playlists/?country=IN`;
  const config: IPagingConfig = {
    entityKey: 'categoryPlaylists',
    resultKey: id,
    isFirstPage,
    initialUrl,
  };

  return (dispatch: Dispatch, getState: () => RootState) => {
    return fetchPage(config, dispatch, getState);
  };
};