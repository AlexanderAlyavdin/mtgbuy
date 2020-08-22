import ICardItem from '@shared/interfaces/ICardItem';
import ISearchResult from '@shared/interfaces/ISearchResult';
import ICardPreview from '@shared/interfaces/ICardPreview';

export default interface ICardShop {
  shopName: string;
  hostUrl: string;

  searchCard(cardName: string): Promise<Array<ICardItem>>;
  searchCardList(cardNames: Array<string>): Promise<Array<ISearchResult>>;

  explore?(url: string, pageNum: Number): Promise<Array<ICardPreview>>;
}
