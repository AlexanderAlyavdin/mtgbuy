import ICardItem from '@shared/interfaces/ICardItem';
import ISearchResult from '@shared/interfaces/ISearchResult';

export default interface ICardShop {
  shopName: string;
  hostUrl: string;

  searchCard(cardName: string): Promise<Array<ICardItem>>;
  searchCardList(cardNames: Array<string>): Promise<Array<ISearchResult>>;
}
