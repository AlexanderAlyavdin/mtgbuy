import ICardItem from './ICardItem';

export default interface ISearchResult {
  cardName: string;
  searchResult: Array<ICardItem>;
  error?: string;
}
