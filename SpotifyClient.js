import Axios from 'axios';
import applyCaseMiddleware from 'axios-case-converter';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import {setupCache} from 'axios-cache-adapter';
import {updateAccessToken} from './src/helpers/authHelpers';

export const BASE_URL = 'https://api.spotify.com/';

const cache = setupCache({maxAge: 15 * 60 * 1000});

const SpotifyClient = applyCaseMiddleware(
  Axios.create({
    baseURL: BASE_URL,
    adapter: cache.adapter,
  }),
);

SpotifyClient.interceptors.response.use(response => response.data);

const refreshAuthLogic = async failedRequest => {
  const {payload} = await updateAccessToken();
  if (payload) {
    const {accessToken} = payload;
    failedRequest.response.config.headers.Authorization = `Bearer ${accessToken}`;
  }
};

createAuthRefreshInterceptor(SpotifyClient, refreshAuthLogic);

export default SpotifyClient;
