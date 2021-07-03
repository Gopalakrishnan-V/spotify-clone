export interface IFeedResponse {
  data: IFeedItem[];
}

export interface IFeedItem {
  itemType: string;
  id?: string | null;
  type?: string | null;
  title?: string | null;
  subTitle?: string | null;
  imageUrl?: string | null;
  data: IFeedRowItem[];
}

export interface IFeedRowItem {
  id?: string | null;
  type?: string | null;
  title?: string | null;
  subTitle?: string | null;
  imageUrl: string;
}
