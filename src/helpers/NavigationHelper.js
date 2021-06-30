class NavigationHelper {
  gotoAlbumScreen = (navigation, id) => {
    navigation.navigate('Album', {id});
  };

  gotoPlaylistScreen = (navigation, id) => {
    navigation.navigate('Playlist', {id});
  };

  gotoAppropriateScreenBasedOnEntity = (navigation, data) => {
    switch (data.type) {
      case 'album': {
        return this.gotoAlbumScreen(navigation, data.id);
      }
      case 'playlist': {
        return this.gotoPlaylistScreen(navigation, data.id);
      }
      default: {
      }
    }
  };
}

export default new NavigationHelper();
