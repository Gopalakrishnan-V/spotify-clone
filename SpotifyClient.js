import Axios from 'axios';
import {setupCache} from 'axios-cache-adapter';

const BASE_URL = 'https://api.spotify.com/';

const cache = setupCache({maxAge: 15 * 60 * 1000});

const SpotifyClient = Axios.create({
  baseURL: BASE_URL,
  adapter: cache.adapter,
});

export default SpotifyClient;
