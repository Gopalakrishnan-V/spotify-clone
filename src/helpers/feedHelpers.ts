import {IFeedItem, IFeedItemDataSource} from '../interfaces/feed';

export const convertResponseItemsToFeedItems = (
  responses: any[],
  dataSources: IFeedItemDataSource[],
): IFeedItem[] => {
  const results: IFeedItem[] = [];
  for (let i = 0; i < dataSources.length; i++) {
    const dataSource = dataSources[i];
    const response = responses[i];
    if (response) {
      if (dataSource.type === 'album') {
        results.push({
          type: dataSource.type,
          title: dataSource.title,
          data: response.albums.items,
        });
      } else if (dataSource.type === 'playlist') {
        results.push({
          type: dataSource.type,
          title: dataSource.title,
          data: response.playlists.items,
        });
      }
    }
  }
  return results;
};
