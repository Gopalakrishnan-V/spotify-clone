import {StackNavigationProp} from '@react-navigation/stack';

class NavigationHelper {
  gotoAlbumScreen = (navigation: StackNavigationProp<any>, id: string) => {
    navigation.navigate('Album', {id});
  };

  gotoPlaylistScreen = (navigation: StackNavigationProp<any>, id: string) => {
    navigation.navigate('Playlist', {id});
  };

  gotoArtistScreen = (navigation: StackNavigationProp<any>, id: string) => {
    navigation.navigate('Artist', {id});
  };

  gotoArtistAlbumsScreen = (
    navigation: StackNavigationProp<any>,
    id: string,
  ) => {
    navigation.navigate('ArtistAlbums', {id});
  };

  gotoPlayerScreen = (navigation: StackNavigationProp<any>) => {
    navigation.navigate('Player');
  };

  gotoAppropriateScreenBasedOnEntity = (
    navigation: StackNavigationProp<any>,
    data: {type: string; id: string},
  ) => {
    const {type, id} = data;
    switch (type) {
      case 'album': {
        return this.gotoAlbumScreen(navigation, id);
      }
      case 'playlist': {
        return this.gotoPlaylistScreen(navigation, id);
      }
      default: {
      }
    }
  };
}

export default new NavigationHelper();
