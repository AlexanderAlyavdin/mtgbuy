import ICardItem from '@shared/interfaces/ICardItem';

export default interface ICardShop {
    shopName: string,
    hostUrl: string,
    searchCard(cardName: string): Promise<Document>,
    parseSearchResult(document: Document): Array<ICardItem>
}