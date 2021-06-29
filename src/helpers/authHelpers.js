import Config from 'react-native-config';

import SpotifyClient from '../../SpotifyClient';
import {ACCESS_TOKEN, getItem, setItem} from './storageHelpers';

const TOKEN_API = 'https://accounts.spotify.com/api/token/';
const CLIENT_CREDENTIALS = 'client_credentials';

export const checkAndSetAccessToken = async () => {
  const accessToken = await getItem(ACCESS_TOKEN);
  if (!accessToken) {
    return await updateAccessToken();
  } else {
    SpotifyClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    return {error: null, payload: {accessToken}};
  }
};

export const updateAccessToken = async () => {
  try {
    const response = await fetch(TOKEN_API, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Config.BASE_64_CLIENT_ID_SECRET}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({grant_type: CLIENT_CREDENTIALS}).toString(),
    }).then(res => res.json());

    const accessToken = response.access_token;
    await setItem(ACCESS_TOKEN, accessToken);
    SpotifyClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    return {error: null, payload: {accessToken}};
  } catch (error) {
    return {error};
  }
};
